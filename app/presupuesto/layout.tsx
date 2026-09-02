import type {Metadata} from "next";import {JsonLd} from "@/components/json-ld";import {buildMetadata,jsonLdBreadcrumbs} from "@/lib/seo";
export const metadata:Metadata=buildMetadata({title:"Presupuesto técnico de montaje",description:"Calcula una estimación orientativa y solicita el estudio técnico de tu montaje de prefabricados.",path:"/presupuesto"});
export default function Layout({children}:{children:React.ReactNode}){return <><JsonLd data={jsonLdBreadcrumbs([{name:"Inicio",path:"/"},{name:"Presupuesto",path:"/presupuesto"}])}/>{children}</>}
