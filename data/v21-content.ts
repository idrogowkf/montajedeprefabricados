export const capabilities = [
  { title: "Montaje de prefabricados", description: "Pilares, vigas, paneles, forjados y elementos singulares.", image: "/proyectos/industrial-nave-losa-alveolar-35t.webp", href: "/servicios/montaje-prefabricados" },
  { title: "Ingeniería de montaje", description: "Secuencia, accesos, radios, estabilidad temporal y procedimiento.", image: "/proyectos/civil-viaducto-viga-wt-80t.webp", href: "/servicios/ingenieria-de-montaje" },
  { title: "Grúas y maniobras", description: "Selección y coordinación del medio de elevación según la operación.", image: "/proyectos/civil-puente-viga-cajon-150t.webp", href: "/servicios/gruas-y-maniobras" },
  { title: "Logística de obra", description: "Accesos, acopios, orden de llegada y ventanas de descarga y montaje.", image: "/proyectos/110-1045_IMG.jpg.webp", href: "/servicios/logistica-de-obra" },
  { title: "Asistencia técnica", description: "Información de obra estructurada para resolver decisiones críticas.", image: "/proyectos/industrial-panel-fachada-22t.webp", href: "/servicios/asistencia-tecnica" },
] as const;

export const processSteps = [
  {number:"01",title:"Entender piezas y documentación",tag:"DATOS",summary:"El estudio comienza relacionando planos, despiece y listado de elementos para saber qué se iza, cómo llega a obra y qué información sigue sin estar definida.",inputs:["Planos y despiece","Pesos y geometrías","Puntos e insertos de izado"],output:"Inventario técnico de piezas, documentación disponible y datos pendientes."},
  {number:"02",title:"Revisar emplazamiento y accesos",tag:"OBRA",summary:"La posición real de la grúa, la resistencia del terreno, los obstáculos y el recorrido del transporte determinan si la solución prevista puede ejecutarse en el espacio disponible.",inputs:["Implantación de obra","Accesos y gálibos","Terreno, servicios y obstáculos"],output:"Condicionantes de implantación, descarga, acopio y posicionamiento de equipos."},
  {number:"03",title:"Definir secuencia y condicionantes",tag:"PLAN",summary:"La secuencia coordina llegada, descarga, izado, arriostramiento y liberación del equipo sin perder de vista la estabilidad temporal de cada elemento y del conjunto.",inputs:["Orden de montaje","Estabilidad temporal","Interferencias y ventanas de trabajo"],output:"Secuencia ejecutable, puntos de espera y dependencias entre equipos y piezas."},
  {number:"04",title:"Configurar medios y logística",tag:"MEDIOS",summary:"Se contrasta cada maniobra con la configuración de grúa, el radio real, los aparejos, el espacio de montaje y el orden logístico necesario para alimentar el frente de trabajo.",inputs:["Tablas de carga","Radios y alturas","Aparejos, transporte y acopio"],output:"Configuración preliminar de medios y requisitos para el lifting plan."},
  {number:"05",title:"Coordinar montaje y cierre",tag:"EJECUCIÓN",summary:"Antes de ejecutar se alinean responsables, comunicaciones, exclusiones, comprobaciones y criterios de liberación para que cada pieza pase de suspendida a estable y documentada.",inputs:["Roles y comunicaciones","Comprobaciones previas","Fijación, aplomado y cierre"],output:"Procedimiento coordinado, controles de ejecución y registro de incidencias."},
] as const;

export const technicalTopics = {
  grua: { label: "Selección preliminar de grúa", answer: "Para una selección preliminar necesitamos peso total de izado, radio real de trabajo, altura, obstáculos y condiciones del emplazamiento. La capacidad nominal de una grúa no equivale a su capacidad al radio real." },
  secuencia: { label: "Secuencia de montaje", answer: "La secuencia ordena fabricación, llegada, acopio, estabilidad temporal y liberación de la grúa. Un cambio de orden puede cambiar medios y rendimiento." },
  paneles: { label: "Paneles y fachadas", answer: "En paneles revisamos peso, geometría, puntos de izado, fijación, tolerancias, altura de colocación y acceso auxiliar." },
  logistica: { label: "Logística y accesos", answer: "Conviene revisar gálibos, radios de giro, firme, estacionamiento, acopio, orden de descarga y compatibilidad con la secuencia de montaje." },
  planos: { label: "Documentación necesaria", answer: "Puedes empezar con planos estructurales, listados de piezas y pesos, emplazamiento y calendario. Si falta información, el preestudio debe identificarla en lugar de obligarte a inventarla." },
} as const;

export type TechnicalTopicKey = keyof typeof technicalTopics;
