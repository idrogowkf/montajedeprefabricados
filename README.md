
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
- POST `/api/contact` → envía lead (Zapier hook si está configurado).
- POST `/api/solicitudes` → valida y registra una solicitud B2B; el correo se envía después del guardado.
- POST `/api/metricas` → registra eventos anónimos del embudo de catálogo.
- POST `/api/calc` → Calculadora IA (heurística sin OpenAI, o IA si pones OPENAI_API_KEY).
- POST `/api/assist` → Chat técnico básico.
- POST `/api/pdf` → Genera PDF de propuesta.

## SEO
Edita `lib/seo.ts`, `lib/cities.ts` y crea páginas de ciudad/tipo.

## Catálogo y centro de operaciones

- `/tienda` contiene 48 referencias piloto sin precios ni afirmaciones técnicas no verificadas.
- `/solicitar-oferta` prepara solicitudes no vinculantes.
- `/administracion` requiere `ADMIN_ACCESS_TOKEN` y muestra los expedientes guardados.

Para activar la operación real, crea un proyecto Supabase, ejecuta `supabase/migrations/202610050001_catalog_rfq.sql` y configura en Vercel `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY`. Verifica el dominio en Resend y añade `RESEND_API_KEY`, `MAIL_FROM` y `MAIL_TO`. Hasta entonces, el catálogo funciona pero el formulario informa claramente que el registro de solicitudes está pendiente de activar.
