import Brand from "./Brand";

export default function Header() {
  return <header className="v21-header shell"><Brand /><nav className="v21-nav" aria-label="Navegación principal"><a href="#capacidades">Capacidades</a><a href="#metodo">Método</a><a href="#proyectos">Tipologías</a><a href="#centro-tecnico">Centro técnico</a><a className="nav-cta" href="#preestudio">Estudiar mi montaje →</a></nav><a className="mobile-menu" href="#preestudio" aria-label="Ir al preestudio">☰</a></header>;
}
