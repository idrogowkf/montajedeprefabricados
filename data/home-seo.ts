import { citySeoPages, serviceSeoPages, typeSeoPages } from "./seo-pages";

export const homeFaqs = [
  { question: "¿Qué incluye la planificación de un montaje prefabricado?", answer: "La revisión relaciona piezas, pesos, apoyos, secuencia, accesos, descarga, posiciones de grúa, aparejos, estabilidad temporal, tolerancias y responsabilidades de obra." },
  { question: "¿Qué información permite solicitar un primer estudio?", answer: "Planos, despiece o listado de piezas, pesos y dimensiones, ubicación, plano de implantación, accesos y fechas previstas. Los datos aún no disponibles se registran como pendientes." },
  { question: "¿El lifting plan puede contratarse por separado?", answer: "Sí. Puede prepararse como un alcance independiente para documentar una maniobra concreta, siempre que se confirmen carga, geometría, configuración, emplazamiento y condiciones de apoyo." },
  { question: "¿Cómo se elige la grúa para una pieza prefabricada?", answer: "La elección se contrasta con el peso total suspendido y el punto más exigente de la maniobra: radio, altura, longitud de pluma, configuración, deducciones, terreno y obstáculos." },
  { question: "¿Por qué deben coordinarse transporte y montaje?", answer: "El orden de expedición, la ventana de llegada y el espacio de descarga determinan si una pieza puede montarse directamente o necesita un acopio y una manipulación adicional." },
] as const;

const links = (pages: typeof serviceSeoPages) => pages.map(({ path: href, h1: label }) => ({ href, label }));
export const homeRelatedLinks = {
  services: links(serviceSeoPages),
  types: links(typeSeoPages),
  locations: links(citySeoPages),
};
