import Brand from "@/components/v21/Brand";
import ClassicAuth from "@/components/auth/ClassicAuth";
import "../acceso-administracion/access.css";
export const metadata = { title: "Crear cuenta" };
export default function Page() {
  return (
    <main className="admin-access-shell">
      <section className="access-brand">
        <Brand />
        <div>
          <small>NUEVA CUENTA</small>
          <h1>
            Todo tu trabajo,
            <br />
            <em>en un solo lugar.</em>
          </h1>
          <p>
            Crea tu acceso para guardar tus datos y consultar tus solicitudes.
          </p>
        </div>
      </section>
      <section className="access-form">
        <ClassicAuth mode="signup" />
      </section>
    </main>
  );
}
