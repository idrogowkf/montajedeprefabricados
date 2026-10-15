"use client";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import FileUploader from "@/components/prestudy/FileUploader";
import type { PublicCatalogProduct } from "@/data/public-catalog";
import type {
  ProductInquiryKind,
  ProductInquiryInput,
} from "@/lib/product-inquiry";
import type { UploadedDocument } from "@/lib/prestudy";

type AccountState = {
  loading: boolean;
  complete: boolean;
  email: string;
  contactName: string;
  error: string;
};
export default function ProductInquiryPanel({
  kind,
  product,
  initialMessage = "",
  onClose,
}: {
  kind: ProductInquiryKind;
  product?: PublicCatalogProduct;
  initialMessage?: string;
  onClose: () => void;
}) {
  const { isLoaded, isSignedIn } = useUser();
  const [account, setAccount] = useState<AccountState>({
      loading: true,
      complete: false,
      email: "",
      contactName: "",
      error: "",
    }),
    [documents, setDocuments] = useState<UploadedDocument[]>([]),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [reference, setReference] = useState("");
  const title =
      kind === "datasheet"
        ? "Solicitar ficha técnica"
        : kind === "search"
          ? "Cuéntanos qué producto necesitas"
          : "Solicitar información y oferta",
    returnUrl = `/tienda${product ? `#${encodeURIComponent(product.id)}` : ""}`,
    profileUrl = `/mi-cuenta?seccion=perfil&completar=1&volver=${encodeURIComponent(returnUrl)}`;
  const preserve = () =>
    sessionStorage.setItem(
      "pending-product-inquiry",
      JSON.stringify({
        kind,
        productId: product?.id ?? "",
        message: initialMessage,
      }),
    );
  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      setAccount((current) => ({ ...current, loading: false }));
      return;
    }
    fetch("/api/account/profile")
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        setAccount({
          loading: false,
          complete: Boolean(data.completion?.complete),
          email: data.identity?.email ?? "",
          contactName:
            data.profile?.contactName ??
            [data.identity?.firstName, data.identity?.lastName]
              .filter(Boolean)
              .join(" "),
          error: "",
        });
      })
      .catch(() =>
        setAccount({
          loading: false,
          complete: false,
          email: "",
          contactName: "",
          error: "No hemos podido comprobar tu perfil.",
        }),
      );
  }, [isLoaded, isSignedIn]);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(event.currentTarget),
      body: ProductInquiryInput = {
        kind,
        productId: product?.id ?? "",
        productName: product?.name ?? "",
        message: String(form.get("message") ?? ""),
        documents,
        consent: form.get("consent") === "on",
        website: String(form.get("website") ?? ""),
      };
    try {
      const response = await fetch("/api/product-inquiries", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(body),
        }),
        result = await response.json();
      if (response.status === 409) {
        preserve();
        setAccount((current) => ({ ...current, complete: false }));
        throw new Error(result.error);
      }
      if (!response.ok)
        throw new Error(result.error || "No se pudo enviar la solicitud.");
      sessionStorage.removeItem("pending-product-inquiry");
      setReference(result.reference);
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "No se pudo enviar la solicitud.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <div
      className="overlay inquiry-overlay"
      role="presentation"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="inquiry-panel"
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <header>
          <span>SOLICITUD DE PRODUCTO</span>
          <h2>{title}</h2>
          <button className="close" onClick={onClose} aria-label="Cerrar">
            ×
          </button>
        </header>
        {reference ? (
          <div className="inquiry-success">
            <strong>Solicitud recibida</strong>
            <p>
              La hemos registrado con la referencia <b>{reference}</b>.
            </p>
            <a
              className="inquiry-submit inquiry-history"
              href="/mi-cuenta?seccion=solicitudes"
            >
              Ver mis solicitudes
            </a>
            <button onClick={onClose}>Cerrar</button>
          </div>
        ) : account.loading || !isLoaded ? (
          <div className="inquiry-auth-state">
            <strong>Comprobando tu cuenta…</strong>
          </div>
        ) : !isSignedIn ? (
          <div className="inquiry-auth-state">
            <strong>Inicia sesión para solicitar una oferta</strong>
            <p>Guardaremos el producto para que puedas continuar al volver.</p>
            <a
              href={`/iniciar-sesion?redirect_url=${encodeURIComponent(returnUrl)}`}
              onClick={preserve}
            >
              Iniciar sesión
            </a>
          </div>
        ) : !account.complete ? (
          <div className="inquiry-auth-state">
            <strong>Completa tu perfil</strong>
            <p>Necesitamos los datos fiscales y de contacto una sola vez.</p>
            {account.error && <p className="field-error">{account.error}</p>}
            <a href={profileUrl} onClick={preserve}>
              Completar perfil y continuar
            </a>
          </div>
        ) : (
          <form onSubmit={submit}>
            {product && (
              <div className="inquiry-product">
                <img src={product.imageUrl} alt="" />
                <div>
                  <small>
                    {product.sku} · {product.brand}
                  </small>
                  <strong>{product.name}</strong>
                </div>
              </div>
            )}
            <div className="inquiry-account-summary">
              <div>
                <small>Datos de tu cuenta</small>
                <strong>{account.contactName}</strong>
                <span>{account.email}</span>
              </div>
              <a href={profileUrl} onClick={preserve}>
                Editar datos
              </a>
            </div>
            <p>
              {kind === "search"
                ? "Indica la pieza, aplicación, medidas o carga. Puedes adjuntar una foto, plano o ficha de referencia."
                : "Indica cantidad, medida o capacidad necesaria y código postal de entrega."}
            </p>
            <label>
              Qué necesitas *
              <textarea
                name="message"
                required
                minLength={10}
                rows={5}
                defaultValue={initialMessage}
              />
            </label>
            <fieldset>
              <legend>Fotos, planos o documentos</legend>
              <FileUploader documents={documents} onChange={setDocuments} />
            </fieldset>
            <input
              className="hp"
              name="website"
              tabIndex={-1}
              autoComplete="off"
            />
            <label className="consent">
              <input type="checkbox" name="consent" required /> Autorizo el
              tratamiento de estos datos para atender esta solicitud.
            </label>
            {error && (
              <p className="field-error" role="alert">
                {error}
              </p>
            )}
            <button className="inquiry-submit" disabled={busy}>
              {busy ? "Enviando…" : "Enviar solicitud"}
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
