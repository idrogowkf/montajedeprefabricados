import {catalogProducts} from "@/data/catalog";
import {selectFeaturedStoreProducts} from "@/data/featured-store";

const products=selectFeaturedStoreProducts(catalogProducts);

export default function StoreDiscovery() {
  return <section className="store-discovery" id="compra-rapida"><div className="shell">
    <div className="store-discovery-head"><div><div className="kicker mono">Compra rápida · catálogo profesional</div><h2>LO QUE LA OBRA<br /><span>NECESITA HOY.</span></h2></div><div className="store-discovery-intro"><p>Productos identificados para montaje, seguridad, fijación y reparación. Las referencias configurables se cotizan según medida, carga y destino.</p><a href="/tienda">Ver catálogo completo →</a></div></div>
    <div className="discovery-grid">{products.map((product) => <article className="discovery-product" key={product.id}><a href={`/tienda#${product.id}`} aria-label={`Ver ${product.name}`}><div className="discovery-visual has-photo"><img src={product.imageUrl??product.imageUrls?.[0]} alt={product.name}/></div><div className="discovery-meta mono">{product.family} · {product.brand}</div><h3>{product.name}</h3><div className="discovery-price">{product.commercial.status==="ready"&&product.commercial.costVerified?<><strong>{product.price.toFixed(2).replace(".", ",")} €</strong><span>/{product.unit} · sin IVA</span></>:<strong>Solicitar oferta</strong>}</div><p>{product.delivery}</p></a></article>)}</div>
    <div className="technical-continuation"><span className="mono">Después de comprar</span><strong>Sigue explorando nuestra capacidad técnica</strong><a href="#capacidades">Servicios de montaje ↓</a></div>
  </div></section>;
}
