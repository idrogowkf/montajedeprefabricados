# Cuenta de cliente y solicitudes vinculadas

**Fecha:** 15 de octubre de 2026  
**Estado:** Diseño aprobado; pendiente de implementación  
**Ámbito:** Tienda, autenticación de clientes, perfil fiscal, solicitudes de producto y administración comercial

## 1. Objetivo

Convertir la autenticación existente en una cuenta de cliente útil para el marketplace. Una persona autenticada debe poder completar sus datos de contacto y facturación, enviar solicitudes vinculadas a su identidad y consultar después su historial y estado sin recurrir a referencias manuales o correos.

La navegación pública del catálogo continuará disponible sin autenticación. Para enviar una solicitud de información u oferta será obligatorio iniciar sesión y tener completo el perfil mínimo exigido para operar en España.

## 2. Problemas actuales confirmados

- `product_inquiries` no almacena el identificador del usuario autenticado.
- El panel “Mis solicitudes” contiene únicamente instrucciones para consultar por correo.
- El botón de cuenta abre el perfil genérico de Clerk y no una zona de cliente propia.
- El formulario de solicitud duplica nombre, empresa, correo y teléfono sin una fuente persistente.
- No existe un perfil fiscal ni una validación de completitud previa a la solicitud.
- La configuración global de Clerk utiliza mensajes orientados a administración, aunque la autenticación se usa también para clientes.
- El administrador puede leer solicitudes, pero no dispone de un flujo completo para actualizar estados visibles para el cliente.

## 3. Experiencia de usuario

### 3.1 Acceso a la cuenta

- El botón “Mi cuenta” y su equivalente móvil navegarán a `/mi-cuenta`.
- `/mi-cuenta` estará protegida por Clerk y conservará el inicio de sesión con Google y los demás métodos habilitados.
- La interfaz será propia de Montaje Prefabricado; no se utilizará el perfil genérico de Clerk como experiencia principal.

### 3.2 Secciones de `/mi-cuenta`

1. **Resumen**
   - Estado de completitud del perfil.
   - Número de solicitudes activas y totales.
   - Últimas solicitudes y acceso directo a su detalle.

2. **Mis solicitudes**
   - Listado ordenado por fecha descendente.
   - Referencia, producto o búsqueda, fecha, estado, mensaje y archivos aportados.
   - Estados públicos: `Recibida`, `En revisión`, `Información pendiente`, `Oferta preparada`, `Cerrada`.
   - Detalle desplegable o página interna sin exponer datos de otros usuarios.

3. **Datos de contacto y facturación**
   - Tipo de cliente: particular, autónomo o empresa.
   - Nombre y apellidos de la persona de contacto.
   - Razón social, obligatoria para empresa y opcional para autónomo cuando opere con nombre comercial.
   - Tipo de identificación: NIF/DNI, NIE, NIF de empresa o NIF-IVA UE.
   - Número de identificación fiscal.
   - Teléfono.
   - Correo principal verificado en Clerk, mostrado como no editable desde el formulario comercial.
   - Dirección fiscal: vía y número, información adicional opcional, código postal, localidad, provincia y país.
   - Dirección de entrega separada será opcional y podrá solicitarse en la oferta cuando difiera de la fiscal.

4. **Seguridad y privacidad**
   - Cierre de sesión.
   - Información sobre el correo y método de acceso activo.
   - Eliminación de cuenta con confirmación explícita y una segunda comprobación antes de ejecutar.
   - No se mostrarán opciones genéricas ajenas al flujo comercial, como añadir arbitrariamente otras cuentas conectadas.

### 3.3 Envío de solicitudes

- Los visitantes podrán explorar, buscar, filtrar y abrir fichas sin registrarse.
- Al pulsar “Solicitar información” o “Solicitar oferta”:
  1. Si no hay sesión, se solicitará inicio de sesión y se conservará el producto seleccionado.
  2. Si el perfil está incompleto, se abrirá el formulario de perfil indicando exactamente los campos pendientes.
  3. Con perfil completo, se mostrará el formulario técnico de la solicitud con los datos personales ya resueltos.
- La solicitud se creará exclusivamente desde el usuario autenticado. El servidor obtendrá correo e identidad desde Clerk; no confiará en identificadores enviados por el navegador.
- El resultado aparecerá inmediatamente en “Mis solicitudes”. La referencia seguirá existiendo como identificador operativo, pero no será el mecanismo principal de seguimiento.

## 4. Modelo de datos

### 4.1 Tabla `customer_profiles`

- `user_id text primary key`: identificador Clerk.
- `email text not null`: correo verificado normalizado para búsquedas y migración.
- `customer_type text not null`: `individual`, `self_employed` o `company`.
- `contact_name text not null`.
- `legal_name text`.
- `tax_id_type text not null`: `nif`, `nie`, `company_nif`, `eu_vat` o `other`.
- `tax_id text not null`.
- `phone text not null`.
- `address_line1 text not null`.
- `address_line2 text`.
- `postal_code text not null`.
- `city text not null`.
- `province text not null`.
- `country_code text not null default 'ES'`.
- `privacy_accepted_at timestamptz not null`.
- `created_at timestamptz not null default now()`.
- `updated_at timestamptz not null default now()`.
- `deleted_at timestamptz` para trazabilidad de anonimización, no para permitir acceso.

El NIF se normalizará a mayúsculas y sin separadores. La validación comprobará estructura y carácter de control para NIF/NIE españoles. El NIF-IVA europeo tendrá validación sintáctica en esta fase; la consulta VIES queda fuera del alcance hasta disponer del flujo comercial que la necesite.

### 4.2 Cambios en `product_inquiries`

- Añadir `user_id text` indexado.
- Añadir `profile_snapshot jsonb not null default '{}'` para preservar los datos aplicados al expediente en el momento del envío.
- Añadir `updated_at timestamptz not null default now()`.
- Añadir `public_status text not null default 'received'`.
- Añadir `admin_notes text` solo visible en administración.
- Mantener los campos actuales para compatibilidad con el histórico y los correos operativos.

No se declarará una clave foránea hacia Clerk porque la identidad reside en un servicio externo. La integridad del `user_id` se impondrá en la API autenticada.

### 4.3 Migración de solicitudes existentes

- Al guardar por primera vez un perfil, el sistema vinculará solicitudes históricas sin `user_id` cuyo correo normalizado coincida exactamente con uno de los correos verificados del usuario.
- La vinculación será idempotente y nunca reasignará solicitudes ya vinculadas.
- No se vincularán solicitudes por nombre, teléfono o correo no verificado.
- El proceso registrará cuántas solicitudes fueron vinculadas sin exponer datos personales en logs.

## 5. API y autorización

### 5.1 Perfil

- `GET /api/account/profile`: devuelve únicamente el perfil del usuario autenticado y su completitud.
- `PUT /api/account/profile`: valida y guarda el perfil; sincroniza nombre y teléfono básico con Clerk cuando proceda, sin guardar datos fiscales en metadatos públicos.
- Los datos fiscales permanecerán en Postgres. Clerk será la fuente de identidad y correo verificado, no el almacén fiscal.

### 5.2 Solicitudes

- `GET /api/account/inquiries`: devuelve únicamente filas con `user_id` igual al usuario autenticado.
- `POST /api/product-inquiries`: exigirá sesión y perfil completo, ignorará nombre/correo/fiscalidad suministrados por el navegador y creará `profile_snapshot` en el servidor.
- La respuesta incluirá la referencia y el registro público necesario para actualizar la interfaz.

### 5.3 Eliminación

- `DELETE /api/account`: requerirá sesión activa y texto de confirmación.
- Se eliminará la identidad en Clerk después de anonimizar el perfil y las solicitudes que no deban conservarse.
- Expedientes asociados a facturas, pedidos o una obligación legal futura se conservarán bloqueados y desvinculados de la cuenta, manteniendo solo los datos legalmente necesarios.
- En la fase actual, las solicitudes sin operación fiscal se anonimizarán: nombre, correo, teléfono, empresa y documentos personales; se conservarán referencia, producto, estado y fechas para métricas operativas.
- Si falla la eliminación en Clerk, la operación no se presentará como completada y quedará registrada para reintento seguro.

## 6. Administración

- La bandeja administrativa mostrará la identidad del cliente, tipo de cliente, referencia y datos del perfil usados en el expediente.
- Permitirá cambiar `public_status` con valores cerrados y actualizar una nota interna no visible para el cliente.
- Cada cambio de estado actualizará `updated_at`.
- El cliente verá el estado actualizado en su cuenta; no verá notas internas, costes, márgenes ni datos de proveedor restringidos.

## 7. Seguridad y protección de datos

- Todas las rutas de cuenta usarán `auth()` en servidor.
- Ninguna consulta de cliente aceptará `user_id` como parámetro de selección.
- Se devolverán DTO explícitos, nunca objetos completos de Clerk ni columnas administrativas.
- Los campos se validarán en servidor, se limitarán por longitud y se normalizarán antes de almacenarse.
- Los documentos subidos conservarán las reglas existentes de tamaño, extensión y HTTPS.
- La aplicación aplicará minimización de datos: no solicitará copia de DNI, fecha de nacimiento, sexo ni datos bancarios en el perfil.
- Los datos fiscales no serán públicos ni se incluirán en logs.
- La política de privacidad deberá describir finalidad, base jurídica, conservación y derechos. Este cambio implementa el control técnico; la revisión jurídica final del texto legal corresponde al responsable del negocio.

## 8. Compatibilidad y contenido legal español

El perfil distingue particular, autónomo y empresa. Aunque “CIF” siga usándose coloquialmente, la interfaz utilizará “NIF de empresa”, que es la denominación fiscal vigente. Para una factura completa se conservarán nombre o razón social, identificación fiscal y domicilio del destinatario.

Completar el perfil será obligatorio para solicitar una oferta profesional porque el flujo está orientado a contratación y facturación B2B/B2C en España. No se bloqueará la mera consulta del catálogo.

## 9. Interfaz y accesibilidad

- La cuenta utilizará la misma arquitectura gráfica negra, blanca y roja del sitio.
- Diseño adaptable a móvil y escritorio.
- Navegación por pestañas con enlaces reales y estado accesible.
- Formularios con etiquetas, errores junto al campo, resumen de errores y foco automático al primer error.
- Estados de carga, vacío y error explícitos.
- “Mis solicitudes” mostrará una invitación a explorar el catálogo solo cuando realmente no haya solicitudes.

## 10. Pruebas y aceptación

### Pruebas unitarias

- Validación de NIF/NIE y perfiles condicionales.
- Cálculo de completitud.
- Traducción de estados públicos.
- Sanitización y DTO de solicitudes.

### Pruebas de API

- Usuario no autenticado recibe `401`.
- Un usuario no puede consultar solicitudes de otro.
- Perfil incompleto impide crear una solicitud.
- Perfil completo crea una solicitud vinculada con snapshot.
- Migración por correo verificado vincula solo filas elegibles.
- Eliminación anonimiza datos y revoca la cuenta.
- Solo administración puede actualizar estados.

### Pruebas de interfaz

- “Mi cuenta” navega a `/mi-cuenta`.
- “Mis solicitudes” abre el historial real.
- La cuenta funciona en móvil y escritorio.
- Envío interrumpido por perfil incompleto lleva al formulario y permite reanudarlo.
- Los estados administrativos se reflejan para el cliente.

### Criterios de aceptación

- Una solicitud enviada por un usuario autenticado aparece en su cuenta sin intervención manual.
- Ningún usuario puede acceder a solicitudes ajenas cambiando URL o parámetros.
- No es posible enviar una solicitud con perfil incompleto.
- Los datos del perfil se pueden editar y reutilizar.
- La eliminación de cuenta tiene confirmación y tratamiento de datos coherente.
- El administrador puede cambiar el estado y el cliente puede verlo.
- Compilación, tipos, pruebas automatizadas y recorrido real en navegador superan la verificación antes del despliegue.

## 11. Fuera de alcance inmediato

- Pago en línea y checkout definitivo.
- Facturación electrónica y generación de factura.
- Validación automática VIES.
- Devoluciones y garantías de pedidos pagados.
- Mensajería bidireccional dentro de cada expediente.

Estas funciones podrán añadirse después sin alterar la relación base entre usuario, perfil y solicitud.
