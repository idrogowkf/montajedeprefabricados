import Brand from "@/components/v21/Brand";
import ClassicAuth from "@/components/auth/ClassicAuth";
import "../../acceso-administracion/access.css";
export default function Page() {
  return (
    <main className="admin-access-shell">
      <section className="access-brand">
        <Brand />
        <div>
          <small>ÁREA DE CLIENTE</small>
          <h1>
            Tu cuenta,
            <br />
            <em>tus solicitudes.</em>
          </h1>
          <p>
            Accede para completar tus datos una sola vez, solicitar ofertas y
            consultar su estado.
          </p>
        </div>
        <ul>
          <li>Historial de solicitudes</li>
          <li>Datos protegidos</li>
          <li>Seguimiento comercial centralizado</li>
        </ul>
      </section>
      <section className="access-form">
        <div className="access-form-head">
          <span>ACCESO SEGURO</span>
          <h2>Bienvenido</h2>
          <p>Accede con tu correo y contraseña.</p>
        </div>
        <ClassicAuth mode="signin" />
        <div className="access-help">
          <a href="/tienda">← Volver a la tienda</a>
        </div>
      </section>
    </main>
  );
}
