"use client";
import { useEffect, useRef, useState } from "react";
import {
  publicInquiryStatus,
  type CustomerProfileInput,
} from "@/lib/customer-account";

type Section = "resumen" | "solicitudes" | "perfil" | "privacidad";
type Inquiry = {
  reference: string;
  kind: string;
  productName: string;
  message: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  documents: Array<{ name: string; url: string }>;
};
const blank: CustomerProfileInput = {
  customerType: "individual",
  contactName: "",
  legalName: "",
  taxIdType: "nif",
  taxId: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  postalCode: "",
  city: "",
  province: "",
  countryCode: "ES",
  privacyAccepted: false,
};

export default function CustomerAccount() {
  const [section, setSection] = useState<Section>("resumen"),
    [profile, setProfile] = useState<CustomerProfileInput>(blank),
    [profileLoading, setProfileLoading] = useState(true),
    [profileError, setProfileError] = useState(""),
    [errors, setErrors] = useState<Record<string, string>>({}),
    [saved, setSaved] = useState("");
  const [inquiries, setInquiries] = useState<Inquiry[]>([]),
    [summary, setSummary] = useState({ total: 0, active: 0 }),
    [email, setEmail] = useState(""),
    [inquiriesLoading, setInquiriesLoading] = useState(true),
    [inquiriesError, setInquiriesError] = useState(""),
    [deletePhrase, setDeletePhrase] = useState(""),
    [deleting, setDeleting] = useState(false),
    [deleteError, setDeleteError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const load = () => {
    setProfileLoading(true);
    setInquiriesLoading(true);
    setProfileError("");
    setInquiriesError("");
    fetch("/api/account/overview")
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.error);
        setEmail(data.identity?.email ?? "");
        setProfile(
          data.profile
            ? { ...data.profile }
            : {
                ...blank,
                contactName: [data.identity?.firstName, data.identity?.lastName]
                  .filter(Boolean)
                  .join(" "),
              },
        );
        setInquiries(data.inquiries ?? []);
        setSummary(data.summary ?? { total: 0, active: 0 });
      })
      .catch(() => {
        setProfileError("No hemos podido cargar los datos de tu cuenta.");
        setInquiriesError("No hemos podido cargar tus solicitudes.");
      })
      .finally(() => {
        setProfileLoading(false);
        setInquiriesLoading(false);
      });
  };
  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get(
      "seccion",
    ) as Section | null;
    if (
      requested &&
      ["resumen", "solicitudes", "perfil", "privacidad"].includes(requested)
    )
      setSection(requested);
    load();
  }, []);
  const change = (field: keyof CustomerProfileInput, value: string | boolean) =>
    setProfile((current) => ({ ...current, [field]: value }));
  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrors({});
    setSaved("");
    const response = await fetch("/api/account/profile", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(profile),
      }),
      data = await response.json();
    if (!response.ok) {
      setErrors(data.errors ?? {});
      requestAnimationFrame(() =>
        formRef.current
          ?.querySelector<HTMLElement>("[aria-invalid='true']")
          ?.focus(),
      );
      return;
    }
    setProfile(data.profile);
    setSaved(
      data.linkedInquiries
        ? `Perfil guardado. Hemos incorporado ${data.linkedInquiries} solicitudes anteriores.`
        : "Perfil guardado correctamente.",
    );
    load();
    const back = new URLSearchParams(window.location.search).get("volver");
    if (back) window.location.assign(back);
  };
  return (
    <div className="account-shell">
      <aside className="account-nav">
        <span>ÁREA DE CLIENTE</span>
        <h1>Mi cuenta</h1>
        <button
          className="account-edit-profile"
          onClick={() => setSection("perfil")}
        >
          Completar o editar mi perfil
        </button>
        {(["resumen", "perfil", "solicitudes", "privacidad"] as Section[]).map(
          (item) => (
            <button
              key={item}
              className={section === item ? "active" : ""}
              onClick={() => setSection(item)}
            >
              {item === "resumen"
                ? "Resumen"
                : item === "solicitudes"
                  ? "Solicitudes"
                  : item === "perfil"
                    ? "Mi perfil"
                    : "Privacidad"}
            </button>
          ),
        )}
      </aside>
      <nav className="account-mobile-nav" aria-label="Secciones de mi cuenta">
        {(["resumen", "perfil", "solicitudes", "privacidad"] as Section[]).map(
          (item) => (
            <button key={item} onClick={() => setSection(item)}>
              {item === "perfil" ? "Mi perfil" : item}
            </button>
          ),
        )}
      </nav>
      <section className="account-content">
        {section === "resumen" && (
          <>
            <span className="eyebrow">RESUMEN</span>
            <h2>Tu actividad comercial</h2>
            <div className="account-stats">
              <article>
                <strong>{summary.total}</strong>
                <span>Solicitudes totales</span>
              </article>
              <article>
                <strong>{summary.active}</strong>
                <span>En curso</span>
              </article>
            </div>
            <button
              className="account-primary"
              onClick={() => setSection("solicitudes")}
            >
              Ver mis solicitudes
            </button>
            <button
              className="account-secondary"
              onClick={() => setSection("perfil")}
            >
              Completar o editar perfil
            </button>
          </>
        )}
        {section === "solicitudes" && (
          <>
            <span className="eyebrow">SEGUIMIENTO</span>
            <h2>Mis solicitudes</h2>
            {inquiriesLoading ? (
              <p>Cargando tus solicitudes…</p>
            ) : inquiriesError ? (
              <p className="account-error">{inquiriesError}</p>
            ) : !inquiries.length ? (
              <div className="account-empty">
                <strong>No tienes solicitudes todavía</strong>
                <a href="/tienda">Ir al catálogo</a>
              </div>
            ) : (
              <div className="account-inquiries">
                {inquiries.map((item) => (
                  <article key={item.reference}>
                    <header>
                      <b>{item.reference}</b>
                      <span>{publicInquiryStatus(item.status)}</span>
                    </header>
                    <h3>{item.productName}</h3>
                    <p>{item.message}</p>
                    <small>
                      {new Date(item.createdAt).toLocaleDateString("es-ES")}
                    </small>
                    {item.documents.map((file) => (
                      <a
                        key={file.url}
                        href={file.url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {file.name}
                      </a>
                    ))}
                  </article>
                ))}
              </div>
            )}
          </>
        )}
        {section === "perfil" && (
          <>
            <span className="eyebrow">DATOS DE CUENTA Y FACTURACIÓN</span>
            <h2>Mi perfil</h2>
            {profileLoading ? (
              <p>Cargando tu perfil…</p>
            ) : profileError ? (
              <p className="account-error">{profileError}</p>
            ) : (
              <form ref={formRef} onSubmit={save} className="account-form">
                <Field label="Correo electrónico verificado">
                  <input value={email} readOnly />
                </Field>
                <Field label="Tipo de cliente" error={errors.customerType}>
                  <select
                    value={profile.customerType}
                    onChange={(e) => change("customerType", e.target.value)}
                    aria-invalid={!!errors.customerType}
                  >
                    <option value="individual">Particular</option>
                    <option value="self_employed">Autónomo</option>
                    <option value="company">Empresa</option>
                  </select>
                </Field>
                <Field label="Nombre y apellidos" error={errors.contactName}>
                  <input
                    value={profile.contactName}
                    onChange={(e) => change("contactName", e.target.value)}
                    aria-invalid={!!errors.contactName}
                  />
                </Field>
                {profile.customerType === "company" && (
                  <Field label="Razón social" error={errors.legalName}>
                    <input
                      value={profile.legalName}
                      onChange={(e) => change("legalName", e.target.value)}
                      aria-invalid={!!errors.legalName}
                    />
                  </Field>
                )}
                <Field label="NIF / NIE" error={errors.taxId}>
                  <div className="split">
                    <select
                      value={profile.taxIdType}
                      onChange={(e) => change("taxIdType", e.target.value)}
                    >
                      <option value="nif">NIF</option>
                      <option value="nie">NIE</option>
                      <option value="company_nif">NIF de empresa</option>
                      <option value="eu_vat">IVA intracomunitario</option>
                      <option value="other">Otro</option>
                    </select>
                    <input
                      value={profile.taxId}
                      onChange={(e) => change("taxId", e.target.value)}
                      aria-invalid={!!errors.taxId}
                    />
                  </div>
                </Field>
                <Field label="Teléfono" error={errors.phone}>
                  <input
                    value={profile.phone}
                    onChange={(e) => change("phone", e.target.value)}
                    aria-invalid={!!errors.phone}
                  />
                </Field>
                <Field label="Dirección fiscal" error={errors.addressLine1}>
                  <input
                    value={profile.addressLine1}
                    onChange={(e) => change("addressLine1", e.target.value)}
                    aria-invalid={!!errors.addressLine1}
                  />
                </Field>
                <Field label="Dirección adicional">
                  <input
                    value={profile.addressLine2}
                    onChange={(e) => change("addressLine2", e.target.value)}
                  />
                </Field>
                <div className="split">
                  <Field label="Código postal" error={errors.postalCode}>
                    <input
                      value={profile.postalCode}
                      onChange={(e) => change("postalCode", e.target.value)}
                      aria-invalid={!!errors.postalCode}
                    />
                  </Field>
                  <Field label="Localidad" error={errors.city}>
                    <input
                      value={profile.city}
                      onChange={(e) => change("city", e.target.value)}
                      aria-invalid={!!errors.city}
                    />
                  </Field>
                </div>
                <div className="split">
                  <Field label="Provincia" error={errors.province}>
                    <input
                      value={profile.province}
                      onChange={(e) => change("province", e.target.value)}
                      aria-invalid={!!errors.province}
                    />
                  </Field>
                  <Field label="País">
                    <input
                      value={profile.countryCode}
                      maxLength={2}
                      onChange={(e) =>
                        change("countryCode", e.target.value.toUpperCase())
                      }
                    />
                  </Field>
                </div>
                <label className="account-consent">
                  <input
                    type="checkbox"
                    checked={profile.privacyAccepted}
                    onChange={(e) =>
                      change("privacyAccepted", e.target.checked)
                    }
                  />
                  Acepto el tratamiento de estos datos para gestionar
                  solicitudes, ofertas y facturación.
                </label>
                {errors.privacyAccepted && (
                  <small className="field-error">
                    {errors.privacyAccepted}
                  </small>
                )}
                <button className="account-primary" type="submit">
                  Guardar perfil
                </button>
                <a className="account-secondary" href="/recuperar-contrasena">
                  Cambiar mi contraseña
                </a>
                {saved && <p className="account-success">{saved}</p>}
              </form>
            )}
          </>
        )}
        {section === "privacidad" && (
          <>
            <span className="eyebrow">CONTROL DE DATOS</span>
            <h2>Privacidad</h2>
            <p>
              Eliminar la cuenta anonimiza tus datos de contacto y tus
              solicitudes. Los documentos que deban conservarse por obligaciones
              fiscales o mercantiles seguirán sujetos a sus plazos legales.
            </p>
            <label className="account-field">
              <span>Escribe ELIMINAR MI CUENTA para confirmar</span>
              <input
                value={deletePhrase}
                onChange={(event) => setDeletePhrase(event.target.value)}
              />
            </label>
            {deleteError && <p className="account-error">{deleteError}</p>}
            <button
              className="account-danger"
              disabled={deleting || deletePhrase !== "ELIMINAR MI CUENTA"}
              onClick={async () => {
                setDeleting(true);
                setDeleteError("");
                try {
                  const response = await fetch("/api/account", {
                      method: "DELETE",
                      headers: { "content-type": "application/json" },
                      body: JSON.stringify({ confirmation: deletePhrase }),
                    }),
                    data = await response.json();
                  if (!response.ok) throw new Error(data.error);
                  window.location.assign("/");
                } catch (error) {
                  setDeleteError(
                    error instanceof Error
                      ? error.message
                      : "No se pudo eliminar la cuenta.",
                  );
                  setDeleting(false);
                }
              }}
            >
              {deleting ? "Eliminando…" : "Eliminar mi cuenta"}
            </button>
          </>
        )}
      </section>
    </div>
  );
}
function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="account-field">
      <span>{label}</span>
      {children}
      {error && <small className="field-error">{error}</small>}
    </label>
  );
}
