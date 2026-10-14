export type CatalogCategoryId="elevacion"|"fijacion"|"corte"|"epi"|"altura"|"sellado"|"utiles";
export type CatalogApplicationId=
  |"manipular-prefabricado"|"elevar-pozos"|"elevar-paneles"
  |"fijar-hormigon"|"fijar-acero"|"perforar-hormigon"
  |"cortar-hormigon"|"proteccion-personal"|"trabajar-en-altura"
  |"sellar-juntas"|"reparar-hormigon"|"posicionar-elementos";
export type CatalogFacetKey="category"|"subcategory"|"application"|"pieceType"|"material"|"brand"|"capacity"|"certification"|"hasDocument"|"commercialMode";

export type CatalogCategory={
  id:CatalogCategoryId;
  label:string;
  subcategories:readonly string[];
  facets:readonly CatalogFacetKey[];
};

export const catalogCategories:readonly CatalogCategory[]=[
  {id:"elevacion",label:"Elevación, izaje y manipulación",subcategories:["Pinzas","Balancines","Ganchos","Eslingas y cadenas","Elevación por vacío","Útiles especiales"],facets:["subcategory","application","pieceType","material","brand","capacity","certification","hasDocument","commercialMode"]},
  {id:"fijacion",label:"Fijación y montaje",subcategories:["Anclajes químicos","Anclajes mecánicos","Varillas y elementos de anclaje","Fijación directa","Útiles de instalación"],facets:["subcategory","application","material","brand","certification","hasDocument","commercialMode"]},
  {id:"corte",label:"Corte y perforación",subcategories:["Martillos","Perforación diamantada","Coronas y brocas","Discos","Amoladoras y sierras","Control de polvo"],facets:["subcategory","application","material","brand","hasDocument","commercialMode"]},
  {id:"epi",label:"Protección y EPI",subcategories:["Cascos","Protección ocular y facial","Guantes","Protección personal"],facets:["subcategory","application","brand","certification","hasDocument","commercialMode"]},
  {id:"altura",label:"Trabajos en altura",subcategories:["Arneses","Anticaídas","Elementos de amarre","Conectores","Líneas de vida","Equipos para eólico"],facets:["subcategory","application","brand","certification","hasDocument","commercialMode"]},
  {id:"sellado",label:"Sellado y reparación",subcategories:["Morteros","Selladores","Adhesivos","Reparación estructural","Acabado"],facets:["subcategory","application","material","brand","certification","hasDocument","commercialMode"]},
  {id:"utiles",label:"Útiles y accesorios de montaje",subcategories:["Medición","Nivelación","Posicionamiento","Herramientas auxiliares","Consumibles específicos"],facets:["subcategory","application","pieceType","material","brand","hasDocument","commercialMode"]},
] as const;

export const catalogApplications:readonly {id:CatalogApplicationId;label:string;category:CatalogCategoryId}[]=[
  {id:"manipular-prefabricado",label:"Manipular prefabricados",category:"elevacion"},
  {id:"elevar-pozos",label:"Elevar pozos y arquetas",category:"elevacion"},
  {id:"elevar-paneles",label:"Elevar paneles y placas",category:"elevacion"},
  {id:"fijar-hormigon",label:"Fijar sobre hormigón",category:"fijacion"},
  {id:"fijar-acero",label:"Fijar sobre acero",category:"fijacion"},
  {id:"perforar-hormigon",label:"Perforar hormigón",category:"corte"},
  {id:"cortar-hormigon",label:"Cortar hormigón",category:"corte"},
  {id:"proteccion-personal",label:"Proteger al operario",category:"epi"},
  {id:"trabajar-en-altura",label:"Trabajar en altura",category:"altura"},
  {id:"sellar-juntas",label:"Sellar juntas",category:"sellado"},
  {id:"reparar-hormigon",label:"Reparar hormigón",category:"sellado"},
  {id:"posicionar-elementos",label:"Posicionar elementos",category:"utiles"},
] as const;

export const catalogSynonyms={
  pozos:["pozo","pozos","arqueta","arquetas","anillo","anillos","registro","registros"],
  elevar:["elevar","izar","levantar","coger","manipular"],
  perforar:["taladrar","perforar","agujero","agujeros"],
  fijar:["fijar","montar","taco","tacos","anclaje","anclajes","fijacion","fijaciones","perno","pernos"],
  altura:["arnes","arneses","anticaidas","altura","eolico","eolica"],
} as const;

const categoryIds=new Set<string>(catalogCategories.map(category=>category.id));
export function isCatalogCategory(value:unknown):value is CatalogCategoryId{
  return typeof value==="string"&&categoryIds.has(value);
}
