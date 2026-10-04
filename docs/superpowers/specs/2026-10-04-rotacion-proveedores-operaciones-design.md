# Catálogo de rotación y centro de operaciones

Fecha: 4 de octubre de 2026

## Decisión

La primera versión no intentará representar todo el montaje de prefabricados. Se construirá como un catálogo B2B corto, sin stock propio, centrado en consumibles y EPI de reposición frecuente. Los útiles de izado especializados permanecerán como productos bajo consulta y no dirigirán el lanzamiento.

La selección de proveedor no se decidirá por prestigio ni por amplitud de catálogo. Cada fuente deberá superar una cesta comparativa idéntica y confirmar por escrito derechos de reventa y de publicación.

## Evidencia comercial disponible

Las ventas de cada referencia no son datos públicos de los distribuidores. Por ello no se presentará ningún producto como «más vendido» sin datos propios o evidencia facilitada por el proveedor.

Indicadores públicos verificados:

| Candidato | Escala publicada | Presencia en España | Lectura para el piloto |
|---|---:|---|---|
| RS Group | 2.904 millones GBP de ingresos de grupo en FY2025; 1.777 millones GBP en EMEA; más de un millón de clientes | Centro logístico español trasladado a una nueva instalación en Madrid en 2024 | Alta capacidad y gama, pero el margen de reventa debe demostrarse |
| Hoffmann Group | Más de 1.400 millones EUR de facturación en 2024; 135.000 empresas cliente en 50 países | Hoffmann Iberia Quality Tools S.L., Madrid, fundada en 2008 | Fuerte presencia profesional; puede resultar premium en parte de la gama |
| Manutan | Grupo europeo con más de 2.200 empleados y presencia en 17 países | Manutan S.L. en Barcelona; declara más de 30.000 clientes y 80.000 productos en España | Interesante para EPI, señalización y consumibles; marca propia declarada aproximadamente un 15 % más barata que marcas nacionales |
| TME | Más de 300.000 clientes en 150 países, 1,5 millones de productos y 7.000 paquetes diarios | Transfer Multisort Elektronik S.L.U. en Madrid desde 2013; vende y factura con IVA español | Mejor candidato técnico para API/feed; cobertura parcial del núcleo de obra y montaje |

Estas cifras acreditan capacidad y presencia, no precio bajo ni autorización para revender.

## Embudo de proveedores

### Filtro obligatorio

Un proveedor solo puede alimentar el catálogo si confirma:

1. reventa en España y modelo sin stock o envío al cliente;
2. licencia para publicar imágenes, descripciones y documentación;
3. tarifa profesional y actualización de precio;
4. stock o plazo disponible de forma fiable;
5. portes, pedido mínimo, devoluciones y garantía;
6. trazabilidad, fabricante y documentación aplicable;
7. API/feed o, como mínimo, CSV mantenible.

### Cesta comparativa

Se solicitará una oferta equivalente de 20 referencias, con una unidad de comparación cerrada:

- guantes de protección mecánica de uso general;
- gafas transparentes antiimpacto;
- protección auditiva desechable;
- chaleco de alta visibilidad;
- casco de obra y barboquejo compatible;
- mascarilla desechable cuando proceda;
- cinta de balizamiento;
- cinta métrica y marcador industrial;
- bridas y cinta adhesiva técnica;
- discos de corte y desbaste en medidas habituales;
- brocas para hormigón en medidas habituales;
- hojas de corte de reposición;
- lubricante o aflojatodo de mantenimiento;
- aerosol de marcado;
- pilas o baterías de consumo frecuente;
- paños o toallitas de limpieza industrial;
- sellador de uso general;
- tacos o fijaciones estándar no estructurales;
- cincha de amarre normalizada de uso corriente;
- grillete normalizado de capacidad habitual.

Antes de publicar se compararán precio neto, descuento, portes prorrateados, plazo, pedido mínimo, coste de devolución y margen bruto estimado. Los productos de seguridad conservarán fabricante, norma, instrucciones y compatibilidades; «barato» no sustituye a «adecuado».

### Puntuación

- 30 % coste total entregado;
- 20 % margen bruto posible;
- 15 % disponibilidad y plazo;
- 10 % frecuencia esperada de reposición;
- 10 % calidad del dato/API;
- 10 % devolución, garantía y soporte español;
- 5 % amplitud útil del catálogo.

Un producto entrará en el piloto con 70/100 o más y documentación completa. El catálogo inicial tendrá 40 a 60 referencias: aproximadamente 70 % consumibles/EPI, 20 % herramienta manual y medición, y 10 % productos especializados bajo consulta.

## Cómo se medirá la rotación real

Cada evento se guardará con producto, empresa, canal y fecha:

- impresión y visita de ficha;
- búsqueda sin resultado;
- adición y retirada de cesta;
- envío de solicitud;
- cantidad solicitada;
- coste del proveedor y precio ofertado;
- aceptación o pérdida y motivo;
- repetición de compra o solicitud;
- tiempo de respuesta del proveedor.

Indicadores del panel:

- conversión ficha → cesta → solicitud → oferta → aceptación;
- solicitudes, unidades y margen estimado por referencia;
- días entre solicitudes repetidas;
- coste de portes como porcentaje del pedido;
- tasa de falta de stock y retraso;
- tiempo medio de primera respuesta;
- productos vistos sin solicitud y búsquedas sin resultado.

A los 30 días se retirarán o relegarán referencias sin señales de demanda y se ampliarán las categorías que generen solicitudes y repetición.

## Centro de operaciones, no buzón

La base de datos será la fuente de verdad. El panel `/administracion` será el lugar de trabajo diario y tendrá:

- bandeja de solicitudes con filtros, responsable y SLA;
- ficha completa del expediente y conversación;
- comparativa de proveedores, coste, portes, plazo y margen;
- estados, tareas y siguiente acción;
- catálogo y documentos;
- métricas de embudo, rotación y entregabilidad de correo;
- auditoría de cambios.

Los correos serán notificaciones con enlace al expediente. No hará falta Outlook para operar.

## Para qué sirve Resend

La clave `RESEND_API_KEY` identifica al servidor ante Resend. Permite enviar desde el backend mensajes transaccionales y recibir eventos de entrega; nunca se expone al navegador.

Usos iniciales:

- acceso seguro a la cuenta;
- confirmación de solicitud;
- aviso interno de nueva solicitud;
- petición de información y cambio de estado;
- registro de enviado, entregado, retrasado, rebotado o rechazado mediante webhooks.

Resend no es necesario para guardar solicitudes: si el envío falla, el expediente seguirá en la base de datos y aparecerá en administración para reintento.

## Recepción de respuestas

La solución recomendada evita una bandeja externa:

1. el cliente responde desde su cuenta en un hilo asociado al expediente;
2. el sistema envía una notificación por correo con un enlace seguro;
3. en una segunda fase, Resend Inbound recibirá respuestas enviadas por correo y su webhook las convertirá en mensajes del mismo expediente;
4. los adjuntos se almacenarán con validación y el evento se deduplicará.

Resend documenta actualmente recepción en dominio propio o dirección `resend.app`, webhooks `email.received`, adjuntos y consulta por API. El despliegue inicial no dependerá de la entrada por correo: así se puede lanzar antes y conservar toda la trazabilidad.

## Controles técnicos

- tabla `communication_events` con proveedor, identificador externo, estado y marcas de tiempo;
- tabla de salida con idempotencia, reintentos y error visible;
- firma verificada en webhooks y deduplicación por identificador;
- direcciones `reply-to` ligadas al expediente;
- DNS SPF/DKIM del subdominio de envío;
- sin seguimiento de aperturas como KPI principal, por su baja fiabilidad y efecto en privacidad;
- alertas por rebotes, solicitudes sin asignar y SLA vencido.

## Requisitos pendientes externos

Para activar el envío real harán falta un dominio verificado y una clave de Resend guardada en Vercel. Para cargar un proveedor harán falta sus condiciones comerciales y licencia de contenidos. El software puede quedar preparado antes, pero no puede inventar esas autorizaciones ni los precios profesionales.

## Fuentes verificadas

- RS Group Annual Report 2025: https://www.rsgroup.com/media/ovnhuoll/rs-group-annual-report-2025.pdf
- RS Group history: https://www.rsgroup.com/about-us/our-history/
- Hoffmann Group, cifras 2024: https://www.hoffmann-group.com/MY/en/hom/hoffmann-group/press/press-releases-2025/ecovadis2024/e/1472750/
- Hoffmann Iberia: https://www.hoffmann-group.com/DE/de/hom/hoffmann-group/standorte-und-partner/hoffmann-iberia/e/117696/
- Manutan España: https://www.manutan.es/es/mas/quienes-somos
- TME España, escala: https://www.tme.eu/es/about-us/meet-us/
- TME S.L.U. España: https://www.tme.eu/en/about-us/tme-group/22405/transfer-multisort-elektronik-s-l-u/
- Resend Inbound: https://www.resend.com/features/inbound
- Resend Webhooks: https://resend.com/blog/webhooks
