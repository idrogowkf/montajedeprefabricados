import Brand from "./Brand";

export default function Footer() {
  return <footer className="v21-footer"><div className="shell footer-grid"><Brand footer /><nav className="footer-links" aria-label="Servicios"><a href="/servicios/montaje-prefabricados">Montaje</a><a href="/servicios/ingenieria-de-montaje">Ingeniería</a><a href="/servicios/lifting-plan">Lifting plan</a><a href="/servicios/logistica-de-obra">Logística</a></nav><div className="footer-meta"><a href="mailto:ofertas@montajedeprefabricados.com">ofertas@montajedeprefabricados.com</a><br/><a href="tel:+34624473123">+34 624 473 123</a><br/>© 2026 Montaje Prefabricado</div></div></footer>;
}
