import {isStorefrontComplete,type CatalogProduct} from "./catalog";

const preferredIds=[
  "arnes-anticaidas",
  "disco-diamante-230",
  "ext-fix-001-varilla-de-anclaje-has-d",
  "ext-epi-081-newton-version-europea",
  "ext-repair-101-arido-sikarep-512",
  "ext-well-120-pinza-para-anillos-de-pozo-1061",
];

export function selectFeaturedStoreProducts(products:CatalogProduct[],limit=6){
  const complete=products.filter(isStorefrontComplete);
  const preferred=preferredIds.map(id=>complete.find(product=>product.id===id)).filter((product):product is CatalogProduct=>Boolean(product));
  return [...preferred,...complete.filter(product=>!preferred.some(item=>item.id===product.id))].slice(0,limit);
}
