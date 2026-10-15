import Brand from "@/components/v21/Brand";
import ClassicAuth from "@/components/auth/ClassicAuth";
import "../../acceso-administracion/access.css";
export const metadata = {
  title: "Activar cuenta administrativa",
  robots: { index: false, follow: false },
};
export default function Page() {
  return (
    <main className="admin-access-shell">
      <section className="access-brand">
        <Brand />
        <div>
          <small>ACTIVACIÓN PRIVADA</small>
          <h1>
            Crea tu clave
            <br />
            <em>administrativa.</em>
          </h1>
          <p>
            Registra el correo autorizado y establece tu contraseña privada.
          </p>
        </div>
      </section>
      <section className="access-form">
        <ClassicAuth mode="signup" admin />
      </section>
    </main>
  );
}
