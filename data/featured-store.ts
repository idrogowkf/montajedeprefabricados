import {hasStoreImage,type CatalogProduct} from "./catalog";

const preferredIds=[
  "arnes-anticaidas",
  "disco-diamante-230",
  "ext-fix-001-varilla-de-anclaje-has-d",
  "ext-epi-081-newton-version-europea",
  "ext-repair-101-arido-sikarep-512",
  "ext-well-120-pinza-para-anillos-de-pozo-1061",
];

export function selectFeaturedStoreProducts(products:CatalogProduct[],limit=6){
  const complete=products.filter(product=>hasStoreImage(product)&&product.supplier.reference!=="PENDIENTE"&&product.sourceUrl.startsWith("https://"));
  const preferred=preferredIds.map(id=>complete.find(product=>product.id===id)).filter((product):product is CatalogProduct=>Boolean(product));
  const categories=["elevacion","fijacion","corte","altura","epi"];
  const diverse=categories.map(category=>preferred.find(product=>product.category===category)??complete.find(product=>product.category===category)).filter((product):product is CatalogProduct=>Boolean(product));
  return [...diverse,...preferred,...complete].filter((product,index,all)=>all.findIndex(item=>item.id===product.id)===index).slice(0,limit);
}
