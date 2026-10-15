# Plan de implementación

1. Instalar y configurar Better Auth con PostgreSQL, Resend y tablas migradas fuera del tráfico.
2. Crear identidad de servidor y cliente; sustituir middleware, ClerkProvider, botones y autorización administrativa.
3. Crear formularios propios de acceso, registro, verificación, recuperación y restablecimiento en español.
4. Adaptar perfiles y solicitudes a la nueva identidad, enlazando históricos por correo.
5. Unificar la carga de Mi cuenta en un endpoint y reorganizar el menú y formulario.
6. Implementar cambio de contraseña y eliminación con confirmación.
7. Añadir pruebas de autenticación, autorización, carga y regresión; compilar.
8. Migrar Preview, verificar el flujo, migrar Producción y desplegar.
