# Catálogo B2B con solicitud de oferta

Fecha: 4 de octubre de 2026

## Propósito

Validar la demanda de productos para montaje prefabricado sin mantener stock, aceptar pagos ni confirmar pedidos. La web permitirá descubrir productos, preparar una cesta y enviar una solicitud de oferta no vinculante. El equipo confirmará con el proveedor disponibilidad, documentación, precio, portes y plazo antes de emitir cualquier oferta comercial vinculante.

## Alcance de la primera versión

La primera versión será exclusivamente B2B y estará orientada inicialmente al mercado español. Incluirá:

- catálogo público de 30 a 60 referencias autorizadas;
- categorías, búsqueda y filtros básicos;
- fichas de producto con información técnica y documentación disponible;
- cesta de solicitud de oferta, sin pago;
- registro e inicio de sesión por enlace seguro enviado por correo;
- perfil de empresa y direcciones;
- historial y estado de solicitudes;
- formulario para solicitudes de montaje, ingeniería o plan de izado asociado;
- panel interno para revisar, actualizar y responder solicitudes;
- correos de confirmación al cliente y notificación interna;
- métricas de interés por producto y conversión a solicitud.

Quedan fuera de esta versión: pasarela de pago, facturación automática, pedidos vinculantes, inventario propio, ERP, vendedores externos, comisiones automáticas, importación masiva desde catálogos sin autorización y venta B2C.

## Modelo comercial y lenguaje de la interfaz

La web actuará como catálogo profesional de venta bajo pedido en fase de validación. No afirmará disponibilidad inmediata ni presentará la solicitud como compra confirmada.

Los textos principales serán:

- «Añadir a solicitud» en las fichas;
- «Solicitar precio y disponibilidad» en la cesta;
- «Solicitud no vinculante» junto al envío;
- «Precio bajo consulta» cuando no exista una tarifa publicable;
- «Documentación pendiente de confirmación» cuando falte algún documento técnico.

El cliente recibirá un número de expediente, no un número de pedido. Una operación solo pasará a oferta vinculante fuera de este flujo, después de que el negocio esté habilitado para contratar y facturar.

## Usuarios y acceso

Se utilizará autenticación sin contraseña mediante enlace de acceso por correo. Reduce soporte, evita almacenar contraseñas propias y permite verificar el correo antes de enviar una solicitud.

Roles:

- `customer`: usuario de una empresa solicitante;
- `admin`: personal autorizado para mantener catálogo y expedientes.

La primera versión admitirá un usuario por empresa. La invitación de varios usuarios y roles internos por organización se pospone hasta que exista demanda real.

Datos de cliente:

- nombre y apellidos;
- correo verificado;
- teléfono opcional;
- razón social;
- NIF-IVA opcional durante la exploración y obligatorio antes de una oferta vinculante;
- dirección fiscal opcional;
- dirección de entrega o ubicación de obra opcional;
- consentimiento y versión de las condiciones aceptadas.

No se solicitarán copias de documentos de identidad.

## Catálogo

Categorías iniciales:

- pinzas y útiles de elevación;
- anclajes y accesorios;
- eslingas, cadenas y balancines;
- estabilización provisional;
- herramientas de montaje y apriete;
- medición y replanteo;
- protección anticaídas y EPI;
- consumibles, fijaciones y señalización.

Cada producto tendrá:

- nombre comercial y slug;
- categoría y fabricante;
- referencia del fabricante;
- resumen y descripción técnica;
- aplicaciones previstas y limitaciones conocidas;
- variantes y unidades solicitables;
- imagen autorizada y texto alternativo;
- estado de publicación;
- indicador de precio bajo consulta;
- plazo orientativo solo cuando esté autorizado;
- fabricante, operador económico y país de origen cuando consten;
- documentos técnicos versionados;
- avisos de seguridad;
- productos relacionados;
- fecha de última revisión.

Un producto no podrá publicarse como «conforme», «homologado» o «marcado CE» mediante un campo libre. Esas afirmaciones dependerán de documentos identificados y revisados. Las imágenes y textos externos solo se cargarán con autorización del titular.

## Cesta y solicitud de oferta

La cesta se conservará localmente para visitantes. Al enviar, el usuario deberá verificar su correo y completar los datos mínimos de empresa.

Cada línea contendrá:

- producto y variante;
- cantidad;
- uso previsto;
- observaciones;
- ubicación de entrega u obra, si procede.

La solicitud completa podrá incluir fecha requerida, documentación adjunta y una consulta general. Antes de enviarla se mostrará un resumen y la declaración de que no constituye pedido, reserva ni aceptación de precio.

Estados del expediente:

1. `received` — recibida;
2. `reviewing` — en revisión;
3. `supplier_pending` — pendiente del proveedor;
4. `information_required` — falta información del cliente;
5. `quoted` — propuesta enviada fuera del sistema;
6. `closed` — cerrada;
7. `cancelled` — cancelada.

El cliente verá etiquetas traducidas, fechas y comentarios públicos. Las notas internas no serán visibles para él.

## Panel interno

El panel permitirá:

- crear, editar, publicar y retirar productos;
- importar productos desde CSV validado;
- adjuntar documentos y registrar su versión;
- consultar solicitudes y líneas;
- cambiar estados;
- añadir notas internas y respuestas visibles;
- exportar una solicitud a CSV o PDF;
- registrar proveedor consultado, coste, precio propuesto y plazo;
- ver productos más consultados y solicitudes por categoría.

No se construirá inicialmente un portal para proveedores. La comunicación con ellos seguirá siendo manual por correo.

## Arquitectura técnica

Se mantendrá Next.js App Router y el despliegue existente en Vercel.

Servicios propuestos:

- Supabase Auth para acceso por enlace de correo;
- PostgreSQL de Supabase para catálogo, empresas, cestas y expedientes;
- Row Level Security para separar datos de clientes;
- Vercel Blob o almacenamiento equivalente para archivos autorizados y documentos;
- Resend para mensajes transaccionales;
- analítica respetuosa con la privacidad para eventos de catálogo.

El catálogo público será renderizado en servidor y cacheado. La cesta será una isla cliente pequeña. Las mutaciones pasarán por acciones o rutas de servidor con validación. Las credenciales administrativas y claves de servicios nunca llegarán al navegador.

## Modelo de datos

Tablas principales:

- `profiles`: usuario, nombre, teléfono y estado;
- `companies`: razón social, NIF-IVA y direcciones;
- `company_members`: relación entre usuario y empresa;
- `suppliers`: proveedor, contacto y condiciones internas;
- `categories`: árbol de categorías;
- `products`: contenido, fabricante, publicación y revisión;
- `product_variants`: referencia, unidad y atributos;
- `product_documents`: tipo, versión, archivo y vigencia;
- `rfqs`: expediente, empresa, estado y datos de entrega;
- `rfq_items`: producto, variante, cantidad, uso y observaciones;
- `rfq_messages`: conversación pública o nota interna;
- `service_requests`: montaje, ingeniería o plan de izado;
- `consents`: versión, finalidad y fecha;
- `audit_events`: cambios administrativos relevantes.

Los precios de proveedor y márgenes serán datos internos separados del contenido público.

## Correos

El buzón predeterminado actual del proyecto es `ofertas@montajedeprefabricados.com`, sujeto a comprobar la configuración real de Vercel y Resend.

Mensajes de la primera versión:

- enlace de acceso;
- confirmación de solicitud al cliente;
- notificación interna de nueva solicitud;
- cambio de estado;
- petición de información adicional;
- confirmación de baja de cuenta.

Cada envío guardará identificador, destinatario, plantilla y resultado, sin almacenar innecesariamente el contenido sensible completo.

## Privacidad y seguridad

- recogida mínima de datos;
- correo verificado antes de enviar expedientes;
- separación de datos mediante RLS;
- administración protegida por rol y lista autorizada;
- validación de archivos, tamaño y tipo;
- rate limiting en autenticación y formularios;
- honeypot y controles de abuso;
- logs sin secretos ni documentos completos;
- proceso de exportación y solicitud de baja;
- conservación diferenciada de clientes, solicitudes y obligaciones legales;
- copias de seguridad y restauración comprobable.

La eliminación de cuenta no borrará automáticamente registros que deban conservarse por una obligación legal; esos datos quedarán restringidos y se explicará al usuario.

## SEO y navegación

Rutas públicas propuestas:

- `/tienda`;
- `/tienda/[categoria]`;
- `/tienda/producto/[slug]`;
- `/solicitar-oferta`.

Rutas privadas:

- `/cuenta`;
- `/cuenta/solicitudes`;
- `/cuenta/solicitudes/[id]`;
- `/administracion/catalogo`;
- `/administracion/solicitudes`.

Las fichas usarán schema `Product` únicamente con datos reales. No se publicarán `Offer`, precio, disponibilidad, valoración o reseñas cuando no existan. Las páginas de cuenta y administración serán `noindex`.

## Errores y degradación

- si falla el correo, la solicitud permanecerá guardada y se reintentará la notificación;
- si falta documentación, el producto mostrará su estado y no inventará conformidad;
- si un producto se retira, seguirá visible dentro de expedientes históricos sin aceptar nuevas cantidades;
- si falla el almacenamiento local, la cesta podrá reconstruirse durante la sesión;
- los cambios de estado quedarán auditados;
- una solicitud duplicada tendrá clave de idempotencia.

## Criterios de aceptación

- un visitante puede encontrar un producto y preparar una cesta sin registrarse;
- el envío exige correo verificado y datos mínimos de empresa;
- el sistema crea una única solicitud y envía confirmaciones;
- el cliente consulta el estado desde su cuenta;
- un administrador mantiene productos y actualiza solicitudes;
- ningún flujo acepta pagos o presenta la solicitud como pedido;
- los datos de una empresa no son accesibles por otra;
- las fichas no muestran afirmaciones técnicas sin respaldo documental;
- catálogo, cesta, cuenta y administración funcionan en móvil;
- pruebas cubren permisos, validación, idempotencia y creación de expedientes;
- typecheck, tests y build de producción finalizan sin errores.

## Evolución posterior

Cuando las solicitudes demuestren demanda y la operación esté formalizada, se podrá añadir, en este orden:

1. ofertas vinculantes dentro de la cuenta;
2. aceptación electrónica;
3. pagos para productos normalizados;
4. facturación adaptada a los requisitos aplicables;
5. sincronización con proveedores;
6. varios usuarios por empresa;
7. ventas en otros países de la UE;
8. portal de proveedores o marketplace multivendedor.
