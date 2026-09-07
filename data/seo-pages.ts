import { technicalServices } from "./technical-services";

export type SeoFaq = { question: string; answer: string };
export type SeoSection = { title: string; body: string; items: string[] };
export type SeoPage = {
  kind: "service" | "type" | "location";
  path: string;
  primaryQuery: string;
  eyebrow: string;
  title: string;
  h1: string;
  description: string;
  intro: string;
  image: string;
  sections: SeoSection[];
  faqs: SeoFaq[];
  related: string[];
  areaServed?: string;
};

const serviceQueries: Record<string, string> = {
  "montaje-prefabricados": "empresa montaje prefabricados hormigón",
  "ingenieria-de-montaje": "ingeniería de montaje prefabricados",
  "lifting-plan": "lifting plan plan de izado",
  "gruas-y-maniobras": "grúas para montaje prefabricados",
  "logistica-de-obra": "logística de obra prefabricados",
  "asistencia-tecnica": "asistencia técnica montaje prefabricados",
};

const serviceDescriptions: Record<string, string> = {
  "montaje-prefabricados": "Planificación y coordinación del montaje de prefabricados de hormigón: piezas, secuencia, grúas, accesos, descarga y estabilidad temporal.",
  "ingenieria-de-montaje": "Ingeniería de montaje para prefabricados: revisión de geometría, estados temporales, implantación, secuencia, medios y documentación de obra.",
  "lifting-plan": "Lifting plan y estudio de izado para verificar carga, aparejos, radio, altura, capacidad de grúa, terreno, obstáculos, trayectoria y secuencia.",
  "gruas-y-maniobras": "Selección preliminar de grúas y maniobras para prefabricados según peso suspendido, radio real, altura, configuración, terreno y emplazamiento.",
  "logistica-de-obra": "Logística de obra para prefabricados: revisión de accesos, entregas, descarga, acopio, orden de expedición y alimentación del frente de montaje.",
  "asistencia-tecnica": "Asistencia técnica para ordenar planos y datos, comparar alternativas, registrar hipótesis y resolver condicionantes del montaje prefabricado.",
};

const serviceFaqs: Record<string, SeoFaq[]> = {
  "montaje-prefabricados": [
    { question: "¿Qué datos hacen falta para estudiar un montaje prefabricado?", answer: "Planos, listado de piezas, pesos, geometrías, apoyos, ubicación, accesos y calendario permiten definir una primera secuencia y señalar la información pendiente." },
    { question: "¿Puede estudiarse el montaje antes de cerrar la grúa?", answer: "Sí. La revisión previa sirve para comparar posiciones, radios y secuencias antes de solicitar una configuración definitiva al proveedor del equipo." },
    { question: "¿Cómo se coordinan transporte, descarga e izado?", answer: "El orden de expedición se relaciona con el frente de montaje, las zonas de espera y la posibilidad de descargar directamente o acopiar cada pieza." },
  ],
  "ingenieria-de-montaje": [
    { question: "¿Qué diferencia hay entre proyecto e ingeniería de montaje?", answer: "El proyecto define la estructura terminada; la ingeniería de montaje estudia manipulación, secuencia, apoyos temporales, medios e interfaces durante la ejecución." },
    { question: "¿Qué entregables puede incluir el estudio?", answer: "Según alcance, puede incluir implantación, secuencia, esquemas de izado, hipótesis, condicionantes, puntos de espera y documentación necesaria antes de ejecutar." },
    { question: "¿Cuándo conviene iniciar el estudio?", answer: "Antes de cerrar fabricación, transporte y alquiler de grúa, para que las restricciones de montaje puedan incorporarse sin cambios tardíos en obra." },
  ],
  "lifting-plan": [
    { question: "¿Qué comprueba un lifting plan?", answer: "Relaciona carga total, centro de gravedad, puntos de toma, aparejos, radio, altura, configuración de grúa, capacidad de tabla, terreno y trayectoria." },
    { question: "¿El tonelaje nominal de la grúa basta para seleccionarla?", answer: "No. La capacidad disponible depende del radio real, longitud de pluma, contrapeso, configuración de apoyos y deducciones por gancho y aparejos." },
    { question: "¿Puede contratarse únicamente el estudio de izado?", answer: "Sí. El lifting plan puede definirse como un alcance técnico independiente para preparar o revisar una maniobra concreta." },
  ],
  "gruas-y-maniobras": [
    { question: "¿Cómo se determina la grúa necesaria?", answer: "Se parte del peso suspendido y de la geometría más desfavorable de la maniobra, y se contrasta con la tabla de carga de una configuración concreta." },
    { question: "¿Qué debe comprobarse en el apoyo de la grúa?", answer: "Espacio, nivelación, reacciones máximas, capacidad portante del terreno, reparto de cargas y posibles servicios enterrados." },
    { question: "¿Qué elementos se descuentan de la capacidad?", answer: "La masa de gancho, bloque, eslingas, grilletes, balancines y cualquier útil suspendido debe incorporarse al peso total de cálculo." },
  ],
  "logistica-de-obra": [
    { question: "¿Qué se revisa en el acceso final a obra?", answer: "Gálibos, radios de giro, pendientes, firme, zonas de espera, sentido de circulación y maniobras de entrada, descarga y salida." },
    { question: "¿Cuándo conviene descargar directamente?", answer: "Cuando la secuencia, la ventana de llegada y la disponibilidad de grúa son compatibles; si no lo son, debe definirse un acopio estable y accesible." },
    { question: "¿Por qué importa el orden de carga?", answer: "Porque una pieza inaccesible o fuera de secuencia puede obligar a remanipular, bloquear el frente y alterar tiempos y medios previstos." },
  ],
  "asistencia-tecnica": [
    { question: "¿Puede iniciarse una revisión con información incompleta?", answer: "Sí. El primer resultado puede ser una matriz que diferencie datos confirmados, hipótesis y decisiones pendientes, sin presentar estimaciones como definitivas." },
    { question: "¿Qué alternativas pueden compararse?", answer: "Posiciones y tipos de grúa, secuencias, descarga directa o acopio, accesos y distribución de responsabilidades entre agentes." },
    { question: "¿Cómo se registran las decisiones?", answer: "Mediante una lista trazable de consultas, responsables, respuestas, revisiones documentales y condicionantes que afecten al método." },
  ],
};

export const serviceSeoPages: SeoPage[] = technicalServices.map((service) => ({
  kind: "service",
  path: `/servicios/${service.slug}`,
  primaryQuery: serviceQueries[service.slug],
  eyebrow: service.eyebrow,
  title: service.slug === "montaje-prefabricados" ? "Empresa de montaje de prefabricados de hormigón" : `${service.title} para prefabricados`,
  h1: service.title,
  description: serviceDescriptions[service.slug],
  intro: service.intro,
  image: service.image,
  sections: service.sections,
  faqs: serviceFaqs[service.slug],
  related: service.related.map((slug) => `/servicios/${slug}`),
}));

const typePage = (slug: string, query: string, title: string, description: string, intro: string, image: string, focus: string[]): SeoPage => ({
  kind: "type",
  path: `/tipos/${slug}`,
  primaryQuery: query,
  eyebrow: "Aplicación constructiva",
  title,
  h1: title,
  description,
  intro,
  image,
  sections: [
    { title: "Información de partida", body: `El estudio de ${title.toLowerCase()} comienza con geometría, pesos, apoyos, uniones y orden previsto de fabricación.`, items: focus },
    { title: `Medios y secuencia para ${title.toLowerCase()}`, body: `La posición de equipos, el radio de trabajo y la estabilidad temporal de ${title.toLowerCase()} se contrastan con el ritmo de llegada de sus piezas.`, items: ["Radios y alturas de montaje", "Descarga directa o acopio", "Arriostramiento y liberación"] },
    { title: `Interfaces de obra en ${title.toLowerCase()}`, body: `El método de ${title.toLowerCase()} debe coordinar estructura, cimentaciones, topografía, accesos, transporte, grúa y tajos simultáneos.`, items: ["Tolerancias y replanteo", "Zonas de exclusión", "Puntos de espera y comprobación"] },
  ],
  faqs: [
    { question: `¿Qué documentación se necesita para ${title.toLowerCase()}?`, answer: "Planos, despiece, pesos, detalles de apoyo y unión, implantación, accesos y calendario constituyen la base; el estudio identifica cualquier dato pendiente." },
    { question: `¿Cómo se define la secuencia para ${title.toLowerCase()}?`, answer: `En ${title.toLowerCase()} se relaciona cada pieza con transporte, descarga, posición de grúa, estabilización temporal y disponibilidad del siguiente frente.` },
    { question: `¿Cuándo se prepara el plan de izado de ${title.toLowerCase()}?`, answer: `El plan de izado de ${title.toLowerCase()} se prepara cuando están confirmadas la carga, la configuración del equipo, el radio, la implantación, los aparejos y las condiciones de apoyo.` },
  ],
  related: ["/servicios/montaje-prefabricados", "/servicios/ingenieria-de-montaje", "/servicios/lifting-plan"],
});

export const typeSeoPages: SeoPage[] = [
  typePage("naves-industriales", "montaje naves prefabricadas hormigón", "Montaje de naves industriales prefabricadas", "Planificación de pilares, vigas, cubiertas, forjados y paneles para naves prefabricadas, coordinando secuencia, grúas, accesos y estabilidad temporal.", "Una nave prefabricada combina elementos verticales, vigas de gran luz, piezas de cubierta, forjados y cerramientos con dependencias geométricas y temporales.", "/proyectos/industrial-nave-losa-alveolar-35t.webp", ["Pilares, vigas y correas", "Forjados y losas alveolares", "Paneles y estabilidad provisional"]),
  typePage("puentes", "montaje vigas prefabricadas puente", "Montaje de puentes prefabricados", "Estudio de montaje de vigas, dinteles, prelosas y elementos prefabricados de puente con planificación de izados, accesos y ventanas de trabajo.", "El montaje de un puente exige estudiar la maniobra completa, las posiciones de recogida y entrega, las restricciones de tráfico y la estabilidad de cada fase.", "/proyectos/civil-puente-viga-cajon-150t.webp", ["Vigas artesa, cajón o doble T", "Dinteles, prelosas y diafragmas", "Apoyos y geometría de entrega"]),
  typePage("viaductos", "montaje viaductos prefabricados", "Montaje de viaductos prefabricados", "Planificación técnica de vigas, prelosas y elementos de viaducto: secuencia por vanos, radios de grúa, accesos y estabilidad durante el montaje.", "En un viaducto, cada vano debe coordinar piezas, posiciones de grúa, accesos, apoyos y fases posteriores sin confundir la estructura terminada con los estados transitorios.", "/proyectos/civil-viaducto-viga-wt-80t.webp", ["Secuencia por vano", "Vigas, prelosas y apoyos", "Condicionantes de altura y alcance"]),
  typePage("fachadas", "montaje paneles prefabricados fachada", "Montaje de fachadas prefabricadas", "Método de montaje para paneles prefabricados de fachada: izado, fijación, tolerancias, plataformas auxiliares, juntas y coordinación con la estructura.", "Los paneles de fachada requieren controlar la geometría durante el izado, el acceso a fijaciones, las tolerancias de apoyo y el momento en que la pieza queda estable.", "/proyectos/industrial-panel-fachada-22t.webp", ["Paneles macizos, aligerados o sándwich", "Anclajes, apoyos y tolerancias", "Acceso auxiliar y orden de cierre"]),
  typePage("cerramientos", "montaje cerramientos prefabricados hormigón", "Montaje de cerramientos prefabricados", "Planificación de paneles y muros prefabricados de cerramiento, con secuencia de descarga, izado, aplomado, fijación y liberación segura.", "El cerramiento debe coordinarse con la estructura receptora, los huecos, las fijaciones y el avance de otros oficios para evitar esperas o remanipulaciones.", "/proyectos/industrial-panel-fachada-22t.webp", ["Paneles de cerramiento y medianería", "Huecos, petos y piezas singulares", "Aplomado, fijación y sellado"]),
  typePage("otras-tipologias", "montaje estructuras prefabricadas especiales", "Montaje de estructuras prefabricadas especiales", "Estudio de montaje para marquesinas, ampliaciones, estructuras mixtas y prefabricados singulares con geometría o emplazamiento no convencional.", "Las tipologías no repetitivas requieren definir el problema antes de elegir medios: estados temporales, interferencias, accesos y tolerancias pueden dominar la solución.", "/proyectos/110-1045_IMG.jpg.webp", ["Estructuras mixtas y ampliaciones", "Piezas singulares o no repetitivas", "Entornos con acceso restringido"]),
];

const locations = [
  ["madrid", "Madrid", "montaje prefabricados Madrid", "densidad urbana, restricciones de circulación y coordinación de ventanas de acceso", "corredores A-1, A-2, A-3, A-4, A-5 y A-6"],
  ["barcelona", "Barcelona", "montaje prefabricados Barcelona", "entornos metropolitanos compactos, tráfico y accesos portuarios o industriales", "corredores AP-7, A-2, C-32 y C-58"],
  ["valencia", "Valencia", "montaje prefabricados Valencia", "conexión portuaria, áreas logísticas y coexistencia con tráfico metropolitano", "corredores A-3, A-7, V-30 y V-31"],
  ["sevilla", "Sevilla", "montaje prefabricados Sevilla", "temperatura, planificación horaria y accesos a polígonos del área metropolitana", "corredores A-4, A-49, A-66 y SE-40"],
  ["zaragoza", "Zaragoza", "montaje prefabricados Zaragoza", "viento, plataformas logísticas y conexiones entre los ejes nordeste y centro", "corredores A-2, AP-2, A-23 y Z-40"],
  ["malaga", "Málaga", "montaje prefabricados Málaga", "relieve, accesos costeros y ocupaciones limitadas en áreas urbanas", "corredores A-7, AP-7, A-45 y MA-20"],
  ["bilbao", "Bilbao", "montaje prefabricados Bilbao", "orografía, lluvia, gálibos y espacios industriales condicionados", "corredores A-8, AP-68 y accesos metropolitanos"],
  ["valladolid", "Valladolid", "montaje prefabricados Valladolid", "polígonos industriales, viento y coordinación de trayectos interurbanos", "corredores A-62, A-6, A-11 y VA-30"],
  ["alicante", "Alicante", "montaje prefabricados Alicante", "tráfico estacional, accesos litorales y áreas industriales dispersas", "corredores A-7, AP-7, A-31 y A-70"],
  ["coruna", "A Coruña", "montaje prefabricados A Coruña", "meteorología atlántica, relieve y accesos a zonas portuarias e industriales", "corredores A-6, AP-9, AC-10 y AC-14"],
] as const;

export const citySeoPages: SeoPage[] = locations.map(([slug, city, query, constraint, corridors]) => ({
  kind: "location",
  path: `/${slug}`,
  primaryQuery: query,
  eyebrow: "Planificación local",
  title: `Montaje de prefabricados en ${city}`,
  h1: `Montaje de prefabricados en ${city}`,
  description: `Planificación de montaje prefabricado en ${city}: piezas, grúas, accesos, secuencia, logística de obra y estudio previo de izados.`,
  intro: `Planificar un montaje en ${city} exige relacionar la estructura con ${constraint}. La solución se define con datos de la obra concreta, no mediante una grúa o rendimiento genéricos.`,
  image: "/proyectos/industrial-nave-losa-alveolar-35t.webp",
  sections: [
    { title: `Condicionantes en ${city}`, body: `La implantación debe comprobar accesos, restricciones locales, zonas de espera y conexión con ${corridors}.`, items: ["Recorrido final y radios de giro", "Posición y apoyo de la grúa", "Ventanas de llegada y montaje"] },
    { title: `Datos para el preestudio en ${city}`, body: `La revisión de una operación en ${city} comienza con documentación verificable de piezas y emplazamiento.`, items: ["Planos, despiece y pesos", "Dirección y plano de implantación", "Calendario y restricciones conocidas"] },
    { title: `Decisiones antes de movilizar en ${city}`, body: `El objetivo en ${city} es detectar incompatibilidades antes de comprometer transporte, grúa y cuadrilla.`, items: ["Descarga directa o acopio", "Secuencia y estabilidad temporal", "Configuración preliminar de medios"] },
  ],
  faqs: [
    { question: `¿Qué se necesita para estudiar un montaje en ${city}?`, answer: "Planos, piezas, pesos, ubicación exacta, accesos, implantación y fechas previstas permiten preparar una revisión inicial." },
    { question: `¿Se revisan los accesos de la obra en ${city}?`, answer: `Sí. El recorrido final, los giros, gálibos, pendientes, firme, zonas de espera y restricciones aplicables forman parte de la planificación logística.` },
    { question: `¿Puede solicitarse solo un lifting plan para una obra en ${city}?`, answer: `Sí. Para una obra en ${city}, el estudio de izado puede contratarse de forma independiente cuando la carga, el emplazamiento y la configuración prevista están suficientemente definidos.` },
  ],
  related: ["/servicios/montaje-prefabricados", "/servicios/lifting-plan", "/tipos/naves-industriales"],
  areaServed: city,
}));

export const allSeoPages = [...serviceSeoPages, ...typeSeoPages, ...citySeoPages];
export const seoPageByPath = Object.fromEntries(allSeoPages.map((page) => [page.path, page])) as Record<string, SeoPage>;
