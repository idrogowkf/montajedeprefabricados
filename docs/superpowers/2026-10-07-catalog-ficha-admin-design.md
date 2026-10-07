# Diseño: ficha de producto y administración integral

## Objetivo

Convertir cada referencia visible en una ficha comercial coherente con la marca, con galería, documentación oficial y recorrido funcional hacia solicitud; mantener el mismo contenido editable desde administración.

## Modelo

- `CatalogProduct` sigue siendo la fuente única para tienda y administrador.
- Neon persiste dos bloques: `payload` (contenido, imágenes y documentos) y `commercial` (coste, transporte, margen, IVA y estado).
- Toda mutación se sanea, exige HTTPS para recursos externos y deja registro en `catalog_audit`.
- Las operaciones masivas solo afectan referencias seleccionadas y reutilizan la misma validación que la edición individual.

## Interfaz

- La ficha pública usa el sistema rojo, negro y blanco de la marca; galería, documento y CTA tienen estados visibles de interacción.
- El CTA de oferta navega al preestudio con identificador y nombre del producto.
- El editor administrativo separa Comercial, Contenido, Imágenes y Documentación y permite guardar la ficha completa.

## Integridad

Una publicación directa exige coste verificado, proveedor identificado, tres ofertas, al menos tres entradas de galería y documentación técnica. Las referencias incompletas permanecen bajo oferta, nunca como compra directa.
