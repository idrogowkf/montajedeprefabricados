import Brand from "@/components/v21/Brand";
import ClassicAuth from "@/components/auth/ClassicAuth";
import "../acceso-administracion/access.css";
export const metadata = { title: "Recuperar contraseña" };
export default function Page() {
  return (
    <main className="admin-access-shell">
      <section className="access-brand">
        <Brand />
        <div>
          <small>ACCESO SEGURO</small>
          <h1>
            Recupera
            <br />
            <em>tu cuenta.</em>
          </h1>
          <p>Te enviaremos un enlace seguro a tu correo.</p>
        </div>
      </section>
      <section className="access-form">
        <ClassicAuth mode="forgot" />
      </section>
    </main>
  );
}
