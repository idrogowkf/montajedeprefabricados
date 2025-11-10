// app/(marketing)/tipos/cerramientos/page.tsx
export const dynamic = "force-static";
export const revalidate = false;

import Page, { generateMetadata as gm } from "../[tipo]/page";

// Heredamos metadatos del componente genérico
export const generateMetadata = () =>
    gm({ params: { tipo: "cerramientos" } } as any);

// Renderizamos el mismo contenido del genérico pero con params fijos
export default function CerramientosPage() {
    return <Page params={{ tipo: "cerramientos" }} />;
}
