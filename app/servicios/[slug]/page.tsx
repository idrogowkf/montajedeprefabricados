import type { Metadata } from "next";
import { notFound } from "next/navigation";
import TechnicalServicePage from "@/components/v21/TechnicalServicePage";
import { serviceSeoPages, seoPageByPath } from "@/data/seo-pages";
import { createPageMetadata } from "@/lib/seo";

export const dynamicParams = false;
export function generateStaticParams(){return serviceSeoPages.map(({path})=>({slug:path.split("/").pop()!}));}
export function generateMetadata({params}:{params:{slug:string}}):Metadata {
  const service=seoPageByPath[`/servicios/${params.slug}`];
  return service ? createPageMetadata(service) : {};
}
export default function Page({params}:{params:{slug:string}}){const page=seoPageByPath[`/servicios/${params.slug}`];if(!page)notFound();return <TechnicalServicePage page={page}/>;}
