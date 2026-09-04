import Image from "next/image";
import Link from "next/link";

const projects = [
  { title: "Naves y estructuras prefabricadas", label: "Industrial · grandes luces", image: "/proyectos/industrial-nave-losa-alveolar-35t.webp", href: "/tipos/naves-industriales" },
  { title: "Puentes y viaductos", label: "Obra civil · izado", image: "/proyectos/civil-viaducto-viga-wt-80t.webp", href: "/tipos/puentes" },
  { title: "Paneles y fachadas", label: "Envolvente · cerramiento", image: "/proyectos/industrial-panel-fachada-22t.webp", href: "/tipos/fachadas" },
] as const;

function ProjectCard({ project, small = false }: { project: typeof projects[number]; small?: boolean }) {
  return <Link href={project.href} className={`project-card${small ? " small" : ""}`}><Image src={project.image} alt={project.title} fill sizes={small ? "(max-width: 820px) 100vw, 40vw" : "(max-width: 820px) 100vw, 58vw"} /><span className="project-copy"><small className="mono">{project.label}</small><h3>{project.title}</h3><span>Ver página técnica →</span></span></Link>;
}

export default function ProjectTypes() {
  return <section className="v21-section projects" id="proyectos"><div className="shell"><div className="section-head"><div><div className="kicker mono">05 — Tipologías</div><h2>Obras que<br />necesitan <span className="red">criterio.</span></h2></div><p>Tipologías donde la geometría, el peso, los accesos y la secuencia exigen estudiar el montaje antes de movilizar.</p></div><div className="project-grid"><ProjectCard project={projects[0]} /><div className="project-stack"><ProjectCard project={projects[1]} small /><ProjectCard project={projects[2]} small /></div></div></div></section>;
}
