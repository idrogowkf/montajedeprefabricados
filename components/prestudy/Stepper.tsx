export const stepTitles = ["¿Qué vas a montar?", "Datos de las piezas", "Emplazamiento y accesos", "¿Qué necesitas?", "Documentación", "Datos de contacto"];

export default function Stepper({ step }: { step: number }) {
  return <><div className="progress-head"><strong>{String(step).padStart(2,"0")} · {stepTitles[step - 1]}</strong><span className="mono">Paso {step} de 6</span></div><div className="progress" aria-label={`Paso ${step} de 6`}>{stepTitles.map((title,index) => <i className={index < step ? "done" : ""} key={title} />)}</div></>;
}
