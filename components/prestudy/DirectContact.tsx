"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

type ContactStatus = "idle" | "sending" | "sent" | "error";

export default function DirectContact() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<ContactStatus>("idle");
  const [message, setMessage] = useState("");
  const dialog = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setMessage("");
    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, origen: "preestudio-contacto-directo" }),
      });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || "No se pudo enviar el mensaje.");
      form.reset();
      setStatus("sent");
      setMessage("Mensaje enviado. Nuestro equipo contactará contigo.");
    } catch (cause) {
      setStatus("error");
      setMessage(cause instanceof Error ? cause.message : "No se pudo enviar el mensaje.");
    }
  }

  return (
    <>
      <div className="contact-card">
        <div className="kicker mono">CONTACTO DIRECTO</div>
        <h4>¿Prefieres hablar con nosotros?</h4>
        <p>Escríbenos, llámanos o abre el formulario sin salir de la página.</p>
        <button className="contact-open" type="button" onClick={() => { setStatus("idle"); setMessage(""); setOpen(true); }}>
          Contactar →
        </button>
        <div className="contact-links">
          <a href="mailto:ofertas@montajedeprefabricados.com">Enviar correo</a>
          <a href="tel:+34624473123">Llamar</a>
          <a href="https://wa.me/34624473123" target="_blank" rel="noreferrer">WhatsApp</a>
        </div>
      </div>

      {open && (
        <div className="contact-modal" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false); }}>
          <div className="contact-dialog" role="dialog" aria-modal="true" aria-labelledby="contact-title" tabIndex={-1} ref={dialog}>
            <button className="contact-close" type="button" aria-label="Cerrar formulario" onClick={() => setOpen(false)}>×</button>
            <div className="kicker mono">CONTACTO · MONTAJE PREFABRICADO</div>
            <h2 id="contact-title">Formulario de contacto</h2>
            <p>Cuéntanos qué necesitas. Los campos marcados son obligatorios.</p>
            <form className="direct-contact-form" onSubmit={submit}>
              <label>Nombre y apellidos *<input name="nombre" autoComplete="name" required /></label>
              <label>Empresa<input name="empresa" autoComplete="organization" /></label>
              <label>Correo electrónico *<input name="email" type="email" autoComplete="email" required /></label>
              <label>Teléfono<input name="telefono" type="tel" autoComplete="tel" /></label>
              <label className="full">¿Qué necesitas? *<textarea name="mensaje" rows={5} required /></label>
              <input className="honeypot" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
              <button className="v21-btn redbtn full" type="submit" disabled={status === "sending"}>
                {status === "sending" ? "Enviando…" : "Enviar consulta →"}
              </button>
              {message && <p className={`contact-feedback ${status}`} role={status === "error" ? "alert" : "status"}>{message}</p>}
            </form>
            <div className="contact-dialog-links">
              <a href="mailto:ofertas@montajedeprefabricados.com">ofertas@montajedeprefabricados.com</a>
              <a href="tel:+34624473123">+34 624 473 123</a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
