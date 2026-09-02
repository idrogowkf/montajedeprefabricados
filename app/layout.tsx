import "./globals.css";
import type {Metadata,Viewport} from "next";
import {Inter} from "next/font/google";
import {JsonLd} from "@/components/json-ld";
import {defaultMetadata,jsonLdOrganization,jsonLdService,jsonLdWebsite} from "@/lib/seo";
const inter=Inter({subsets:["latin"],display:"swap"});
export const metadata:Metadata=defaultMetadata;
export const viewport:Viewport={width:"device-width",initialScale:1,themeColor:"#0a0a0a",colorScheme:"dark"};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="es" className={inter.className}><body className="text-neutral-200"><JsonLd data={jsonLdOrganization()}/><JsonLd data={jsonLdWebsite()}/><JsonLd data={jsonLdService()}/>{children}</body></html>}
