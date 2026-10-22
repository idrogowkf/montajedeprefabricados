import type { Metadata } from "next";
import { notFound } from "next/navigation";
import TechnicalServicePage from "@/components/v21/TechnicalServicePage";
import { serviceSeoPages, seoPageByPath } from "@/data/seo-pages";
import { createPageMetadata } from "@/lib/seo";

export const dynamicParams = false;
export function generateStaticParams(){return serviceSeoPages.map(({path})=>({slug:path.split("/").pop()!}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata> {
  const {slug}=await params;
  const service=seoPageByPath[`/servicios/${slug}`];
  return service ? createPageMetadata(service) : {};
}
export default async function Page({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const page=seoPageByPath[`/servicios/${slug}`];if(!page)notFound();return <TechnicalServicePage page={page}/>;}
