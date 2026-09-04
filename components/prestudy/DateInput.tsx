"use client";

import { useEffect, useRef, useState } from "react";
import { formatSpanishDate, parseSpanishDate } from "@/lib/date-input";

export default function DateInput({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const nativeInput = useRef<HTMLInputElement>(null);
  const [manual, setManual] = useState(() => formatSpanishDate(value));
  const [error, setError] = useState("");

  useEffect(() => setManual(formatSpanishDate(value)), [value]);

  const commitManual = () => {
    if (!manual.trim()) { setError(""); onChange(""); return; }
    const parsed = parseSpanishDate(manual);
    setError(parsed ? "" : "Introduce una fecha real con formato DD/MM/AAAA.");
    if (parsed) onChange(parsed);
  };

  const openCalendar = () => {
    const input = nativeInput.current;
    if (!input) return;
    if (typeof input.showPicker === "function") input.showPicker();
    else input.focus();
  };

  return <div className="date-entry"><label htmlFor="date-manual">Fecha prevista de montaje</label><div className="date-controls"><input id="date-manual" inputMode="numeric" autoComplete="off" placeholder="DD/MM/AAAA" value={manual} onChange={(event) => {setManual(event.target.value);setError("");}} onBlur={commitManual} aria-describedby="date-help date-error" aria-invalid={!!error} /><button type="button" className="calendar-button" onClick={openCalendar} aria-label="Abrir calendario">Calendario</button><input ref={nativeInput} className="native-date-picker" type="date" value={value} onChange={(event) => {onChange(event.target.value);setError("");}} tabIndex={-1} aria-hidden="true" /></div><span id="date-help" className="field-help">Escribe la fecha o selecciónala en el calendario.</span>{error && <span id="date-error" className="field-error" role="alert">{error}</span>}</div>;
}
