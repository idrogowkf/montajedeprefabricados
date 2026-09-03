import type { PreStudyData } from "@/lib/prestudy";

export default function SubmissionSummary({ data }: { data: PreStudyData }) {
  const rows = [["Proyecto",data.projectType],["Ubicación",data.location],["Piezas",data.pieces || "Sin confirmar"],["Necesidades",data.needs.join(", ") || "Por definir"],["Documentos",String(data.documents.length)],["Contacto",data.email || data.phone || "Pendiente"]];
  return <aside className="submission-summary" aria-label="Resumen del preestudio"><h4>Resumen antes de enviar</h4><dl>{rows.map(([label,value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></aside>;
}
