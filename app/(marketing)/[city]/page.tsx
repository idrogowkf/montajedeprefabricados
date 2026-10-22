import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SeoLandingPage from "@/components/v21/SeoLandingPage";
import { citySeoPages, seoPageByPath } from "@/data/seo-pages";
import { createPageMetadata } from "@/lib/seo";

export const dynamicParams = false;
export function generateStaticParams() { return citySeoPages.map(({ path }) => ({ city: path.slice(1) })); }
export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const {city}=await params;
  const page = seoPageByPath[`/${city}`];
  return page ? createPageMetadata(page) : {};
}
export default async function CityPage({ params }: { params: Promise<{ city: string }> }) {
  const {city}=await params;
  const page = seoPageByPath[`/${city}`];
  if (!page) notFound();
  return <SeoLandingPage page={page} />;
}
