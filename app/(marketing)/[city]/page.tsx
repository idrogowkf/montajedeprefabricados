import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SeoLandingPage from "@/components/v21/SeoLandingPage";
import { citySeoPages, seoPageByPath } from "@/data/seo-pages";
import { createPageMetadata } from "@/lib/seo";

export const dynamicParams = false;
export function generateStaticParams() { return citySeoPages.map(({ path }) => ({ city: path.slice(1) })); }
export function generateMetadata({ params }: { params: { city: string } }): Metadata {
  const page = seoPageByPath[`/${params.city}`];
  return page ? createPageMetadata(page) : {};
}
export default function CityPage({ params }: { params: { city: string } }) {
  const page = seoPageByPath[`/${params.city}`];
  if (!page) notFound();
  return <SeoLandingPage page={page} />;
}
