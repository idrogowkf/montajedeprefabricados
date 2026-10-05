"use client";

import {useMemo, useState} from "react";
import Brand from "@/components/v21/Brand";
import {catalogProducts, filterCatalog, isPublicationReady, type CatalogProduct} from "@/data/catalog";
import {SignInButton,SignedIn,SignedOut,UserButton} from "@clerk/nextjs";

const categories = [
  ["todos","Todos"],["altura","Altura y líneas de vida"],["hormigon","Hormigón"],
  ["acero","Acero"],["madera","Madera"],["pvc","PVC"],["sellado","Sellado y reparación"],["elevacion","Amarre y elevación"],
] as const;

export default function MarketplaceMockup({initialProducts=catalogProducts}:{initialProducts?:CatalogProduct[]}) {
  const [query,setQuery] = useState("");
  const [category,setCategory] = useState("todos");
  const [cart,setCart] = useState<Record<string,number>>({});
  const [selected,setSelected] = useState<CatalogProduct | null>(null);
  const [cartOpen,setCartOpen] = useState(false);
  const products = useMemo(()=>filterCatalog(initialProducts,query,category),[initialProducts,query,category]);
  const units = Object.values(cart).reduce((sum,value)=>sum+value,0);
  const subtotal = initialProducts.reduce((sum,product)=>sum+(cart[product.id] ?? 0)*product.price,0);
  const add = (product:CatalogProduct) => setCart((current)=>({...current,[product.id]:(current[product.id] ?? 0)+1}));
  return <div className="store-mock">
    <div className="demo-ribbon">CATÁLOGO EN PREPARACIÓN · PRECIOS CALCULADOS NO VINCULANTES · IVA NO INCLUIDO</div>
    <header className="commerce-head">
      <Brand />
      <form className="store-search" onSubmit={(event)=>event.preventDefault()}><label className="sr-only" htmlFor="store-search">Buscar productos</label><input id="store-search" value={query} onChange={(event)=>setQuery(event.target.value)} placeholder="Buscar herramientas, EPI, fijaciones…"/><button aria-label="Buscar">⌕</button></form>
      <nav className="commerce-actions" aria-label="Cuenta y carrito"><SignedOut><SignInButton mode="modal"><button><small>Hola, identifícate</small><strong>Cuenta y listas</strong></button></SignInButton></SignedOut><SignedIn><span className="account-control"><UserButton/><strong>Mi cuenta</strong></span></SignedIn><button><small>Seguimiento</small><strong>Mis solicitudes</strong></button><button className="cart-trigger" onClick={()=>setCartOpen(true)}><span>{units}</span><strong>Carrito</strong></button></nav>
    </header>
    <nav className="category-bar" aria-label="Categorías de producto">{categories.map(([value,label])=><button key={value} className={category===value?"active":""} onClick={()=>setCategory(value)}>{label}</button>)}<a href="/#preestudio">Necesito ayuda técnica</a></nav>

    <main>
      <section className="store-hero"><div><span className="eyebrow">SUMINISTROS PARA MONTAJE PREFABRICADO</span><h1>Compra rápida.<br/><em>Criterio técnico.</em></h1><p>Material habitual de obra y productos configurables con asistencia especializada cuando la referencia exige comprobar carga, medida o compatibilidad.</p><div className="hero-pills"><span>Envío a obra</span><span>Documentación técnica</span><span>Oferta profesional</span></div></div><aside><span>¿No sabes qué referencia necesitas?</span><strong>Descríbenos la aplicación y la buscamos contigo.</strong><a href="/#preestudio">Solicitar selección técnica</a></aside></section>

      <section className="quick-categories" aria-label="Accesos rápidos"><CategoryTile code="01" title="Altura y líneas de vida" note="Arneses, postes y sistemas" onClick={()=>setCategory("altura")}/><CategoryTile code="02" title="Hormigón" note="Corte, anclaje y reparación" onClick={()=>setCategory("hormigon")}/><CategoryTile code="03" title="Acero" note="Abrasivos, soldadura y protección" onClick={()=>setCategory("acero")}/><CategoryTile code="04" title="Madera y PVC" note="Fijación, corte y adhesión" onClick={()=>setCategory("madera")}/></section>

      <section className="catalog-shell"><aside className="filters"><strong>Filtrar resultados</strong><Filter title="Entrega"><label><input type="checkbox"/> Disponible 24–48 h</label><label><input type="checkbox"/> Configurable</label></Filter><Filter title="Precio demo"><label><input type="checkbox"/> Hasta 10 €</label><label><input type="checkbox"/> 10–30 €</label><label><input type="checkbox"/> Más de 30 €</label></Filter><Filter title="Uso"><label><input type="checkbox"/> Consumo frecuente</label><label><input type="checkbox"/> Seguridad</label></Filter></aside>
        <div className="results"><div className="results-head"><div><span>{products.length} resultados</span><h2>{category==="todos"?"Productos para trabajar sin esperas":categories.find(([value])=>value===category)?.[1]}</h2></div><select aria-label="Ordenar resultados"><option>Más relevantes</option><option>Precio: menor a mayor</option><option>Mejor valorados</option></select></div><div className="product-grid">{products.map((product)=><ProductCard key={product.id} product={product} onAdd={()=>add(product)} onOpen={()=>setSelected(product)}/>)}</div>{!products.length&&<div className="empty-state"><strong>No encontramos coincidencias</strong><span>Prueba otra búsqueda o solicita ayuda técnica.</span></div>}</div>
      </section>
    </main>
    <nav className="mobile-dock" aria-label="Navegación móvil"><button onClick={()=>setCategory("todos")}>⌂<span>Inicio</span></button><button onClick={()=>document.getElementById("store-search")?.focus()}>⌕<span>Buscar</span></button><button>◎<span>Cuenta</span></button><button onClick={()=>setCartOpen(true)} className="dock-cart">▣<b>{units}</b><span>Carrito</span></button></nav>
    {selected&&<ProductPanel product={selected} onClose={()=>setSelected(null)} onAdd={()=>{add(selected);setSelected(null);}}/>}
    {cartOpen&&<CartPanel products={initialProducts} cart={cart} subtotal={subtotal} onClose={()=>setCartOpen(false)} onChange={(id,amount)=>setCart((current)=>({...current,[id]:Math.max(0,amount)}))}/>} 
  </div>;
}

function CategoryTile({code,title,note,onClick}:{code:string;title:string;note:string;onClick:()=>void}){return <button className="category-tile" onClick={onClick}><span>{code}</span><strong>{title}</strong><small>{note}</small></button>}
function Filter({title,children}:{title:string;children:React.ReactNode}){return <fieldset><legend>{title}</legend>{children}</fieldset>}
function ProductVisual({product}:{product:CatalogProduct}){return <div className={`product-visual ${product.imageUrl?"has-photo":""}`} style={{"--accent":product.accent} as React.CSSProperties}>{product.imageUrl?<img src={product.imageUrl} alt={product.name}/>:<><span>{product.initials}</span><small>FOTO EN BÚSQUEDA</small></>}</div>}
function ProductCard({product,onAdd,onOpen}:{product:CatalogProduct;onAdd:()=>void;onOpen:()=>void}){const ready=isPublicationReady(product);return <article className="product-card"><button className="visual-button" onClick={onOpen} aria-label={`Ver ${product.name}`}><ProductVisual product={product}/></button><div className="product-info">{product.badge&&<span className="product-badge">{product.badge}</span>}<small className="brand-line">{product.brand} · {product.family}</small><button className="product-name" onClick={onOpen}>{product.name}</button><div className="rating" aria-label="Estado de auditoría">{ready?(product.rotation==="alta"?"ROTACIÓN ALTA":"SELECCIÓN TÉCNICA"):"FICHA EN AUDITORÍA"}</div><div className="price-line">{ready?<><strong>{product.price.toFixed(2).replace(".",",")} €</strong><small>/ {product.unit} · sin IVA</small></>:<strong>Precio pendiente</strong>}</div><span className="availability">{ready?product.availability:"No disponible para compra"}</span><button className="add-button" onClick={ready?onAdd:onOpen}>{ready?"Añadir al carrito":"Ver estado de la ficha"}</button></div></article>}
function ProductPanel({product,onClose}:{product:CatalogProduct;onClose:()=>void;onAdd:()=>void}){return <div className="overlay" role="presentation" onMouseDown={onClose}><section className="product-panel" role="dialog" aria-modal="true" aria-label={product.name} onMouseDown={(event)=>event.stopPropagation()}><button className="close" onClick={onClose}>×</button><ProductVisual product={product}/><div><small>{product.brand} · {product.family} · {product.supplier.reference}</small><h2>{product.name}</h2><p>Ficha en auditoría. La referencia no se publicará para compra hasta validar imágenes, documentación técnica, proveedor, disponibilidad y precio de venta.</p><ul>{product.certifications.map(item=><li key={item}>{item}</li>)}<li>Uso auditado: {product.segments.join(" · ")}</li></ul>{product.datasheetUrl&&<a href={product.datasheetUrl} target="_blank" rel="noreferrer">Descargar ficha técnica ↗</a>}<div className="buy-box"><strong>Precio pendiente de aprobación</strong><span>No disponible para compra todavía</span><button onClick={onClose}>Solicitar información</button></div></div></section></div>}
function CartPanel({products,cart,subtotal,onClose,onChange}:{products:CatalogProduct[];cart:Record<string,number>;subtotal:number;onClose:()=>void;onChange:(id:string,amount:number)=>void}){const lines=products.filter((product)=>cart[product.id]>0);return <div className="overlay cart-overlay" role="presentation" onMouseDown={onClose}><aside className="cart-panel" role="dialog" aria-modal="true" aria-label="Carrito" onMouseDown={(event)=>event.stopPropagation()}><button className="close" onClick={onClose}>×</button><span className="eyebrow">TU SELECCIÓN</span><h2>Carrito</h2>{lines.length? <><div className="cart-lines">{lines.map((product)=><div className="cart-line" key={product.id}><ProductVisual product={product}/><div><strong>{product.name}</strong><small>{product.price.toFixed(2).replace(".",",")} € / {product.unit}</small><div><button onClick={()=>onChange(product.id,cart[product.id]-1)}>−</button><span>{cart[product.id]}</span><button onClick={()=>onChange(product.id,cart[product.id]+1)}>+</button></div></div></div>)}</div><div className="subtotal"><span>Subtotal sin IVA</span><strong>{subtotal.toFixed(2).replace(".",",")} €</strong></div><button className="checkout-demo">Solicitar oferta</button><p>No se realizará ningún pago. Confirmaremos referencias, stock y transporte antes de emitir una oferta vinculante.</p></>:<div className="empty-cart"><strong>Tu carrito está vacío</strong><span>Añade productos para probar el recorrido.</span></div>}</aside></div>}
