// app/(marketing)/tipos/fachadas/page.tsx
export const dynamic = "force-static";
export const revalidate = false;

import Page, { generateMetadata as gm } from "../[tipo]/page";

export const generateMetadata = () =>
    gm({ params: { tipo: "fachadas" } } as any);

export default function FachadasPage() {
    return <Page params={{ tipo: "fachadas" }} />;
}
