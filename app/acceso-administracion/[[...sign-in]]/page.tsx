import type { Metadata } from "next";
import Brand from "@/components/v21/Brand";
import ClassicAuth from "@/components/auth/ClassicAuth";
import "../access.css";
export const metadata: Metadata = {
  title: "Acceso de administración",
  robots: { index: false, follow: false },
};
export default function Page() {
  return (
    <main className="admin-access-shell">
      <section className="access-brand">
        <Brand />
        <div>
          <small>ÁREA PRIVADA</small>
          <h1>
            Acceso de
            <br />
            <em>administración.</em>
          </h1>
          <p>
            Gestión del catálogo, precios, documentación técnica, proveedores y
            solicitudes comerciales.
          </p>
        </div>
        <ul>
          <li>Sesión protegida</li>
          <li>Acceso exclusivo del administrador</li>
          <li>Actividad comercial centralizada</li>
        </ul>
      </section>
      <section className="access-form">
        <div className="access-form-head">
          <span>IDENTIFICACIÓN SEGURA</span>
          <h2>Bienvenido</h2>
          <p>Accede con el correo administrativo y tu contraseña.</p>
        </div>
        <ClassicAuth mode="signin" admin />
        <div className="access-help">
          <a href="/">← Volver a la página principal</a>
        </div>
      </section>
    </main>
  );
}
