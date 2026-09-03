import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { ACCEPTED_EXTENSIONS, MAX_FILE_SIZE } from "@/lib/prestudy";

export async function POST(request: Request) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return Response.json({ error: "El servicio de documentación no está configurado." },{status:503});
  try {
    const body = await request.json() as HandleUploadBody;
    const response = await handleUpload({ request, body, onBeforeGenerateToken: async (pathname) => {
      const cleanName = pathname.split("/").pop()?.replace(/[^a-zA-Z0-9._-]/g,"-") || "documento";
      const extension = cleanName.split(".").pop()?.toLowerCase() || "";
      if (!ACCEPTED_EXTENSIONS.includes(extension)) throw new Error("Formato de archivo no permitido.");
      return { allowedContentTypes:["application/pdf","application/zip","application/x-zip-compressed","application/vnd.ms-excel","application/vnd.openxmlformats-officedocument.spreadsheetml.sheet","text/csv","image/jpeg","image/png","image/webp","application/octet-stream","image/vnd.dwg","application/acad"], maximumSizeInBytes:MAX_FILE_SIZE,addRandomSuffix:true,tokenPayload:cleanName };
    }});
    return Response.json(response);
  } catch (cause) {
    console.error("[/api/prestudy/upload]",cause);
    return Response.json({error:cause instanceof Error ? cause.message : "No se pudo autorizar la carga."},{status:400});
  }
}
