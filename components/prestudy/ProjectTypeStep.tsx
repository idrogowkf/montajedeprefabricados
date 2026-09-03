import { PROJECT_TYPES, type PreStudyData } from "@/lib/prestudy";

export default function ProjectTypeStep({ data, update, error }: { data: PreStudyData; update: (patch: Partial<PreStudyData>) => void; error?: string }) {
  const symbols = ["⌂","═","▥","⌗","▤","?"];
  return <div><h3>¿QUÉ VAS A MONTAR?</h3><p className="sub">Selecciona la tipología que más se parece a tu proyecto. No pasa nada si no es exacta.</p><div className="choice-grid" role="radiogroup" aria-label="Tipología de proyecto">{PROJECT_TYPES.map((type,index) => <button type="button" role="radio" aria-checked={data.projectType === type} className={`choice${data.projectType === type ? " selected" : ""}`} onClick={() => update({projectType:type})} key={type}><span className="choice-icon">{symbols[index]}</span><strong>{type}</strong><span>{index === 5 ? "Te ayudamos a clasificarlo" : "Seleccionar tipología"}</span></button>)}</div>{error && <p className="field-error" role="alert">{error}</p>}</div>;
}
