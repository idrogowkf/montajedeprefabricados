"use client";

import { useRef, useState } from "react";
import { upload } from "@vercel/blob/client";
import { MAX_FILES, sanitizeFileName, validateFiles, type UploadedDocument } from "@/lib/prestudy";

export default function FileUploader({ documents, onChange }: { documents: UploadedDocument[]; onChange: (documents: UploadedDocument[]) => void }) {
  const input = useRef<HTMLInputElement>(null);
  const [dragging,setDragging] = useState(false);
  const [busy,setBusy] = useState(false);
  const [error,setError] = useState("");
  const add = async (selection: FileList | null) => {
    const files = Array.from(selection || []);
    if (documents.length + files.length > MAX_FILES) { setError(`Puedes adjuntar un máximo de ${MAX_FILES} archivos.`); return; }
    const validation = validateFiles(files);
    if (validation) { setError(validation); return; }
    setBusy(true); setError("");
    try {
      const uploaded = await Promise.all(files.map(async (file) => {
        const blob = await upload(sanitizeFileName(file.name),file,{access:"public",handleUploadUrl:"/api/prestudy/upload"});
        return {name:file.name,size:file.size,url:blob.url,pathname:blob.pathname};
      }));
      onChange([...documents,...uploaded]);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No se pudieron cargar los archivos.");
    } finally { setBusy(false); if (input.current) input.current.value = ""; }
  };
  return <><div className={`dropzone${dragging ? " drag" : ""}`} onDragEnter={(event) => {event.preventDefault();setDragging(true);}} onDragOver={(event) => event.preventDefault()} onDragLeave={() => setDragging(false)} onDrop={(event) => {event.preventDefault();setDragging(false);void add(event.dataTransfer.files);}}><input ref={input} id="project-files" type="file" multiple accept=".pdf,.xlsx,.xls,.csv,.jpg,.jpeg,.png,.webp,.zip,.dwg,.dxf" onChange={(event) => void add(event.target.files)} /><div className="dropicon" aria-hidden="true">↥</div><strong>{busy ? "Cargando documentación…" : "Arrastra planos y documentos aquí"}</strong><span>o selecciona archivos · máximo 10 archivos de 25 MB</span><button type="button" className="file-select" onClick={() => input.current?.click()} disabled={busy}>Seleccionar archivos</button></div><div className="file-list">{documents.map((document) => <div className="file-item" key={document.url}><b>{document.name}</b><span>{(document.size / 1024 / 1024).toFixed(1)} MB</span><button type="button" aria-label={`Eliminar ${document.name}`} onClick={() => onChange(documents.filter((item) => item.url !== document.url))}>Eliminar</button></div>)}</div>{error && <p className="field-error" role="alert">{error}</p>}</>;
}
