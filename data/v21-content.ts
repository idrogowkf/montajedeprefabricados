export const capabilities = [
  { title: "Montaje de prefabricados", description: "Pilares, vigas, paneles, forjados y elementos singulares.", image: "/proyectos/industrial-nave-losa-alveolar-35t.webp" },
  { title: "Ingeniería de montaje", description: "Secuencia, accesos, radios, estabilidad temporal y procedimiento.", image: "/proyectos/civil-viaducto-viga-wt-80t.webp" },
  { title: "Grúas y maniobras", description: "Selección y coordinación del medio de elevación según la operación.", image: "/proyectos/civil-puente-viga-cajon-150t.webp" },
  { title: "Logística de obra", description: "Accesos, acopios, orden de llegada y ventanas de descarga y montaje.", image: "/proyectos/110-1045_IMG.jpg.webp" },
  { title: "Asistencia técnica", description: "Información de obra estructurada para resolver decisiones críticas.", image: "/proyectos/industrial-panel-fachada-22t.webp" },
] as const;

export const processSteps = [
  ["01", "Entender piezas y documentación", "DATOS"],
  ["02", "Revisar emplazamiento y accesos", "OBRA"],
  ["03", "Definir secuencia y condicionantes", "PLAN"],
  ["04", "Configurar medios y logística", "MEDIOS"],
  ["05", "Coordinar montaje y cierre", "EJECUCIÓN"],
] as const;

export const technicalTopics = {
  grua: { label: "Selección preliminar de grúa", answer: "Para una selección preliminar necesitamos peso total de izado, radio real de trabajo, altura, obstáculos y condiciones del emplazamiento. La capacidad nominal de una grúa no equivale a su capacidad al radio real." },
  secuencia: { label: "Secuencia de montaje", answer: "La secuencia ordena fabricación, llegada, acopio, estabilidad temporal y liberación de la grúa. Un cambio de orden puede cambiar medios y rendimiento." },
  paneles: { label: "Paneles y fachadas", answer: "En paneles revisamos peso, geometría, puntos de izado, fijación, tolerancias, altura de colocación y acceso auxiliar." },
  logistica: { label: "Logística y accesos", answer: "Conviene revisar gálibos, radios de giro, firme, estacionamiento, acopio, orden de descarga y compatibilidad con la secuencia de montaje." },
  planos: { label: "Documentación necesaria", answer: "Puedes empezar con planos estructurales, listados de piezas y pesos, emplazamiento y calendario. Si falta información, el preestudio debe identificarla en lugar de obligarte a inventarla." },
} as const;

export type TechnicalTopicKey = keyof typeof technicalTopics;
