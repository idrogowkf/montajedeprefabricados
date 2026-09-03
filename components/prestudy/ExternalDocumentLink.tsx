import type { PreStudyData } from "@/lib/prestudy";

export default function ExternalDocumentLink({ data, update, error }: { data: PreStudyData; update: (patch: Partial<PreStudyData>) => void; error?: string }) {
  return <div className="fields document-fields"><div className="field full"><label htmlFor="externalUrl">¿La documentación pesa demasiado? Pega un enlace.</label><input id="externalUrl" type="url" value={data.externalUrl} onChange={(event) => update({externalUrl:event.target.value})} placeholder="https://drive.google.com/..." aria-invalid={!!error} />{error && <span className="field-error" role="alert">{error}</span>}</div><div className="field full"><label htmlFor="documentNotes">Notas sobre la documentación</label><textarea id="documentNotes" value={data.documentNotes} onChange={(event) => update({documentNotes:event.target.value})} /></div></div>;
}
