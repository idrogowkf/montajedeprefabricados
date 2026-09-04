import type { Metadata } from "next";
import { notFound } from "next/navigation";
import TechnicalServicePage from "@/components/v21/TechnicalServicePage";
import { technicalServiceBySlug, technicalServices } from "@/data/technical-services";

export const dynamicParams = false;
export function generateStaticParams(){return technicalServices.map(({slug})=>({slug}));}
export function generateMetadata({params}:{params:{slug:string}}):Metadata {
  const service=technicalServiceBySlug[params.slug];
  if(!service)return {};
  return {title:service.title,description:service.description,alternates:{canonical:`/servicios/${service.slug}`},openGraph:{title:service.title,description:service.description,type:"website",images:[service.image]}};
}
export default function Page({params}:{params:{slug:string}}){const service=technicalServiceBySlug[params.slug];if(!service)notFound();return <TechnicalServicePage service={service}/>;}
