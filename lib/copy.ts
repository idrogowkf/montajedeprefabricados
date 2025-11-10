
export const HERO_TITLE = 'Montaje de prefabricados, sin sorpresas.'
export const HERO_DESC = 'Ingeniería de izado, equipos certificados y cuadrillas expertas. Coordinamos transporte (Ibercarga), grúas y maniobras críticas, del planteizado a la entrega.'

export function cityCopy(city: string) {
  const C = city[0].toUpperCase() + city.slice(1)
  return {
    title: `Montaje de prefabricados en ${C}`,
    desc: `Cuadrillas especialistas, grúas 80–500T+, transporte especial y planos de montaje en ${C}. Vigas, losas alveolares, pilares, pórticos y fachada.`
  }
}

export function tipoCopy(tipo: string) {
  const t = tipo.replace('-', ' ')
  return {
    title: `Montaje de prefabricados: ${t}`,
    desc: `Jefatura de montaje, contradirección, plan de izados, replanteo y as‑built para ${t}. Coordinación con Ibercarga y selección de grúas.`
  }
}
