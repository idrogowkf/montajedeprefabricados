import type {Metadata} from "next";
import Landing from "@/components/landing";
import {JsonLd} from "@/components/json-ld";
import {homeFaq} from "@/lib/content/faq";
import {buildMetadata,jsonLdFaq,jsonLdService} from "@/lib/seo";
export const metadata:Metadata=buildMetadata({title:"Montaje de prefabricados en España",description:"Ingeniería, planificación y ejecución de montaje de prefabricados, estructuras, paneles, puentes, viaductos y naves en España.",path:"/"});
export default function Page(){return <><JsonLd data={jsonLdService()}/><JsonLd data={jsonLdFaq(homeFaq.map(item=>({...item})))}/><Landing/></>}
