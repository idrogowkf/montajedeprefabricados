
# montajedeprefabricados — Next.js + Tailwind + API + IA + PDF

## Setup
1) Instala dependencias:
   ```bash
   npm i
   # o pnpm i / yarn
   ```
2) Crea `.env.local` desde `.env.example` y completa tus variables.
3) Ejecuta en local:
   ```bash
   npm run dev
   ```
4) Despliegue en Vercel: importa el repo, añade las variables de entorno y despliega.

## Endpoints
- POST `/api/prestudy` → valida el preestudio, genera referencia y envía las notificaciones.
- POST `/api/prestudy/upload` → autoriza cargas directas y limitadas a Vercel Blob.
- POST `/api/contact` → envía lead (Zapier hook si está configurado).
- POST `/api/calc` → Calculadora IA (heurística sin OpenAI, o IA si pones OPENAI_API_KEY).
- POST `/api/assist` → Chat técnico básico.
- POST `/api/pdf` → Genera PDF de propuesta.

## Variables del preestudio

- `RESEND_API_KEY`: clave de Resend.
- `MAIL_FROM`: remitente perteneciente a un dominio verificado.
- `MAIL_TO`: buzón que recibe los preestudios.
- `BLOB_READ_WRITE_TOKEN`: token de Vercel Blob para la documentación.

El formulario conserva los datos localmente mientras se avanza o retrocede. Los archivos se cargan directamente a Blob y el envío final contiene únicamente sus referencias.

## SEO
Edita `lib/seo.ts`, `lib/cities.ts` y crea páginas de ciudad/tipo.
