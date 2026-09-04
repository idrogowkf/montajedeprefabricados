import Header from "@/components/v21/Header";
import Footer from "@/components/v21/Footer";

export default function MarketingLayout({children}:{children:React.ReactNode}) {
  return <div className="v21-home marketing-layout"><div className="marketing-header"><Header/></div><nav className="shell marketing-back" aria-label="Navegación secundaria"><a href="/">← Volver a Inicio</a><a href="/#proyectos">Ver tipologías</a><a href="/#preestudio">Solicitar preestudio</a></nav>{children}<Footer/></div>;
}
