import {notFound} from "next/navigation";
import Link from "next/link";
import {catalogProducts, getCatalogProduct} from "@/lib/catalog/products";
import {ProductAddButton} from "@/components/shop/product-add-button";

export function generateStaticParams() { return catalogProducts.map(({slug}) => ({slug})); }

export default function ProductPage({params}: {params: {slug: string}}) {
  const product = getCatalogProduct(params.slug);
  if (!product) notFound();
  return <main className="min-h-screen bg-neutral-950 text-white"><article className="mx-auto max-w-4xl px-5 py-12 md:py-20"><Link href="/tienda" className="text-sm font-bold text-yellow-400">← Volver al catálogo</Link><div className="mt-10 rounded-[2rem] border border-white/10 bg-neutral-900 p-7 md:p-12"><span className="text-sm font-bold text-yellow-300">{product.categoryLabel} · {product.reference}</span><h1 className="mt-4 text-4xl font-black md:text-6xl">{product.name}</h1><p className="mt-6 text-lg leading-8 text-neutral-300">{product.summary}</p>{product.safetyNote && <p className="mt-5 rounded-xl border border-orange-300/20 bg-orange-300/5 p-4 text-sm text-orange-100">{product.safetyNote}</p>}<dl className="mt-8 grid gap-4 border-y border-white/10 py-6 sm:grid-cols-2"><div><dt className="text-xs uppercase text-neutral-500">Unidad de solicitud</dt><dd className="mt-1 font-bold">{product.unit}</dd></div><div><dt className="text-xs uppercase text-neutral-500">Condición comercial</dt><dd className="mt-1 font-bold">Precio y disponibilidad bajo consulta</dd></div></dl><ProductAddButton product={product} /></div></article></main>;
}
