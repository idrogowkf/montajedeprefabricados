import type { Metadata } from "next";
import SeoLandingPage from "@/components/v21/SeoLandingPage";
import { seoPageByPath } from "@/data/seo-pages";
import { createPageMetadata } from "@/lib/seo";

const page = seoPageByPath["/tipos/cerramientos"];
export const metadata: Metadata = createPageMetadata(page);
export default function Page() { return <SeoLandingPage page={page} />; }
