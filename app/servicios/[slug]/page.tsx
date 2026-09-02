import { notFound } from "next/navigation";
import { TechnicalPage } from "@/components/technical-page";
import { getTechnicalPage, technicalPages } from "@/lib/content/technical-pages";
import { buildMetadata } from "@/lib/seo";
export function generateStaticParams(){return technicalPages.filter(page=>page.category==="servicios").map(page=>({slug:page.slug}))}
export function generateMetadata({params}:{params:{slug:string}}){const page=getTechnicalPage("servicios",params.slug);return page?buildMetadata({title:page.title,description:page.description,path:`/servicios/${page.slug}`}):{}}
export default function Page({params}:{params:{slug:string}}){const page=getTechnicalPage("servicios",params.slug);if(!page)notFound();return <TechnicalPage page={page}/>}
