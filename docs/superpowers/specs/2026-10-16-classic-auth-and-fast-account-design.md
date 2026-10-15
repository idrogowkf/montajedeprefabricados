# Autenticación clásica y cuenta rápida

## Objetivo
Sustituir Clerk por una experiencia propia, íntegramente en español y sin marcas de terceros. La cuenta debe cargar rápido y organizarse en Resumen, Mi perfil, Solicitudes y Privacidad.

## Autenticación
- Better Auth sobre PostgreSQL/Neon, con correo y contraseña.
- Registro: nombre, correo, contraseña y repetición. `autocomplete` compatible con el generador del navegador.
- Verificación de correo y recuperación de contraseña mediante Resend, con plantillas de Montaje Prefabricado.
- Inicio, registro, recuperación y restablecimiento con el diseño negro, rojo y amarillo.
- Sesiones seguras, cierre de sesión, cambio de contraseña y eliminación de cuenta.
- Sin Google OAuth, tarjeta de Clerk, textos ingleses ni distintivo Development Mode.

## Cuenta
Menú: Resumen, Mi perfil, Solicitudes, Privacidad. «Completar o editar mi perfil» aparece inmediatamente bajo «Mi cuenta». Mi perfil reúne identidad, correo verificado, teléfono, tipo de cliente, identificación fiscal y dirección de facturación. «Perfil fiscal» desaparece como nombre visible.

## Rendimiento y datos
- Migraciones ejecutadas fuera de las visitas; ninguna sentencia DDL en peticiones del cliente.
- Un endpoint agregado devuelve sesión, perfil, resumen y solicitudes.
- El HTML de la cuenta muestra su estructura inmediatamente y los datos se cargan en una sola petición.
- Los perfiles y solicitudes anteriores se enlazan por correo verificado al primer acceso.
- Mensajes recuperables y registro técnico sin datos sensibles.

## Seguridad y aceptación
Contraseñas con scrypt; cookies HTTP-only; CSRF y rate limiting del proveedor; verificación obligatoria. Se aceptará cuando registro, verificación, inicio, recuperación, perfil, solicitudes, administración y eliminación funcionen en Preview y Producción, y la cuenta no muestre Clerk.
