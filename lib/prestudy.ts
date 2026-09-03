export const PROJECT_TYPES = ["Nave industrial", "Puente / viaducto", "Paneles / fachada", "Estructura prefabricada", "Forjados", "Otro / no lo tengo claro"] as const;
export const NEEDS = ["Montaje", "Grúa", "Transporte", "Planificación técnica", "Equipo de montaje", "No lo tengo claro"] as const;
export const ACCEPTED_EXTENSIONS = ["pdf", "xls", "xlsx", "csv", "jpg", "jpeg", "png", "webp", "zip", "dwg", "dxf"];
export const MAX_FILES = 10;
export const MAX_FILE_SIZE = 25 * 1024 * 1024;

export type UploadedDocument = { name: string; size: number; url: string; pathname: string };
export type PreStudyData = {
  projectType: string; pieces: string; maxWeight: string; maxLength: string; placementHeight: string; pieceNotes: string;
  location: string; address: string; date: string; storageArea: string; access: string; constraints: string;
  needs: string[]; externalUrl: string; documentNotes: string; documents: UploadedDocument[];
  name: string; company: string; phone: string; email: string; message: string; website: string;
};

export const initialPreStudyData: PreStudyData = { projectType:"",pieces:"",maxWeight:"",maxLength:"",placementHeight:"",pieceNotes:"",location:"",address:"",date:"",storageArea:"No lo sé",access:"No lo sé",constraints:"",needs:[],externalUrl:"",documentNotes:"",documents:[],name:"",company:"",phone:"",email:"",message:"",website:"" };

export function validateStep(step: number, data: PreStudyData) {
  const errors: Record<string,string> = {};
  if (step === 1 && !data.projectType) errors.projectType = "Selecciona una tipología o la opción de ayuda.";
  if (step === 3 && !data.location.trim()) errors.location = "Indica una ubicación aproximada.";
  if (step === 5 && data.externalUrl && !/^https?:\/\//i.test(data.externalUrl)) errors.externalUrl = "Introduce una URL completa que empiece por http:// o https://.";
  if (step === 6) {
    if (!data.name.trim()) errors.name = "Indica tu nombre.";
    if (!data.email.trim() && !data.phone.trim()) errors.contact = "Indica un email o un teléfono.";
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = "Revisa el formato del email.";
  }
  return errors;
}

export function validateFiles(files: File[]) {
  if (files.length > MAX_FILES) return `Puedes adjuntar un máximo de ${MAX_FILES} archivos.`;
  for (const file of files) {
    const extension = file.name.split(".").pop()?.toLowerCase() || "";
    if (!ACCEPTED_EXTENSIONS.includes(extension)) return `El formato de ${file.name} no está permitido.`;
    if (file.size > MAX_FILE_SIZE) return `${file.name} supera el límite de 25 MB.`;
  }
  return "";
}

export function sanitizeText(value: unknown, max = 2000) {
  return String(value ?? "").replace(/[<>]/g, "").trim().slice(0,max);
}

export function sanitizeFileName(value: string) {
  const parts = value.trim().split(".");
  const extension = parts.length > 1 ? `.${parts.pop()?.toLowerCase()}` : "";
  const base = parts.join(".").replace(/[^a-zA-Z0-9_-]/g,"-").slice(0,100) || "documento";
  return `${base}${extension}`;
}
