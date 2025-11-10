
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
- POST `/api/calc` → Calculadora IA (heurística sin OpenAI, o IA si pones OPENAI_API_KEY).
- POST `/api/assist` → Chat técnico básico.
- POST `/api/pdf` → Genera PDF de propuesta.

## SEO
Edita `lib/seo.ts`, `lib/cities.ts` y crea páginas de ciudad/tipo.
