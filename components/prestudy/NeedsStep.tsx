import { NEEDS, type PreStudyData } from "@/lib/prestudy";

export default function NeedsStep({ data, update }: { data: PreStudyData; update: (patch: Partial<PreStudyData>) => void }) {
  const toggle = (need: string) => update({needs:data.needs.includes(need) ? data.needs.filter((item) => item !== need) : [...data.needs,need]});
  return <div><h3>¿QUÉ NECESITAS?</h3><p className="sub">Puedes seleccionar varias opciones. Si no lo sabes, también es una respuesta válida.</p><div className="choice-grid">{NEEDS.map((need) => <button type="button" aria-pressed={data.needs.includes(need)} className={`choice${data.needs.includes(need) ? " selected" : ""}`} onClick={() => toggle(need)} key={need}><span className="choice-icon">{need === "No lo tengo claro" ? "?" : "⌁"}</span><strong>{need}</strong><span>Incluir en el preestudio</span></button>)}</div></div>;
}
