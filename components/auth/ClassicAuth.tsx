"use client";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";

type Mode = "signin" | "signup" | "forgot" | "reset";
function ClassicAuthForm({
  mode,
  admin = false,
}: {
  mode: Mode;
  admin?: boolean;
}) {
  const router = useRouter(),
    params = useSearchParams();
  const [name, setName] = useState(""),
    [email, setEmail] = useState(""),
    [password, setPassword] = useState(""),
    [confirmation, setConfirmation] = useState(""),
    [error, setError] = useState(""),
    [notice, setNotice] = useState(""),
    [busy, setBusy] = useState(false);
  const redirect =
    params.get("redirect_url") || (admin ? "/administracion" : "/mi-cuenta");
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setNotice("");
    if ((mode === "signup" || mode === "reset") && password !== confirmation) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    setBusy(true);
    try {
      if (mode === "signin") {
        const result = await authClient.signIn.email({
          email,
          password,
          callbackURL: redirect,
        });
        if (result.error)
          throw new Error(result.error.message || "No se pudo iniciar sesión.");
        router.push(redirect);
        router.refresh();
      }
      if (mode === "signup") {
        const result = await authClient.signUp.email({
          name,
          email,
          password,
          callbackURL: redirect,
        });
        if (result.error)
          throw new Error(
            result.error.message || "No se pudo crear la cuenta.",
          );
        setNotice(
          "Cuenta creada. Revisa tu correo para verificarla antes de acceder.",
        );
      }
      if (mode === "forgot") {
        const result = await authClient.requestPasswordReset({
          email,
          redirectTo: "/restablecer-contrasena",
        });
        if (result.error)
          throw new Error(
            result.error.message || "No se pudo enviar el correo.",
          );
        setNotice(
          "Si el correo está registrado, recibirás un enlace para crear una nueva contraseña.",
        );
      }
      if (mode === "reset") {
        const token = params.get("token");
        if (!token)
          throw new Error(
            "El enlace de recuperación no es válido o ha caducado.",
          );
        const result = await authClient.resetPassword({
          newPassword: password,
          token,
        });
        if (result.error)
          throw new Error(
            result.error.message || "No se pudo cambiar la contraseña.",
          );
        setNotice("Contraseña actualizada. Ya puedes iniciar sesión.");
      }
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "No se pudo completar la operación.",
      );
    } finally {
      setBusy(false);
    }
  }
  const title =
    mode === "signin"
      ? "Bienvenido"
      : mode === "signup"
        ? "Crea tu cuenta"
        : mode === "forgot"
          ? "Recupera tu contraseña"
          : "Crea una nueva contraseña";
  return (
    <form className="classic-auth-form" onSubmit={submit}>
      <h3>{title}</h3>
      {mode === "signup" && (
        <label>
          <span>Nombre y apellidos</span>
          <input
            required
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
      )}
      {mode !== "reset" && (
        <label>
          <span>Correo electrónico</span>
          <input
            required
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
      )}
      {mode !== "forgot" && (
        <label>
          <span>Contraseña</span>
          <input
            required
            minLength={10}
            type="password"
            autoComplete={
              mode === "signin" ? "current-password" : "new-password"
            }
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
      )}
      {(mode === "signup" || mode === "reset") && (
        <label>
          <span>Repite la contraseña</span>
          <input
            required
            minLength={10}
            type="password"
            autoComplete="new-password"
            value={confirmation}
            onChange={(e) => setConfirmation(e.target.value)}
          />
        </label>
      )}
      {error && (
        <p className="auth-error" role="alert">
          {error}
        </p>
      )}
      {notice && (
        <p className="auth-notice" role="status">
          {notice}
        </p>
      )}
      <button className="admin-auth-submit" disabled={busy}>
        {busy
          ? "Procesando…"
          : mode === "signin"
            ? "Iniciar sesión"
            : mode === "signup"
              ? "Crear cuenta"
              : mode === "forgot"
                ? "Enviar enlace"
                : "Guardar contraseña"}
      </button>
      <nav>
        {mode === "signin" && (
          <>
            <a href="/registro">Crear una cuenta</a>
            <a href="/recuperar-contrasena">He olvidado mi contraseña</a>
          </>
        )}
        {mode === "signup" && <a href="/iniciar-sesion">Ya tengo una cuenta</a>}
        {(mode === "forgot" || mode === "reset") && (
          <a href="/iniciar-sesion">Volver al acceso</a>
        )}
      </nav>
    </form>
  );
}

export default function ClassicAuth(props:{mode:Mode;admin?:boolean}){
  return <Suspense fallback={<p>Preparando acceso seguro…</p>}><ClassicAuthForm {...props}/></Suspense>;
}
