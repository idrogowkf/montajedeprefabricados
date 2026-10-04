import {notFound} from "next/navigation";
import Link from "next/link";
import {CatalogBrowser} from "@/components/shop/catalog-browser";
import {catalogProducts} from "@/lib/catalog/products";
import {catalogCategories} from "@/lib/catalog/types";

export function generateStaticParams() { return catalogCategories.map((categoria) => ({categoria})); }

export default function CategoryPage({params}: {params: {categoria: string}}) {
  if (!catalogCategories.includes(params.categoria as never)) notFound();
  const products = catalogProducts.filter((product) => product.category === params.categoria);
  return <main className="min-h-screen bg-neutral-950 pb-32 text-white"><section className="mx-auto max-w-7xl px-5 py-12"><Link href="/tienda" className="text-sm font-bold text-yellow-400">← Todo el catálogo</Link><h1 className="mb-8 mt-6 text-4xl font-black">{products[0]?.categoryLabel}</h1><CatalogBrowser products={products} initialCategory={params.categoria} /></section></main>;
}
