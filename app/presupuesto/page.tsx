// app/presupuesto/page.tsx
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

/** =========================================================================
 *  PRESUPUESTO — FIXES v2
 *  (1) Dimensiones con decimales: acepta coma y punto (estado draft + onBlur)
 *  (2) Se añade bloque "Coordinación y supervisión de montaje (a convenir)"
 *      con Lifting Plan, Secuencia, Seguridad e Instrucciones de montaje.
 *  (3) Fix de tipos para setPartidas({}) usando PartidasMap
 *  Resto del flujo, estilos y endpoints permanecen igual.
 * ========================================================================= */

type TipoObra = "industrial" | "residencial" | "civil";
type Jornada = "Diurna" | "Nocturna" | "Nocturna festivo/fin de semana";

type PartKeyIndRes =
    | "pilares"
    | "vigas"
    | "placa_alveolar"
    | "cimentacion"
    | "paneles"
    | "paneles_arquitectonicos";

type PartKeyCivil =
    | "pila"
    | "vigas"
    | "placa_pretensada"
    | "placa_celosia"
    | "cerramiento"
    | "cubierta"
    | "obra_singular";

type PartidasAny = PartKeyIndRes | PartKeyCivil;

type Dimensiones = {
    qty: number;
    largo: number;
    ancho: number;
    alto: number;
    peso: number; // t
    radio: number; // m
    plataformas: boolean;
};

type PartidaState = {
    key: PartidasAny;
    nombre: string;
    dims: Dimensiones;
};

type ResultadoResumen = {
    subtotal_public: number;
    iva_public: number;
    total_public: number;
};

// ✅ Tipo auxiliar para permitir resets con {}
type PartidasMap = Partial<Record<PartidasAny, PartidaState>>;
type DraftMap = Partial<Record<PartidasAny, Partial<Record<keyof Dimensiones, string>>>>;

// -------------------- Estilos reutilizables --------------------
const BTN =
    "inline-flex items-center justify-center rounded-xl px-3 py-2 text-sm font-semibold ring-1 transition";
const BTN_SOLID =
    "bg-yellow-400 text-neutral-900 ring-yellow-300 hover:bg-yellow-300";
const BTN_GHOST =
    "text-neutral-200 ring-neutral-700 hover:bg-neutral-900/60";

const FIELD =
    "rounded-xl border border-neutral-300/80 bg-white px-3 py-2 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-yellow-400/70 min-w-0";
const CARD =
    "rounded-2xl border border-neutral-200 bg-neutral-50 p-5 shadow-sm";
const GRID_FORM =
    "grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4";
const GRID_PARTIDAS =
    "grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6";
const CHIP =
    "inline-flex items-center rounded-xl px-3 py-1 text-xs font-semibold ring-1";
const HR = <div className="my-6 h-px bg-neutral-200" />;

// ---------- Utilidades ----------
const parseDec = (v: string): number => {
    if (v == null) return 0;
    const trimmed = v.trim();
    if (trimmed === "" || trimmed === "," || trimmed === ".") return 0;
    const s = trimmed.replace(",", ".").replace(/[^\d.\-]/g, "");
    const n = Number(s);
    return isNaN(n) ? 0 : n;
};

// ==================== Calendario propio ====================
type CalendarProps = {
    value?: string; // "YYYY-MM-DD"
    onChange: (val: string) => void;
    onClose?: () => void;
};

function pad(n: number) {
    return n < 10 ? `0${n}` : `${n}`;
}
function fmt(d: Date) {
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
function daysInMonth(y: number, m: number) {
    return new Date(y, m + 1, 0).getDate();
}

const Calendar: React.FC<CalendarProps> = ({ value, onChange, onClose }) => {
    const initial = value ? new Date(value) : new Date();
    const [year, setYear] = useState(initial.getFullYear());
    const [month, setMonth] = useState(initial.getMonth()); // 0..11
    const [selected, setSelected] = useState<Date | null>(value ? new Date(value) : null);

    const firstDay = new Date(year, month, 1);
    const startWeekday = (firstDay.getDay() + 6) % 7; // L(0)..D(6)
    const total = daysInMonth(year, month);

    const prevMonth = () => {
        let y = year, m = month - 1;
        if (m < 0) { m = 11; y--; }
        setYear(y); setMonth(m);
    };
    const nextMonth = () => {
        let y = year, m = month + 1;
        if (m > 11) { m = 0; y++; }
        setYear(y); setMonth(m);
    };

    const pick = (d: number) => {
        const dt = new Date(year, month, d);
        setSelected(dt);
        onChange(fmt(dt));
        if (onClose) onClose();
    };

    const monthName = new Intl.DateTimeFormat("es-ES", { month: "long", year: "numeric" }).format(new Date(year, month, 1));

    return (
        <div className="z-50 w-72 rounded-xl border border-neutral-200 bg-white p-3 shadow-xl">
            <div className="mb-2 flex items-center justify-between">
                <button type="button" onClick={prevMonth} className={`${BTN} ${BTN_GHOST}`}>◀</button>
                <div className="text-sm font-semibold text-neutral-800 capitalize">{monthName}</div>
                <button type="button" onClick={nextMonth} className={`${BTN} ${BTN_GHOST}`}>▶</button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-neutral-500">
                {["L", "M", "X", "J", "V", "S", "D"].map((d) => <div key={d} className="py-1">{d}</div>)}
            </div>
            <div className="mt-1 grid grid-cols-7 gap-1 text-center">
                {Array.from({ length: startWeekday }).map((_, i) => (
                    <div key={`pad-${i}`} className="py-1.5 text-xs text-transparent select-none">.</div>
                ))}
                {Array.from({ length: total }).map((_, i) => {
                    const day = i + 1;
                    const isSel = selected && selected.getFullYear() === year && selected.getMonth() === month && selected.getDate() === day;
                    return (
                        <button
                            key={day}
                            type="button"
                            onClick={() => pick(day)}
                            className={`rounded-lg px-0.5 py-1.5 text-sm ${isSel ? "bg-yellow-400 text-neutral-900 font-semibold" : "hover:bg-neutral-100"
                                }`}
                        >
                            {day}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

type DateFieldProps = {
    label: string;
    value: string;
    onChange: (v: string) => void;
};
const DateField: React.FC<DateFieldProps> = ({ label, value, onChange }) => {
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const onDocClick = (e: MouseEvent) => {
            if (!wrapperRef.current) return;
            if (!wrapperRef.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", onDocClick);
        return () => document.removeEventListener("mousedown", onDocClick);
    }, []);

    return (
        <div className="relative" ref={wrapperRef}>
            <label className="mb-1 block text-xs font-semibold text-neutral-700">{label}</label>
            <div className="flex items-center gap-2">
                <input
                    className={`${FIELD} cursor-pointer`}
                    readOnly
                    value={value || ""}
                    placeholder="Selecciona fecha"
                    onClick={() => setOpen((v) => !v)}
                />
                <button type="button" className={`${BTN} ${BTN_GHOST}`} onClick={() => setOpen((v) => !v)}>
                    Calendario
                </button>
            </div>
            {open && (
                <div className="absolute z-50 mt-2">
                    <Calendar
                        value={value}
                        onChange={(v) => onChange(v)}
                        onClose={() => setOpen(false)}
                    />
                </div>
            )}
        </div>
    );
};

// ==================== Página ====================
const LABELS_IND_RES: { key: PartKeyIndRes; nombre: string }[] = [
    { key: "pilares", nombre: "Pilares" },
    { key: "vigas", nombre: "Vigas" },
    { key: "placa_alveolar", nombre: "Placa alveolar" },
    { key: "cimentacion", nombre: "Cimentación" },
    { key: "paneles", nombre: "Paneles" },
    { key: "paneles_arquitectonicos", nombre: "Paneles arquitectónicos" },
];

const LABELS_CIVIL: { key: PartKeyCivil; nombre: string }[] = [
    { key: "pila", nombre: "Pila" },
    { key: "vigas", nombre: "Vigas" },
    { key: "placa_pretensada", nombre: "Placa pretensada" },
    { key: "placa_celosia", nombre: "Placa de celosía" },
    { key: "cerramiento", nombre: "Cerramiento" },
    { key: "cubierta", nombre: "Cubierta" },
    { key: "obra_singular", nombre: "Obra singular" },
];

export default function PresupuestoPage() {
    // Estado base
    const [ciudad, setCiudad] = useState("Madrid");
    const [tipoObra, setTipoObra] = useState<TipoObra>("industrial");
    const [sistema, setSistema] = useState<"hormigon" | "madera" | "steel" | "pvc">("hormigon");

    // Fechas con calendario propio
    const [fechaInicio, setFechaInicio] = useState<string>("");
    const [fechaFin, setFechaFin] = useState<string>("");

    // Jornadas/equipos
    const [jornada, setJornada] = useState<Jornada>("Diurna");
    const [equipos, setEquipos] = useState<number>(1);
    const [jornadasTexto, setJornadasTexto] = useState<string>("1 diurna");

    // Partidas
    const [seleccion, setSeleccion] = useState<PartidasAny[]>([]);
    const [partidas, setPartidas] = useState<PartidasMap>({}); // ✅ fix typing

    // --- NUEVO: estado draft por campo decimal (permite teclear coma/punto) ---
    const [draft, setDraft] = useState<DraftMap>({}); // ✅ fix typing

    // Resultados
    const [tablaHTML, setTablaHTML] = useState("");
    const [resumen, setResumen] = useState<ResultadoResumen | null>(null);
    const [pdfB64, setPdfB64] = useState("");
    const [pdfName, setPdfName] = useState("Presupuesto.pdf");
    const [puedeDescargar, setPuedeDescargar] = useState(false);
    const [errorInfo, setErrorInfo] = useState<string | null>(null);
    const [cargando, setCargando] = useState(false);
    const [generatedOnce, setGeneratedOnce] = useState(false);

    const [clienteEmpresa, setClienteEmpresa] = useState("");
    const [contactoNombre, setContactoNombre] = useState("");
    const [contactoEmail, setContactoEmail] = useState("");

    const payloadRef = useRef<any>(null);

    const visibleLabels = useMemo(() => {
        if (tipoObra === "civil") return LABELS_CIVIL;
        return LABELS_IND_RES;
    }, [tipoObra]);

    const emptyDims = (): Dimensiones => ({
        qty: 0,
        largo: 0,
        ancho: 0,
        alto: 0,
        peso: 0,
        radio: 0,
        plataformas: false,
    });

    const togglePartida = (key: PartidasAny, nombre: string) => {
        setSeleccion((prev) => {
            if (prev.includes(key)) {
                const n = prev.filter((k) => k !== key);
                const p = { ...partidas };
                delete p[key];
                setPartidas(p);
                const d = { ...draft };
                delete d[key];
                setDraft(d);
                return n;
            } else {
                const p = { ...partidas };
                p[key] = { key, nombre, dims: emptyDims() };
                setPartidas(p);
                const d = { ...draft };
                d[key] = {};
                setDraft(d);
                return [...prev, key];
            }
        });
    };

    // Set de campos numéricos vía draft (acepta coma/punto); commit en onBlur
    const setDraftField = (key: PartidasAny, field: keyof Dimensiones, text: string) => {
        // Permitimos solo 0-9, coma, punto y vacío
        if (!/^[0-9.,]*$/.test(text)) return;
        setDraft((prev) => ({ ...prev, [key]: { ...(prev[key] || {}), [field]: text } }));
    };
    const commitDraftField = (key: PartidasAny, field: keyof Dimensiones) => {
        const text = draft[key]?.[field] ?? "";
        const num = typeof text === "string" ? parseDec(text) : 0;
        setPartidas((prev) => {
            const clone = { ...prev };
            const cur = clone[key];
            if (!cur) return prev;
            clone[key] = { ...cur, dims: { ...cur.dims, [field]: num } };
            return clone;
        });
        // Normalizamos visualmente el draft con la notación actual
        setDraft((prev) => ({
            ...prev,
            [key]: { ...(prev[key] || {}), [field]: text === "" ? "" : String(num).replace(".", ",") },
        }));
    };

    const updateQty = (key: PartidasAny, value: string) => {
        const n = Math.max(0, Math.floor(Number(value || 0)));
        setPartidas((prev) => {
            const clone = { ...prev };
            const cur = clone[key];
            if (!cur) return prev;
            clone[key] = { ...cur, dims: { ...cur.dims, qty: n } };
            return clone;
        });
    };

    function deriveMaxPesoRadio() {
        let pesoMax = 0;
        let radioMax = 0;
        seleccion.forEach((k) => {
            const d = partidas[k]?.dims;
            if (!d) return;
            if (d.peso > pesoMax) pesoMax = d.peso;
            if (d.radio > radioMax) radioMax = d.radio;
        });
        return { pesoMax, radioMax };
    }

    const buildPayload = () => {
        let vigas_wt = 0;
        let paneles_fachada = 0;
        let losas_alveolares = 0;
        let pilares = 0;

        seleccion.forEach((k) => {
            const d = partidas[k]?.dims;
            if (!d) return;
            const qty = Math.max(0, Math.floor(d.qty || 0));
            if (["vigas", "placa_pretensada", "placa_celosia"].includes(k)) vigas_wt += qty;
            if (["paneles", "paneles_arquitectonicos", "cerramiento"].includes(k)) paneles_fachada += qty;
            if (["placa_alveolar", "cubierta"].includes(k)) losas_alveolares += qty;
            if (["pilares", "pila", "cimentacion"].includes(k)) pilares += qty;
        });

        const { pesoMax, radioMax } = deriveMaxPesoRadio();

        const payload = {
            cliente: clienteEmpresa || "Cliente",
            contacto: contactoNombre || "",
            email: contactoEmail || "",
            obra: fechaInicio && fechaFin ? `Del ${fechaInicio} al ${fechaFin}` : "",
            ciudad,
            tipo_obra: tipoObra,
            vigas_wt,
            paneles_fachada,
            losas_alveolares,
            pilares,
            peso_max_t: Number(pesoMax || 0),
            radio_max_m: Number(radioMax || 0),
            jornadas: `${jornadasTexto} · ${equipos} equipos`,
            grua_prevista: "A convenir con técnico",
            trabajo_noche: jornada,
        };
        return payload;
    };

    const generar = async () => {
        setCargando(true);
        setTablaHTML("");
        setResumen(null);
        setPdfB64("");
        setPdfName("Presupuesto.pdf");
        setPuedeDescargar(false);
        setErrorInfo(null);

        const payload = buildPayload();
        payloadRef.current = payload;

        try {
            const r = await fetch("/api/presupuesto", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...payload, mode: "calcular" }),
            });
            const j = await r.json();

            setGeneratedOnce(true);

            if (!j?.ok) {
                setErrorInfo("Presupuesto en marcha. Un técnico lo estudiará.");
                return;
            }
            setErrorInfo(j.errorInfo || null);
            setTablaHTML(j.html_public_table || ""); // HTML de la API
            setResumen(j.resumen || null);
            setPdfB64(j.pdfBase64 || "");
            setPdfName(j.filename || "Presupuesto.pdf");
            setPuedeDescargar(Boolean(j.pdfBase64));
        } catch {
            setGeneratedOnce(true);
            setErrorInfo("Presupuesto en marcha. Un técnico lo estudiará.");
        } finally {
            setCargando(false);
        }
    };

    const descargarPDF = () => {
        if (!pdfB64) return;
        const a = document.createElement("a");
        a.href = "data:application/pdf;base64," + pdfB64;
        a.download = pdfName;
        document.body.appendChild(a);
        a.click();
        a.remove();
    };

    const enviar = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!payloadRef.current) return;

        const payload = {
            ...payloadRef.current,
            cliente: clienteEmpresa || "Cliente",
            contacto: contactoNombre || "",
            email: contactoEmail || "",
            mode: "enviar",
        };

        setCargando(true);
        try {
            const r = await fetch("/api/presupuesto", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const j = await r.json();
            if (j?.ok) {
                alert("¡Enviado! Revisa tu correo. Un técnico te contactará pronto.");
            } else {
                alert("No se pudo enviar. Inténtalo de nuevo.");
            }
        } catch {
            alert("No se pudo enviar. Inténtalo de nuevo.");
        } finally {
            setCargando(false);
        }
    };

    // ---------- UI auxiliares ----------
    const PartidasSelector = () => (
        <div className="flex flex-wrap gap-2">
            {(tipoObra === "civil" ? LABELS_CIVIL : LABELS_IND_RES).map(({ key, nombre }) => {
                const active = seleccion.includes(key);
                return (
                    <button
                        key={key}
                        type="button"
                        onClick={() => togglePartida(key as PartidasAny, nombre)}
                        className={`${BTN} ${active ? BTN_SOLID : BTN_GHOST}`}
                    >
                        {nombre}
                    </button>
                );
            })}
        </div>
    );

    const DecField = (
        k: PartidasAny,
        field: keyof Dimensiones,
        label: string,
        placeholder = "0,00"
    ) => {
        const raw = draft[k]?.[field];
        const display =
            raw !== undefined
                ? raw
                : partidas[k]
                    ? String(partidas[k].dims[field]).replace(".", ",")
                    : "";

        return (
            <div className="min-w-0">
                <label className="mb-1 block text-xs font-semibold text-neutral-700">
                    {label}
                </label>
                <input
                    className={`${FIELD}`}
                    type="text"
                    inputMode="decimal"
                    placeholder={placeholder}
                    value={display}
                    onChange={(e) => setDraftField(k, field, e.target.value)}
                    onBlur={() => commitDraftField(k, field)}
                />
            </div>
        );
    };

    const PartidasDetalle = () => {
        if (seleccion.length === 0) return null;
        return (
            <div className="mt-5 space-y-5">
                {seleccion.map((key) => {
                    const p = partidas[key];
                    if (!p) return null;
                    const d = p.dims;
                    return (
                        <div key={key} className="rounded-xl border border-neutral-200 bg-white p-4">
                            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                                <div className={`${CHIP} bg-neutral-900 text-yellow-300 ring-neutral-800`}>{p.nombre}</div>
                                <div className="flex items-center gap-3">
                                    <label className="flex items-center gap-2 text-sm text-neutral-700">
                                        <input
                                            type="checkbox"
                                            checked={d.plataformas}
                                            onChange={(e) =>
                                                setPartidas((prev) => {
                                                    const clone = { ...prev };
                                                    const cur = clone[key];
                                                    if (!cur) return prev;
                                                    clone[key] = {
                                                        ...cur,
                                                        dims: { ...cur.dims, plataformas: e.target.checked },
                                                    };
                                                    return clone;
                                                })
                                            }
                                        />
                                        Plataformas elevadoras
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => togglePartida(key, p.nombre)}
                                        className={`${BTN} ${BTN_GHOST}`}
                                    >
                                        Quitar
                                    </button>
                                </div>
                            </div>
                            <div className={GRID_PARTIDAS}>
                                <div className="min-w-0">
                                    <label className="mb-1 block text-xs font-semibold text-neutral-700">Unidades</label>
                                    <input
                                        className={FIELD}
                                        type="number"
                                        min={0}
                                        step={1}
                                        value={d.qty}
                                        onChange={(e) => updateQty(key, e.target.value)}
                                        placeholder="0"
                                    />
                                </div>
                                {DecField(key, "largo", "Largo (m)")}
                                {DecField(key, "ancho", "Ancho (m)")}
                                {DecField(key, "alto", "Alto (m)")}
                                {DecField(key, "radio", "Radio de montaje (m)")}
                                {DecField(key, "peso", "Peso por pieza (t)")}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-white text-neutral-900">
            {/* Header */}
            <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/80 backdrop-blur">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
                    <a href="/" className="flex items-center gap-2">
                        <div className="grid h-9 w-9 place-items-center rounded-xl bg-yellow-400 font-black text-neutral-900">MP</div>
                        <div>
                            <div className="text-[11px] font-extrabold tracking-widest text-yellow-500">MONTAJE DE PREFABRICADOS</div>
                            <div className="text-[11px] text-neutral-500">Estructuras · Transporte · Grúas</div>
                        </div>
                    </a>
                    <a href="/" className={`${BTN} ${BTN_GHOST}`} aria-label="Volver al inicio">
                        Volver al landing
                    </a>
                </div>
            </header>

            <main className="mx-auto max-w-6xl px-5 py-8">
                <h1 className="text-2xl font-extrabold tracking-tight">Presupuesto técnico</h1>
                <p className="mt-1 text-sm text-neutral-600">
                    Selecciona el periodo, el tipo de obra, las partidas y define cantidades y dimensiones (con decimales). Luego genera el presupuesto.
                </p>

                {/* Form principal */}
                <section className={`${CARD} mt-5`}>
                    <div className={GRID_FORM}>
                        <DateField label="Fecha inicio" value={fechaInicio} onChange={setFechaInicio} />
                        <DateField label="Fecha fin" value={fechaFin} onChange={setFechaFin} />

                        <div className="min-w-0">
                            <label className="mb-1 block text-xs font-semibold text-neutral-700">Ciudad</label>
                            <input
                                className={FIELD}
                                placeholder="Madrid, Valencia, ..."
                                value={ciudad}
                                onChange={(e) => setCiudad(e.target.value)}
                            />
                        </div>

                        <div className="min-w-0">
                            <label className="mb-1 block text-xs font-semibold text-neutral-700">Tipo de obra</label>
                            <div className="flex flex-wrap gap-2">
                                {(["industrial", "residencial", "civil"] as TipoObra[]).map((t) => (
                                    <button
                                        key={t}
                                        type="button"
                                        onClick={() => {
                                            setTipoObra(t);
                                            setSeleccion([]);
                                            setPartidas({}); // ✅ permitido por PartidasMap
                                            setDraft({});    // ✅ permitido por DraftMap
                                        }}
                                        className={`${BTN} ${tipoObra === t ? BTN_SOLID : BTN_GHOST}`}
                                    >
                                        {t[0].toUpperCase() + t.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sistema */}
                    <div className="mt-4">
                        <label className="mb-1 block text-xs font-semibold text-neutral-700">Sistema constructivo</label>
                        <div className="flex flex-wrap gap-2">
                            {[
                                ["hormigon", "Hormigón"],
                                ["madera", "Madera"],
                                ["steel", "Steel framing"],
                                ["pvc", "PVC"],
                            ].map(([k, label]) => (
                                <button
                                    key={k}
                                    type="button"
                                    onClick={() => setSistema(k as any)}
                                    className={`${BTN} ${sistema === k ? BTN_SOLID : BTN_GHOST}`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Jornada / equipos / periodo texto */}
                    <div className={`${GRID_FORM} mt-4`}>
                        <div className="min-w-0">
                            <label className="mb-1 block text-xs font-semibold text-neutral-700">Jornada</label>
                            <select className={FIELD} value={jornada} onChange={(e) => setJornada(e.target.value as Jornada)}>
                                <option value="Diurna">Diurna</option>
                                <option value="Nocturna">Nocturna</option>
                                <option value="Nocturna festivo/fin de semana">Nocturna festivo/fin de semana</option>
                            </select>
                        </div>
                        <div className="min-w-0">
                            <label className="mb-1 block text-xs font-semibold text-neutral-700">Equipos de montadores</label>
                            <select className={FIELD} value={equipos} onChange={(e) => setEquipos(Number(e.target.value))}>
                                <option value={1}>1 equipo</option>
                                <option value={2}>2 equipos</option>
                                <option value={3}>3 equipos</option>
                            </select>
                        </div>
                        <div className="sm:col-span-2 md:col-span-2 xl:col-span-2 min-w-0">
                            <label className="mb-1 block text-xs font-semibold text-neutral-700">Periodo (texto de jornadas)</label>
                            <input
                                className={FIELD}
                                placeholder="Ej.: 3 diurnas"
                                value={jornadasTexto}
                                onChange={(e) => setJornadasTexto(e.target.value)}
                            />
                        </div>
                    </div>

                    {HR}

                    {/* Partidas */}
                    <div>
                        <div className="mb-2 text-sm font-semibold text-neutral-800">
                            Partidas {tipoObra === "civil" ? "— Obra civil" : "— Industrial/Residencial"}
                        </div>
                        <PartidasSelector />
                        <PartidasDetalle />
                    </div>

                    <div className="mt-6">
                        <button type="button" onClick={generar} disabled={cargando} className={`${BTN} ${BTN_SOLID} w-full`}>
                            {cargando ? "Generando..." : "Generar presupuesto técnico"}
                        </button>
                    </div>

                    {/* Aviso si el cálculo falló (visible tras generar) */}
                    {generatedOnce && errorInfo && (
                        <div className="mt-4 rounded-xl border border-yellow-300 bg-yellow-50 p-3 text-sm text-yellow-800">
                            {errorInfo}. Completa tus datos y envíanos la solicitud para que el técnico continúe el estudio.
                        </div>
                    )}
                </section>

                {/* RESULTADOS — sólo visibles tras generar */}
                {generatedOnce && (
                    <>
                        {tablaHTML && (
                            <section className="mt-6">
                                <div className={`${CARD} !p-0`}>
                                    <div className="border-b border-neutral-200 px-5 py-3">
                                        <div className="text-sm font-semibold">Desglose</div>
                                        <div className="text-xs text-neutral-500">Maquetado tipo Presto (Precio al público)</div>
                                    </div>
                                    <div className="px-5 py-4">
                                        {/* HTML de la API */}
                                        <div id="tabla-presupuesto" className="prose max-w-none" dangerouslySetInnerHTML={{ __html: tablaHTML }} />

                                        {/* ---- Bloque añadido: Coordinación y supervisión de montaje ---- */}
                                        <div className="mt-6 rounded-xl border border-neutral-200 bg-white p-4">
                                            <div className="mb-2 text-sm font-semibold text-neutral-800">
                                                Coordinación y supervisión de montaje <span className="text-xs font-normal text-neutral-500">(incluye)</span>
                                            </div>
                                            <ul className="list-disc pl-5 text-sm text-neutral-700 space-y-1">
                                                <li>Lifting Plan (plan de izado) del alcance seleccionado</li>
                                                <li>Estudio de secuencia de montaje</li>
                                                <li>Recomendaciones y criterios de seguridad</li>
                                                <li>Instrucciones de montaje y coordinación en obra</li>
                                            </ul>
                                            <div className="mt-2 text-sm">
                                                <span className="text-neutral-500">Costo:</span>{" "}
                                                <span className="font-semibold">A convenir</span>
                                            </div>
                                        </div>

                                        {/* Totales */}
                                        {resumen && (
                                            <div className="mt-6 grid gap-2 text-sm">
                                                <div className="flex items-center justify-end gap-8">
                                                    <div className="text-neutral-500">Subtotal</div>
                                                    <div className="font-semibold">{resumen.subtotal_public.toFixed(2)} €</div>
                                                </div>
                                                <div className="flex items-center justify-end gap-8">
                                                    <div className="text-neutral-500">IVA (21%)</div>
                                                    <div className="font-semibold">{resumen.iva_public.toFixed(2)} €</div>
                                                </div>
                                                <div className="flex items-center justify-end gap-8">
                                                    <div className="text-neutral-700">TOTAL</div>
                                                    <div className="text-lg font-extrabold text-neutral-900">
                                                        {resumen.total_public.toFixed(2)} €
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Descarga PDF solo si existe */}
                                        {puedeDescargar && pdfB64 && (
                                            <button type="button" onClick={descargarPDF} className={`${BTN} ${BTN_GHOST} mt-5 w-full`}>
                                                Descargar PDF
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* Form envío */}
                        <section className={`${CARD} mt-6`}>
                            <div className="mb-3 text-sm font-semibold">Contactar al técnico de obras</div>
                            <form onSubmit={enviar} className={GRID_FORM}>
                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-neutral-700">Empresa</label>
                                    <input
                                        className={FIELD}
                                        value={clienteEmpresa}
                                        onChange={(e) => setClienteEmpresa(e.target.value)}
                                        placeholder="ACME S.A."
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-neutral-700">Contacto</label>
                                    <input
                                        className={FIELD}
                                        value={contactoNombre}
                                        onChange={(e) => setContactoNombre(e.target.value)}
                                        placeholder="Nombre y apellidos"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-neutral-700">Email</label>
                                    <input
                                        className={FIELD}
                                        type="email"
                                        value={contactoEmail}
                                        onChange={(e) => setContactoEmail(e.target.value)}
                                        placeholder="nombre@empresa.com"
                                        required
                                    />
                                </div>
                                <div className="col-span-1 sm:col-span-2 md:col-span-3 xl:col-span-4">
                                    <button disabled={cargando} className={`${BTN} ${BTN_SOLID} w-full`}>
                                        {cargando ? "Enviando..." : "Enviar presupuesto al correo"}
                                    </button>
                                    <p className="mt-2 text-center text-xs text-neutral-500">
                                        Se enviarán dos correos: al cliente (PDF sin costes) y a la empresa (PDF con costes y PVP).
                                    </p>
                                </div>
                            </form>
                        </section>
                    </>
                )}

                <footer className="mt-10 border-top border-neutral-200 py-8 text-center text-sm text-neutral-500">
                    © {new Date().getFullYear()} Montajedeprefabricados.com · Todos los derechos reservados
                </footer>
            </main>
        </div>
    );
}
