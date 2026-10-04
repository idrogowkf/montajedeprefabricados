import Link from "next/link";
import {RfqForm} from "@/components/shop/rfq-form";

export const metadata = {title: "Solicitar oferta | Montaje de Prefabricados", robots: {index: false, follow: false}};
export default function RfqPage() { return <main className="min-h-screen bg-neutral-950 pb-20 text-white"><section className="mx-auto max-w-6xl px-5 py-12"><Link href="/tienda" className="text-sm font-bold text-yellow-400">← Seguir viendo el catálogo</Link><h1 className="mt-6 text-4xl font-black md:text-6xl">Preparar solicitud</h1><p className="mb-10 mt-4 max-w-2xl text-neutral-300">Revisa las cantidades y dinos dónde necesitas el material. Recibirás un expediente, no un pedido.</p><RfqForm /></section></main>; }
