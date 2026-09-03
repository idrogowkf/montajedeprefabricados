import type { PreStudyData } from "@/lib/prestudy";
import ExternalDocumentLink from "./ExternalDocumentLink";
import FileUploader from "./FileUploader";

export default function DocumentsStep({ data, update, error }: { data: PreStudyData; update: (patch: Partial<PreStudyData>) => void; error?: string }) {
  return <div><h3>LOS PLANOS HABLAN MEJOR QUE 20 CAMPOS.</h3><p className="sub">Adjunta documentación o pega un enlace a cualquier repositorio accesible.</p><FileUploader documents={data.documents} onChange={(documents) => update({documents})} /><ExternalDocumentLink data={data} update={update} error={error} /></div>;
}
