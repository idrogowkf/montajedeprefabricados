"use client";

import { usePathname } from "next/navigation";
import { prestudyTarget, whatsappUrl } from "@/lib/floating-actions";

export default function FloatingContactActions() {
  const pathname=usePathname();
  const target=prestudyTarget(pathname);
  const goToStudy=(event:React.MouseEvent<HTMLAnchorElement>)=>{if(pathname!=="/")return;event.preventDefault();document.querySelector("#preestudio")?.scrollIntoView({behavior:"smooth",block:"start"});};
  return <nav className="floating-contact-actions" aria-label="Contacto directo"><a className="floating-study" href={target} onClick={goToStudy}>Solicitar preestudio</a><a className="floating-whatsapp" href={whatsappUrl} target="_blank" rel="noreferrer" aria-label="Consultar por WhatsApp"><span aria-hidden="true">WA</span><b>WhatsApp</b></a></nav>;
}
