import Header from "./Header";

const quickCategories = [
  ["Protección", "/tienda?familia=epi"],
  ["Corte", "/tienda?familia=corte"],
  ["Fijación", "/tienda?familia=fijacion"],
  ["Elevación", "/tienda?familia=elevacion"],
] as const;

export default function Hero() {
  return <section className="mast hybrid-mast" id="inicio">
    <div className="mast-bg" aria-hidden="true"><div className="bg-shot a" /><div className="bg-shot b" /></div><div className="grain" /><Header />
    <div className="shell hybrid-gateway">
      <article className="gateway-panel gateway-technical">
        <div className="gateway-eyebrow mono"><span>01</span> Ingeniería y montaje</div>
        <h1>TENGO UN<br />MONTAJE QUE<br /><span className="red">RESOLVER.</span></h1>
        <p>Planificación, logística, izado y ejecución coordinados desde el plano hasta la posición final.</p>
        <div className="hero-actions"><a className="v21-btn redbtn" href="#preestudio">Estudiar mi montaje ↗</a><a className="gateway-text-link" href="#capacidades">Ver capacidad técnica →</a></div>
      </article>
      <article className="gateway-panel gateway-commerce">
        <div className="gateway-eyebrow mono"><span>02</span> Suministro profesional</div>
        <div className="gateway-shop-head"><p className="gateway-mode">TIENDA TÉCNICA</p><span className="gateway-demo">CATÁLOGO DEMO</span></div>
        <h2>NECESITO<br /><span>MATERIAL.</span></h2>
        <p>Encuentra consumibles, protección, fijación y útiles para obra prefabricada.</p>
        <form className="gateway-search" action="/tienda" method="get"><label className="sr-only" htmlFor="home-store-search">Buscar productos</label><input id="home-store-search" name="q" placeholder="¿Qué necesitas para la obra?" /><button type="submit" aria-label="Buscar en la tienda">Buscar →</button></form>
        <div className="gateway-chips" aria-label="Categorías rápidas">{quickCategories.map(([category,href]) => <a href={href} key={category}>{category}</a>)}</div>
        <a className="v21-btn gateway-store-btn" href="/tienda">Entrar en la tienda <span>→</span></a>
      </article>
    </div>
    <a className="hybrid-scroll mono" href="#compra-rapida">Compra rápida + capacidad técnica <span>↓</span></a>
  </section>;
}
