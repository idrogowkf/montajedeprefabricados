import {catalogProducts} from "@/data/catalog";
import {selectFeaturedStoreProducts} from "@/data/featured-store";
import {getCatalog} from "@/lib/catalog-db";

export default async function StoreDiscovery() {
  let catalog=catalogProducts;
  try{catalog=await getCatalog();}catch{}
  const products=selectFeaturedStoreProducts(catalog);
  return <section className="store-discovery" id="compra-rapida"><div className="shell">
    <div className="store-discovery-head"><div><div className="kicker mono">Elevación · catálogo profesional</div><h2>MANIPULA Y ELEVA.<br /><span>CON SEGURIDAD.</span></h2></div><div className="store-discovery-intro"><p>Pinzas, balancines, ganchos y útiles identificados para prefabricado. Cada referencia se cotiza según pieza, carga y destino.</p><a href="/tienda">Ver las 60 referencias →</a></div></div>
    <div className="discovery-grid">{products.map((product) => <article className="discovery-product" key={product.id}><a href={`/tienda#${product.id}`} aria-label={`Ver ${product.name}`}><div className="discovery-visual has-photo"><img src={product.imageUrl??product.imageUrls?.[0]} alt={product.name}/></div><div className="discovery-meta mono">{product.family} · {product.brand}</div><h3>{product.name}</h3><div className="discovery-price">{product.commercial.status==="ready"&&product.commercial.costVerified?<><strong>{product.price.toFixed(2).replace(".", ",")} €</strong><span>/{product.unit} · sin IVA</span></>:<strong>Solicitar oferta</strong>}</div><p>{product.delivery}</p></a></article>)}</div>
    <div className="technical-continuation"><span className="mono">Después de comprar</span><strong>Sigue explorando nuestra capacidad técnica</strong><a href="#capacidades">Servicios de montaje ↓</a></div>
  </div></section>;
}
