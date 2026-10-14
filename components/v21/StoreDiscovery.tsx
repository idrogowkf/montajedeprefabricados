import {catalogProducts} from "@/data/catalog";
import {selectFeaturedStoreProducts} from "@/data/featured-store";
import {getCatalog} from "@/lib/catalog-db";

export default async function StoreDiscovery() {
  let catalog=catalogProducts;
  try{catalog=await getCatalog();}catch{}
  const products=selectFeaturedStoreProducts(catalog);
  return <section className="store-discovery" id="compra-rapida"><div className="shell">
    <div className="store-discovery-head"><div><div className="kicker mono">Tienda profesional · catálogo técnico</div><h2>MANIPULA Y MONTA.<br /><span>CON SEGURIDAD.</span></h2></div><div className="store-discovery-intro"><p>Elevación, anclajes, perforación y protección identificados por aplicación. Busca directamente o utiliza el selector si todavía no conoces la referencia.</p><div className="store-discovery-actions"><a href="/tienda">Ver catálogo completo →</a><a href="/tienda?ayuda=1">Ayúdame a elegir →</a></div></div></div>
    <div className="discovery-grid">{products.map((product) => <article className="discovery-product" key={product.id}><a href={`/tienda#${product.id}`} aria-label={`Ver ${product.name}`}><div className="discovery-visual has-photo"><span aria-hidden="true">{product.initials}</span>{(product.imageUrl??product.imageUrls?.[0])&&<img src={product.imageUrl??product.imageUrls?.[0]} alt={product.name}/>}</div><div className="discovery-meta mono">{product.family} · {product.brand}</div><h3>{product.name}</h3><div className="discovery-price">{product.commercial.status==="ready"&&product.commercial.costVerified?<><strong>{product.price.toFixed(2).replace(".", ",")} €</strong><span>/{product.unit} · sin IVA</span></>:<strong>Solicitar oferta</strong>}</div><p>{product.delivery}</p></a></article>)}</div>
    <div className="technical-continuation"><span className="mono">Después de comprar</span><strong>Sigue explorando nuestra capacidad técnica</strong><a href="#capacidades">Servicios de montaje ↓</a></div>
  </div></section>;
}
