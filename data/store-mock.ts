export type StoreCategory = "epi" | "corte" | "fijacion" | "medicion" | "elevacion";
export type MockProduct = {
  id: string; name: string; category: StoreCategory; categoryLabel: string; brand: string;
  price: number; oldPrice?: number; unit: string; rating: number; reviews: number;
  availability: string; delivery: string; badge?: string; accent: string; initials: string;
};

export const mockProducts: MockProduct[] = [
  {id:"casco-obra",name:"Casco de obra con barboquejo",category:"epi",categoryLabel:"Protección",brand:"ProSafe",price:18.9,oldPrice:23.5,unit:"unidad",rating:4.7,reviews:126,availability:"Disponible",delivery:"Entrega 24–48 h",badge:"Más solicitado",accent:"#f4b400",initials:"CS"},
  {id:"guante-anticorte",name:"Guante anticorte nivel D",category:"epi",categoryLabel:"Protección",brand:"GripWork",price:6.45,unit:"par",rating:4.6,reviews:84,availability:"Disponible",delivery:"Entrega 24–48 h",accent:"#ef233c",initials:"GA"},
  {id:"gafas-panoramicas",name:"Gafas panorámicas antiempañamiento",category:"epi",categoryLabel:"Protección",brand:"VisionPro",price:9.8,unit:"unidad",rating:4.5,reviews:53,availability:"Disponible",delivery:"Entrega 24–48 h",accent:"#2e7dba",initials:"GP"},
  {id:"disco-diamante",name:"Disco diamantado hormigón 230 mm",category:"corte",categoryLabel:"Corte y perforación",brand:"CutMax",price:32.75,oldPrice:39.9,unit:"unidad",rating:4.8,reviews:211,availability:"Últimas unidades",delivery:"Entrega estimada martes",badge:"Buena rotación",accent:"#706d68",initials:"DD"},
  {id:"broca-sds",name:"Juego de brocas SDS-Plus 7 piezas",category:"corte",categoryLabel:"Corte y perforación",brand:"DrillCore",price:27.4,unit:"juego",rating:4.4,reviews:67,availability:"Disponible",delivery:"Entrega 24–48 h",accent:"#5d4037",initials:"BS"},
  {id:"marcador-industrial",name:"Marcador industrial permanente",category:"medicion",categoryLabel:"Medición y marcado",brand:"MarkLine",price:3.2,unit:"unidad",rating:4.3,reviews:39,availability:"Disponible",delivery:"Entrega 24–48 h",accent:"#ef233c",initials:"MI"},
  {id:"cinta-metrica",name:"Cinta métrica magnética 8 m",category:"medicion",categoryLabel:"Medición y marcado",brand:"MeasureX",price:14.25,unit:"unidad",rating:4.7,reviews:92,availability:"Disponible",delivery:"Entrega 24–48 h",accent:"#f4b400",initials:"CM"},
  {id:"anclaje-quimico",name:"Anclaje químico para hormigón",category:"fijacion",categoryLabel:"Fijación y sellado",brand:"FixPro",price:12.6,unit:"cartucho",rating:4.6,reviews:144,availability:"Disponible",delivery:"Entrega estimada martes",badge:"Precio profesional",accent:"#ef6c00",initials:"AQ"},
  {id:"sellador-pu",name:"Sellador de poliuretano gris",category:"fijacion",categoryLabel:"Fijación y sellado",brand:"SealTech",price:7.35,unit:"cartucho",rating:4.4,reviews:76,availability:"Disponible",delivery:"Entrega 24–48 h",accent:"#546e7a",initials:"SP"},
  {id:"cincha-amarre",name:"Cincha de amarre 5 t · 9 m",category:"elevacion",categoryLabel:"Amarre y elevación",brand:"LiftLine",price:29.5,unit:"unidad",rating:4.8,reviews:188,availability:"Disponible",delivery:"Entrega estimada martes",badge:"Alta demanda",accent:"#1565c0",initials:"CA"},
  {id:"grillete-lira",name:"Grillete lira con pasador roscado",category:"elevacion",categoryLabel:"Amarre y elevación",brand:"RigMaster",price:16.8,unit:"unidad",rating:4.7,reviews:101,availability:"Configuración requerida",delivery:"Confirmar capacidad",accent:"#ef233c",initials:"GL"},
  {id:"eslinga-textil",name:"Eslinga plana doble capa",category:"elevacion",categoryLabel:"Amarre y elevación",brand:"LiftLine",price:24.9,unit:"unidad",rating:4.6,reviews:119,availability:"Configuración requerida",delivery:"Confirmar longitud y CMU",accent:"#7b1fa2",initials:"ET"},
];

const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
export function filterProducts(products: MockProduct[], query: string, category: string) {
  const terms = normalize(query).trim().split(/\s+/).filter(Boolean);
  return products.filter((product) => (category === "todos" || product.category === category) && terms.every((term) => normalize(`${product.name} ${product.categoryLabel} ${product.brand}`).includes(term)));
}
