import type {MetadataRoute} from "next";import {cities} from "@/lib/cities";import {site} from "@/lib/seo";
const types=["naves-industriales","puentes","viaductos","fachadas","cerramientos","otras-tipologias"];
const hubs=["servicios","ingenieria","tipologias","ciudades","guias","calculadoras","recursos","preguntas-frecuentes"];
export default function sitemap():MetadataRoute.Sitemap{return["/","/presupuesto",...hubs.map(hub=>`/${hub}`),...cities.map(city=>`/${city}`),...types.map(type=>`/tipos/${type}`)].map((path,index)=>({url:new URL(path,site.url).toString(),changeFrequency:index<2?"weekly":"monthly",priority:index===0?1:index===1?0.9:0.7}))}
