import {isPublicationReady,type CatalogProduct} from "../data/catalog";
import type {PublicCatalogProduct} from "../data/public-catalog";
import {calculatePrice} from "./pricing";

export function toPublicCatalogProduct(product:CatalogProduct):PublicCatalogProduct{
  const calculated=calculatePrice(product.commercial);
  return {
    id:product.id,sku:product.sku,name:product.name,brand:product.brand,family:product.family,
    segments:product.segments,unit:product.unit,certifications:product.certifications,
    imageUrl:product.imageUrl,imageUrls:product.imageUrls,datasheetUrl:product.datasheetUrl,
    description:product.publicDescription??(product.commercial.status==="ready"?`${product.name} de ${product.brand}, referencia identificada para uso profesional. Comprueba la compatibilidad con la aplicación antes de utilizarla.`:`${product.name} de ${product.brand}. La capacidad, medida o configuración exacta se confirma mediante oferta técnica antes del suministro.`),
    specifications:[`Marca: ${product.brand}`,`Unidad de suministro: ${product.unit}`,...(product.publicSpecifications??product.certifications)],
    price:calculated.salePriceNet,priceVat:calculated.salePriceVat,vatPercent:product.commercial.vatPercent,
    purchasable:isPublicationReady(product),accent:product.accent,initials:product.initials,
    availability:product.availability,delivery:product.delivery,rating:product.rating,reviews:product.reviews,
  };
}
