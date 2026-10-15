import Brand from "@/components/v21/Brand";
import ClassicAuth from "@/components/auth/ClassicAuth";
import "../acceso-administracion/access.css";
export const metadata = { title: "Nueva contraseña" };
export default function Page() {
  return (
    <main className="admin-access-shell">
      <section className="access-brand">
        <Brand />
        <div>
          <small>ACCESO SEGURO</small>
          <h1>
            Nueva
            <br />
            <em>contraseña.</em>
          </h1>
          <p>Elige una clave segura de al menos diez caracteres.</p>
        </div>
      </section>
      <section className="access-form">
        <ClassicAuth mode="reset" />
      </section>
    </main>
  );
}
