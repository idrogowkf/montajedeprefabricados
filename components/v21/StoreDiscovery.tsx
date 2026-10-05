import { catalogProducts } from "@/data/catalog";
import type { CSSProperties } from "react";

const featuredIds=["arnes-anticaidas","linea-vida-temporal","disco-diamante-230","anclaje-quimico"];
const products = featuredIds.map(id=>catalogProducts.find(product=>product.id===id)).filter((product):product is NonNullable<typeof product>=>Boolean(product));

export default function StoreDiscovery() {
  return <section className="store-discovery" id="compra-rapida"><div className="shell">
    <div className="store-discovery-head"><div><div className="kicker mono">Compra rápida · catálogo provisional</div><h2>LO QUE LA OBRA<br /><span>NECESITA HOY.</span></h2></div><div className="store-discovery-intro"><p>Acceso directo a material de rotación frecuente. Este prototipo usa productos y precios demostrativos hasta conectar proveedores reales.</p><a href="/tienda">Ver catálogo completo →</a></div></div>
    <div className="discovery-grid">{products.map((product) => <article className="discovery-product" key={product.id}><a href={`/tienda#${product.id}`} aria-label={`Ver ${product.name}`}><div className="discovery-visual" style={{"--product-accent": product.accent} as CSSProperties}><span>{product.initials}</span><small>IMAGEN PROVISIONAL</small></div><div className="discovery-meta mono">{product.family} · {product.brand}</div><h3>{product.name}</h3><div className="discovery-price"><strong>{product.price.toFixed(2).replace(".", ",")} €</strong><span>/{product.unit} · sin IVA</span></div><p>{product.delivery}</p></a></article>)}</div>
    <div className="technical-continuation"><span className="mono">Después de comprar</span><strong>Sigue explorando nuestra capacidad técnica</strong><a href="#capacidades">Servicios de montaje ↓</a></div>
  </div></section>;
}
