import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { technicalPages, type TechnicalPage as PageData } from "@/lib/content/technical-pages";
import { jsonLdBreadcrumbs, site } from "@/lib/seo";

const labels = new Map(technicalPages.map(page => [`/${page.category}/${page.slug}`, page.title]));

export function TechnicalPage({page}:{page:PageData}) {
  const path=`/${page.category}/${page.slug}`;
  const pageUrl=new URL(path,site.url).toString();
  const schema=page.category==="servicios"
    ? {"@context":"https://schema.org","@type":"Service",name:page.title,serviceType:page.title,description:page.description,url:pageUrl,areaServed:{"@type":"Country",name:"España"},provider:{"@type":"Organization",name:site.name,url:site.url}}
    : {"@context":"https://schema.org","@type":"TechArticle",headline:page.title,name:page.title,description:page.description,url:pageUrl,inLanguage:"es-ES"};
  return <main className="mx-auto max-w-5xl px-6 py-14">
    <JsonLd data={jsonLdBreadcrumbs([{name:"Inicio",path:"/"},{name:page.category==="servicios"?"Servicios":"Ingeniería",path:`/${page.category}`},{name:page.title,path}])}/>
    <JsonLd data={schema}/>
    <nav aria-label="Migas de pan" className="text-sm text-neutral-400"><Link href="/">Inicio</Link> <span aria-hidden="true">/</span> <Link href={`/${page.category}`}>{page.category==="servicios"?"Servicios":"Ingeniería"}</Link> <span aria-hidden="true">/</span> <span>{page.title}</span></nav>
    <header className="mt-8 max-w-4xl"><h1 className="text-4xl font-extrabold text-neutral-100 sm:text-5xl">{page.title}</h1><p className="mt-5 text-lg text-neutral-300">{page.description}</p></header>
    <div className="mt-12 space-y-10">{page.sections.map(section=><section key={section.title}><h2 className="text-2xl font-bold text-neutral-100">{section.title}</h2><p className="mt-3 leading-7 text-neutral-300">{section.text}</p></section>)}</div>
    <section className="mt-12 rounded-2xl border border-neutral-800 bg-neutral-900 p-6"><h2 className="text-2xl font-bold text-neutral-100">Datos mínimos para una primera revisión</h2><ul className="mt-4 grid gap-3 text-neutral-300 sm:grid-cols-2">{page.checklist.map(item=><li key={item}>• {item}</li>)}</ul></section>
    <aside className="mt-12 border-t border-neutral-800 pt-8"><h2 className="text-xl font-bold text-neutral-100">Continuar la consulta</h2><div className="mt-4 flex flex-wrap gap-3">{page.related.map(href=><Link key={href} href={href} className="rounded-xl border border-neutral-700 px-4 py-2 hover:border-yellow-400">{labels.get(href)}</Link>)}</div></aside>
  </main>;
}
