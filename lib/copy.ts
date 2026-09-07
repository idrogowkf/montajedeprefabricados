
export const HERO_TITLE = 'Montaje de prefabricados, sin sorpresas.'
export const HERO_DESC = 'Ingeniería de izado y coordinación de transporte, grúas y maniobras desde la planificación hasta la posición final.'

export function cityCopy(city: string) {
  const C = city[0].toUpperCase() + city.slice(1)
  return {
    title: `Montaje de prefabricados en ${C}`,
    desc: `Planificación de transporte, grúas y montaje prefabricado en ${C}: vigas, losas alveolares, pilares, pórticos y fachadas.`
  }
}

export function tipoCopy(tipo: string) {
  const t = tipo.replace('-', ' ')
  return {
    title: `Montaje de prefabricados: ${t}`,
    desc: `Jefatura de montaje, contradirección, plan de izados, replanteo y as‑built para ${t}. Coordinación con Ibercarga y selección de grúas.`
  }
}
