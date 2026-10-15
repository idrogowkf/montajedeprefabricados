"use client";
import { useEffect, useMemo, useState } from "react";
import {
  catalogProducts,
  hasStoreImage,
  hasVerifiedTechnicalDocument,
  isPublicationReady,
  type CatalogProduct,
} from "@/data/catalog";
import {
  catalogApplications,
  catalogCategories,
  type CatalogApplicationId,
  type CatalogCategoryId,
} from "@/data/catalog-taxonomy";
import { calculatePrice } from "@/lib/pricing";
import PriceAudit from "./PriceAudit";

type Commercial = Partial<CatalogProduct["commercial"]>;
type Content = Partial<
  Pick<
    CatalogProduct,
    | "name"
    | "brand"
    | "family"
    | "unit"
    | "publicDescription"
    | "publicSpecifications"
    | "imageUrls"
    | "datasheetUrl"
    | "sourceUrl"
    | "availability"
    | "delivery"
    | "category"
    | "subcategory"
    | "applications"
    | "pieceTypes"
    | "materials"
    | "technicalAttributes"
  >
>;
type Patch = { commercial?: Commercial; content?: Content };
type Row = CatalogProduct & { calculated: ReturnType<typeof calculatePrice> };
const euro = (n: number) =>
  n.toLocaleString("es-ES", { style: "currency", currency: "EUR" });
// Vocabulary used by the commercial controls: Coste de compra · Estado de publicación.

export default function CatalogAdmin() {
  const [tab, setTab] = useState<"catalogo" | "proveedores" | "bandeja">(
      "catalogo",
    ),
    [query, setQuery] = useState(""),
    [category, setCategory] = useState("todos"),
    [application, setApplication] = useState("todos"),
    [piece, setPiece] = useState("todos"),
    [material, setMaterial] = useState("todos"),
    [brand, setBrand] = useState("todos"),
    [statusFilter, setStatusFilter] = useState("todos");
  const [selectedId, setSelectedId] = useState(catalogProducts[0].id),
    [selectedIds, setSelectedIds] = useState<Set<string>>(new Set()),
    [products, setProducts] = useState(catalogProducts),
    [sync, setSync] = useState("Conectando…"),
    [visibleCount, setVisibleCount] = useState(50);
  const loadCatalog = () => {
    setSync("Conectando…");
    fetch("/api/admin/catalog", { cache: "no-store" })
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.error || "Error de conexión");
        return data;
      })
      .then((data) => {
        setProducts(data.products);
        setSync("Base de datos conectada");
      })
      .catch((error) =>
        setSync(
          error instanceof Error
            ? `${error.message} · Reintentar`
            : "Error de conexión · Reintentar",
        ),
      );
  };
  useEffect(loadCatalog, []);
  const save = async (ids: string[], patch: Patch) => {
    setSync("Guardando…");
    try {
      const response = await fetch("/api/admin/catalog", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ids, ...patch }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      const changed = new Map(
        (data.products as CatalogProduct[]).map((p) => [p.id, p]),
      );
      setProducts((current) =>
        current.map((product) => changed.get(product.id) ?? product),
      );
      setSync(
        `Guardado · ${ids.length} referencia${ids.length === 1 ? "" : "s"}`,
      );
    } catch (error) {
      setSync(error instanceof Error ? error.message : "No se pudo guardar");
    }
  };
  const rows = useMemo(
    () =>
      products.map((product) => ({
        ...product,
        calculated: calculatePrice(product.commercial),
      })),
    [products],
  );
  const options = <K extends "applications" | "pieceTypes" | "materials">(
    key: K,
  ) => Array.from(new Set(rows.flatMap((p) => p[key] ?? []))).sort();
  const applications = options("applications"),
    pieces = options("pieceTypes"),
    materials = options("materials"),
    brands = Array.from(new Set(rows.map((p) => p.brand))).sort();
  const duplicateReferences = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of products) {
      const ref = p.supplier.reference.trim().toLowerCase();
      if (ref && ref !== "pendiente")
        counts.set(ref, (counts.get(ref) ?? 0) + 1);
    }
    return new Set(
      [...counts].filter(([, count]) => count > 1).map(([ref]) => ref),
    );
  }, [products]);
  const filtered = rows.filter(
    (p) =>
      `${p.sku} ${p.supplier.reference} ${p.name} ${p.brand} ${p.family}`
        .toLowerCase()
        .includes(query.toLowerCase()) &&
      (category === "todos" || p.category === category) &&
      (application === "todos" ||
        p.applications?.includes(application as CatalogApplicationId)) &&
      (piece === "todos" || p.pieceTypes?.includes(piece)) &&
      (material === "todos" || p.materials?.includes(material)) &&
      (brand === "todos" || p.brand === brand) &&
      (statusFilter === "todos" ||
        (statusFilter === "publicable" && isPublicationReady(p)) ||
        (statusFilter === "missing-doc" && !hasVerifiedTechnicalDocument(p)) ||
        (statusFilter === "invalid-image" && !hasStoreImage(p)) ||
        (statusFilter === "duplicate" &&
          duplicateReferences.has(p.supplier.reference.trim().toLowerCase())) ||
        (statusFilter === "incomplete" &&
          p.commercial.status === "ready" &&
          !isPublicationReady(p)) ||
        p.commercial.status === statusFilter),
  );
  const selected =
    filtered.find((p) => p.id === selectedId) || filtered[0] || rows[0];
  const selectAll = () =>
    setSelectedIds((current) =>
      current.size === filtered.length
        ? new Set()
        : new Set(filtered.map((p) => p.id)),
    );
  useEffect(
    () => setVisibleCount(50),
    [query, category, application, piece, material, brand, statusFilter],
  );
  const visible = filtered.slice(0, visibleCount);
  return (
    <div className="admin-shell">
      <AdminNav tab={tab} setTab={setTab} />
      <main className="admin-main">
        <header>
          <div>
            <button
              className="admin-kicker"
              onClick={() => sync.includes("Reintentar") && loadCatalog()}
            >
              CENTRO DE CONTROL · {sync}
            </button>
            <h1>
              {tab === "catalogo"
                ? "Catálogo y rentabilidad"
                : tab === "proveedores"
                  ? "Proveedores y fuentes"
                  : "Bandeja operativa"}
            </h1>
          </div>
          <span className="admin-user">
            Administrador <b>A</b>
          </span>
        </header>
        {tab === "catalogo" && (
          <>
            <Stats rows={rows} />
            <section className="docs-queue-banner">
              <div>
                <span>CONTROL DOCUMENTAL</span>
                <h2>Fichas técnicas pendientes</h2>
                <p>
                  {rows.filter((p) => !hasVerifiedTechnicalDocument(p)).length}{" "}
                  referencias necesitan localizar y validar su PDF oficial.
                </p>
              </div>
              <button onClick={() => setStatusFilter("missing-doc")}>
                Ver cola de investigación →
              </button>
            </section>
            <BulkBar
              count={selectedIds.size}
              onApply={(commercial) => save([...selectedIds], { commercial })}
            />
            <section className="admin-work">
              <div className="admin-list">
                <div className="admin-tools admin-filter-tools">
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Buscar SKU, referencia, producto o marca"
                  />
                  <Filter
                    label="Categoría"
                    value={category}
                    setValue={setCategory}
                    items={catalogCategories.map((item) => [
                      item.id,
                      item.label,
                    ])}
                  />
                  <Filter
                    label="Aplicación"
                    value={application}
                    setValue={setApplication}
                    items={applications.map((id) => [
                      id,
                      catalogApplications.find((item) => item.id === id)
                        ?.label ?? id,
                    ])}
                  />
                  <Filter
                    label="Tipo de pieza"
                    value={piece}
                    setValue={setPiece}
                    items={pieces.map((value) => [value, value])}
                  />
                  <Filter
                    label="Material"
                    value={material}
                    setValue={setMaterial}
                    items={materials.map((value) => [value, value])}
                  />
                  <Filter
                    label="Marca"
                    value={brand}
                    setValue={setBrand}
                    items={brands.map((value) => [value, value])}
                  />
                  <Filter
                    label="Calidad documental"
                    value={statusFilter}
                    setValue={setStatusFilter}
                    items={[
                      ["missing-doc", "Sin ficha PDF"],
                      ["invalid-image", "Imagen pendiente"],
                      ["duplicate", "Referencia duplicada"],
                      ["publicable", "Publicable"],
                      ["incomplete", "Incompleto"],
                      ["quote", "Bajo oferta"],
                      ["draft", "Borrador"],
                    ]}
                  />
                </div>
                <ProductTable
                  products={visible}
                  selectedId={selectedId}
                  selectedIds={selectedIds}
                  duplicateReferences={duplicateReferences}
                  onSelect={setSelectedId}
                  onToggle={(id) =>
                    setSelectedIds((current) => {
                      const next = new Set(current);
                      next.has(id) ? next.delete(id) : next.add(id);
                      return next;
                    })
                  }
                  selectAll={selectAll}
                />
                {visible.length < filtered.length && (
                  <button
                    className="load-more"
                    onClick={() => setVisibleCount((count) => count + 50)}
                  >
                    Mostrar 50 más · {filtered.length - visible.length}{" "}
                    pendientes
                  </button>
                )}
              </div>
              <ProductEditor
                key={selected.id}
                product={selected}
                save={(patch) => save([selected.id], patch)}
              />
            </section>
          </>
        )}
        {tab === "proveedores" && (
          <>
            <PriceAudit />
            <ProviderView products={products} />
          </>
        )}
        {tab === "bandeja" && <InboxView />}
      </main>
    </div>
  );
}
function AdminNav({
  tab,
  setTab,
}: {
  tab: string;
  setTab: (tab: "catalogo" | "proveedores" | "bandeja") => void;
}) {
  return (
    <aside className="admin-side">
      <a href="/" className="admin-brand">
        <b>MP</b>
        <span>
          Administración
          <br />
          <small>CENTRO DE OPERACIONES</small>
        </span>
      </a>
      <nav>
        <button
          className={tab === "catalogo" ? "active" : ""}
          onClick={() => setTab("catalogo")}
        >
          ▦ Catálogo
        </button>
        <button
          className={tab === "proveedores" ? "active" : ""}
          onClick={() => setTab("proveedores")}
        >
          ⌂ Proveedores y precios
        </button>
        <button
          className={tab === "bandeja" ? "active" : ""}
          onClick={() => setTab("bandeja")}
        >
          ✉ Bandeja operativa
        </button>
      </nav>
      <div className="admin-warning">
        <strong>ACCESO PROTEGIDO</strong>
        <span>Autenticación, catálogo Neon y auditoría activos.</span>
      </div>
      <a className="back-store" href="/tienda">
        ← Ver tienda
      </a>
    </aside>
  );
}
function Stats({ rows }: { rows: Row[] }) {
  return (
    <section className="admin-stats">
      <Stat
        label="Referencias"
        value={String(rows.length)}
        note="en catálogo"
      />
      <Stat
        label="Listas para publicar"
        value={String(rows.filter(isPublicationReady).length)}
        note="expediente completo"
      />
      <Stat
        label="Costes sin verificar"
        value={String(rows.filter((p) => !p.commercial.costVerified).length)}
        note="no vinculantes"
        alert
      />
      <Stat
        label="Sin ficha PDF"
        value={String(
          rows.filter((p) => !hasVerifiedTechnicalDocument(p)).length,
        )}
        note="investigación pendiente"
        alert
      />
    </section>
  );
}
function Stat({
  label,
  value,
  note,
  alert,
}: {
  label: string;
  value: string;
  note: string;
  alert?: boolean;
}) {
  return (
    <article className={alert ? "alert" : ""}>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{note}</small>
    </article>
  );
}
function Filter({
  label,
  value,
  setValue,
  items,
}: {
  label: string;
  value: string;
  setValue: (value: string) => void;
  items: Array<readonly [string, string]>;
}) {
  return (
    <label>
      <span>{label}</span>
      <select value={value} onChange={(e) => setValue(e.target.value)}>
        <option value="todos">Todos</option>
        {items.map(([id, name]) => (
          <option value={id} key={id}>
            {name}
          </option>
        ))}
      </select>
    </label>
  );
}
function Status({ product }: { product: CatalogProduct }) {
  const eligible = isPublicationReady(product);
  const value = eligible
    ? "ready"
    : product.commercial.status === "ready"
      ? "incomplete"
      : product.commercial.status;
  return (
    <span className={`status ${value}`}>
      {eligible
        ? "Publicable"
        : value === "incomplete"
          ? "Expediente incompleto"
          : value === "quote"
            ? "Bajo oferta"
            : "Borrador"}
    </span>
  );
}
function ProductTable({
  products,
  selectedId,
  selectedIds,
  duplicateReferences,
  onSelect,
  onToggle,
  selectAll,
}: {
  products: Row[];
  selectedId: string;
  selectedIds: Set<string>;
  duplicateReferences: Set<string>;
  onSelect: (id: string) => void;
  onToggle: (id: string) => void;
  selectAll: () => void;
}) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>
              <input
                aria-label="Seleccionar todos"
                type="checkbox"
                checked={
                  products.length > 0 &&
                  products.every((p) => selectedIds.has(p.id))
                }
                onChange={selectAll}
              />
            </th>
            <th>Producto</th>
            <th>Coste</th>
            <th>Venta neta</th>
            <th>Margen</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr
              key={p.id}
              onClick={() => onSelect(p.id)}
              className={selectedId === p.id ? "selected" : ""}
            >
              <td>
                <input
                  aria-label={`Seleccionar ${p.name}`}
                  type="checkbox"
                  checked={selectedIds.has(p.id)}
                  onClick={(e) => e.stopPropagation()}
                  onChange={() => onToggle(p.id)}
                />
              </td>
              <td>
                <b>{p.name}</b>
                <small>
                  {p.sku} · {p.category ?? "Sin categoría"} ·{" "}
                  {p.supplier.reference}
                </small>
                <div className="quality-flags">
                  {!hasVerifiedTechnicalDocument(p) && (
                    <span>Sin ficha PDF</span>
                  )}
                  {!hasStoreImage(p) && <span>Imagen pendiente</span>}
                  {duplicateReferences.has(
                    p.supplier.reference.trim().toLowerCase(),
                  ) && <span>Referencia duplicada</span>}
                </div>
              </td>
              <td>
                {p.commercial.cost ? euro(p.commercial.cost) : "Pendiente"}
              </td>
              <td>
                <b>
                  {p.calculated.salePriceNet
                    ? euro(p.calculated.salePriceNet)
                    : "Pendiente"}
                </b>
              </td>
              <td>{p.calculated.actualMarginPercent}%</td>
              <td>
                <Status product={p} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
function BulkBar({
  count,
  onApply,
}: {
  count: number;
  onApply: (patch: Commercial) => void;
}) {
  const [margin, setMargin] = useState(28),
    [shipping, setShipping] = useState(0),
    [status, setStatus] =
      useState<CatalogProduct["commercial"]["status"]>("quote");
  const bulkPatch = {
    targetMarginPercent: margin,
    inboundShipping: shipping,
    status,
  };
  return (
    <section className="bulk-bar">
      <strong>{count} seleccionados</strong>
      <label>
        Margen %
        <input
          type="number"
          value={margin}
          onChange={(e) => setMargin(Number(e.target.value))}
        />
      </label>
      <label>
        Transporte €
        <input
          type="number"
          value={shipping}
          onChange={(e) => setShipping(Number(e.target.value))}
        />
      </label>
      <label>
        Estado
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as typeof status)}
        >
          <option value="draft">Borrador</option>
          <option value="quote">Bajo oferta</option>
        </select>
      </label>
      <button disabled={!count} onClick={() => onApply(bulkPatch)}>
        Aplicar en masa
      </button>
    </section>
  );
}
function ProductEditor({
  product,
  save,
}: {
  product: Row;
  save: (patch: Patch) => void;
}) {
  const verified = hasVerifiedTechnicalDocument(product);
  const [editorTab, setEditorTab] = useState<
      "commercial" | "content" | "images" | "docs"
    >(verified ? "commercial" : "docs"),
    [commercial, setCommercial] = useState(product.commercial),
    [content, setContent] = useState<Content>({
      name: product.name,
      brand: product.brand,
      family: product.family,
      unit: product.unit,
      publicDescription: product.publicDescription ?? "",
      publicSpecifications: product.publicSpecifications ?? [],
      imageUrls: product.imageUrls ?? [],
      datasheetUrl: verified ? (product.datasheetUrl ?? "") : "",
      sourceUrl: product.sourceUrl,
      availability: product.availability,
      delivery: product.delivery,
      category: product.category,
      subcategory: product.subcategory,
      applications: product.applications ?? [],
      pieceTypes: product.pieceTypes ?? [],
      materials: product.materials ?? [],
      technicalAttributes: product.technicalAttributes ?? {},
    });
  const calculation = calculatePrice(commercial),
    pdfReady = Boolean(
      content.datasheetUrl && /\.pdf(?:$|[?#])/i.test(content.datasheetUrl),
    );
  return (
    <aside className="product-editor">
      <div className="editor-head">
        <div>
          <small>{product.sku}</small>
          <h2>{content.name}</h2>
        </div>
        <Status product={{ ...product, ...content, commercial }} />
      </div>
      <div className="editor-tabs">
        <button
          className={editorTab === "commercial" ? "active" : ""}
          onClick={() => setEditorTab("commercial")}
        >
          Comercial
        </button>
        <button
          className={editorTab === "content" ? "active" : ""}
          onClick={() => setEditorTab("content")}
        >
          Contenido
        </button>
        <button
          className={editorTab === "images" ? "active" : ""}
          onClick={() => setEditorTab("images")}
        >
          Imágenes
        </button>
        <button
          className={editorTab === "docs" ? "active" : ""}
          onClick={() => setEditorTab("docs")}
        >
          Documentación
        </button>
      </div>
      {editorTab === "commercial" && (
        <>
          <label>
            Estado
            <select
              value={commercial.status}
              onChange={(e) =>
                setCommercial({
                  ...commercial,
                  status: e.target.value as typeof commercial.status,
                })
              }
            >
              <option value="draft">Borrador</option>
              <option value="quote">Bajo oferta</option>
              <option value="ready">Solicitar publicación</option>
            </select>
          </label>
          <div className="editor-grid">
            <MoneyField
              label="Coste"
              value={commercial.cost}
              onChange={(cost) => setCommercial({ ...commercial, cost })}
            />
            <MoneyField
              label="Transporte"
              value={commercial.inboundShipping}
              onChange={(inboundShipping) =>
                setCommercial({ ...commercial, inboundShipping })
              }
            />
            <MoneyField
              label="Manipulación"
              value={commercial.handling}
              onChange={(handling) =>
                setCommercial({ ...commercial, handling })
              }
            />
            <MoneyField
              label="Margen objetivo"
              value={commercial.targetMarginPercent}
              suffix="%"
              onChange={(targetMarginPercent) =>
                setCommercial({ ...commercial, targetMarginPercent })
              }
            />
          </div>
          <div className="profit-box">
            <div>
              <span>Coste puesto</span>
              <b>{euro(calculation.landedCost)}</b>
            </div>
            <div>
              <span>Venta neta</span>
              <b>{euro(calculation.salePriceNet)}</b>
            </div>
            <div>
              <span>IVA incluido</span>
              <b>{euro(calculation.salePriceVat)}</b>
            </div>
            <div className="profit">
              <span>Beneficio bruto</span>
              <b>{euro(calculation.grossProfit)}</b>
            </div>
          </div>
        </>
      )}
      {editorTab === "content" && (
        <div className="editor-fields">
          <TextField
            label="Nombre"
            value={content.name ?? ""}
            onChange={(name) => setContent({ ...content, name })}
          />
          <TextField
            label="Marca"
            value={content.brand ?? ""}
            onChange={(brand) => setContent({ ...content, brand })}
          />
          <label>
            Categoría
            <select
              value={content.category ?? ""}
              onChange={(e) =>
                setContent({
                  ...content,
                  category: e.target.value as CatalogCategoryId,
                })
              }
            >
              <option value="" disabled>
                Selecciona una categoría
              </option>
              {catalogCategories.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          <TextField
            label="Subcategoría"
            value={content.subcategory ?? ""}
            onChange={(subcategory) => setContent({ ...content, subcategory })}
          />
          <label>
            Aplicaciones (una por línea)
            <textarea
              rows={4}
              value={(content.applications ?? []).join("\n")}
              onChange={(e) =>
                setContent({
                  ...content,
                  applications: e.target.value
                    .split("\n")
                    .filter(Boolean) as CatalogApplicationId[],
                })
              }
            />
          </label>
          <label>
            Tipos de pieza (uno por línea)
            <textarea
              rows={4}
              value={(content.pieceTypes ?? []).join("\n")}
              onChange={(e) =>
                setContent({
                  ...content,
                  pieceTypes: e.target.value.split("\n"),
                })
              }
            />
          </label>
          <label>
            Materiales (uno por línea)
            <textarea
              rows={4}
              value={(content.materials ?? []).join("\n")}
              onChange={(e) =>
                setContent({
                  ...content,
                  materials: e.target.value.split("\n"),
                })
              }
            />
          </label>
          <label>
            Descripción
            <textarea
              rows={6}
              value={content.publicDescription ?? ""}
              onChange={(e) =>
                setContent({ ...content, publicDescription: e.target.value })
              }
            />
          </label>
          <label>
            Especificaciones (una por línea)
            <textarea
              rows={6}
              value={(content.publicSpecifications ?? []).join("\n")}
              onChange={(e) =>
                setContent({
                  ...content,
                  publicSpecifications: e.target.value.split("\n"),
                })
              }
            />
          </label>
        </div>
      )}
      {editorTab === "images" && (
        <div className="editor-fields">
          {content.imageUrls?.[0] && (
            <img
              className="admin-product-photo"
              src={content.imageUrls[0]}
              alt=""
            />
          )}
          <label>
            Galería · una URL HTTPS por línea
            <textarea
              rows={12}
              value={(content.imageUrls ?? []).join("\n")}
              onChange={(e) =>
                setContent({
                  ...content,
                  imageUrls: e.target.value.split("\n"),
                })
              }
            />
          </label>
          <small>
            Mínimo recomendado: 3 imágenes oficiales. La primera será la
            portada.
          </small>
        </div>
      )}
      {editorTab === "docs" && (
        <div className="editor-fields">
          <div
            className={`document-state ${pdfReady ? "verified" : "pending"}`}
          >
            <b>{pdfReady ? "PDF técnico verificado" : "Sin ficha PDF"}</b>
            <span>
              {pdfReady
                ? "La referencia tiene un documento descargable válido."
                : "Usa estos datos para localizar la ficha oficial exacta."}
            </span>
          </div>
          <div className="research-card">
            <span>DATOS PARA INVESTIGAR</span>
            <dl>
              <div>
                <dt>Marca</dt>
                <dd>{content.brand || "Sin marca"}</dd>
              </div>
              <div>
                <dt>Referencia del fabricante</dt>
                <dd>{product.supplier.reference}</dd>
              </div>
              <div>
                <dt>SKU interno</dt>
                <dd>{product.sku}</dd>
              </div>
              <div>
                <dt>Proveedor</dt>
                <dd>{product.supplier.name}</dd>
              </div>
            </dl>
            <b>Descripción de la pieza</b>
            <p>{content.publicDescription || product.name}</p>
            <a href={content.sourceUrl} target="_blank" rel="noreferrer">
              Página para investigar ↗
            </a>
          </div>
          <TextField
            label="Página web oficial o fuente"
            value={content.sourceUrl ?? ""}
            onChange={(sourceUrl) => setContent({ ...content, sourceUrl })}
          />
          <TextField
            label="Pegar URL del PDF oficial"
            value={content.datasheetUrl ?? ""}
            onChange={(datasheetUrl) =>
              setContent({ ...content, datasheetUrl })
            }
          />
          {content.datasheetUrl && !pdfReady && (
            <small className="document-error">
              La dirección debe apuntar directamente a un archivo PDF.
            </small>
          )}
          {pdfReady && (
            <a
              className="admin-document-link"
              href={content.datasheetUrl}
              target="_blank"
              rel="noreferrer"
            >
              Abrir PDF técnico ↗
            </a>
          )}
        </div>
      )}
      <button
        className="save-product"
        disabled={
          editorTab === "docs" && Boolean(content.datasheetUrl) && !pdfReady
        }
        onClick={() => save({ commercial, content })}
      >
        Guardar ficha
      </button>
    </aside>
  );
}
function TextField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label>
      {label}
      <input value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}
function MoneyField({
  label,
  value,
  onChange,
  suffix = "€",
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  suffix?: string;
}) {
  return (
    <label>
      {label}
      <div>
        <input
          type="number"
          min="0"
          step="0.01"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
        />
        <span>{suffix}</span>
      </div>
    </label>
  );
}
function ProviderView({ products }: { products: CatalogProduct[] }) {
  const suppliers = Array.from(
    new Map(products.map((p) => [p.supplier.name, p])).values(),
  );
  return (
    <section className="simple-panel">
      <h2>Proveedores y referencias</h2>
      {suppliers.map((p) => (
        <article key={p.supplier.name}>
          <div>
            <b>{p.supplier.name}</b>
            <span>{p.supplier.country}</span>
          </div>
          <span>
            {products.filter((x) => x.supplier.name === p.supplier.name).length}{" "}
            referencias
          </span>
          <a href={p.sourceUrl} target="_blank" rel="noreferrer">
            Revisar fuente ↗
          </a>
        </article>
      ))}
    </section>
  );
}
type Inquiry = {
  id: string;
  kind: string;
  product_name?: string;
  customer_name: string;
  company?: string;
  email?: string;
  phone?: string;
  message: string;
  status: string;
  public_status: string;
  admin_notes?: string;
  profile_snapshot?: {
    contactName?: string;
    legalName?: string;
    taxId?: string;
    phone?: string;
    addressLine1?: string;
    postalCode?: string;
    city?: string;
    province?: string;
  };
  created_at: string;
  documents?: Array<{ name: string; url: string }>;
};
function InboxView() {
  const [items, setItems] = useState<Inquiry[]>([]),
    [status, setStatus] = useState("Cargando solicitudes…"),
    [saving, setSaving] = useState("");
  const load = () =>
    fetch("/api/admin/product-inquiries")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => {
        setItems(data.inquiries);
        setStatus(
          data.inquiries.length
            ? ""
            : "Todavía no hay solicitudes de producto.",
        );
      })
      .catch(() => setStatus("No se pudo cargar la bandeja."));
  useEffect(() => {
    void load();
  }, []);
  const change = (id: string, patch: Partial<Inquiry>) =>
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );
  const save = async (item: Inquiry) => {
    setSaving(item.id);
    setStatus("Guardando…");
    try {
      const response = await fetch("/api/admin/product-inquiries", {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            id: item.id,
            publicStatus: item.public_status,
            adminNotes: item.admin_notes ?? "",
          }),
        }),
        data = await response.json();
      if (!response.ok) throw new Error(data.error);
      change(item.id, data.inquiry);
      setStatus("Seguimiento guardado.");
    } catch {
      setStatus("No se pudo guardar el seguimiento.");
    } finally {
      setSaving("");
    }
  };
  return (
    <section className="simple-panel inbox">
      <h2>Bandeja operativa</h2>
      <p>
        Solicitudes identificadas de producto, ficha técnica y búsqueda
        asistida.
      </p>
      {status && <p>{status}</p>}
      <div className="inquiry-admin-list">
        {items.map((item) => (
          <article key={item.id}>
            <header>
              <b>{item.id}</b>
              <span>{new Date(item.created_at).toLocaleString("es-ES")}</span>
            </header>
            <strong>{item.product_name || "Búsqueda asistida"}</strong>
            <small>
              {item.kind} · {item.status}
            </small>
            <p>{item.message}</p>
            <div>
              <b>{item.customer_name}</b> · {item.company || "Particular"} ·{" "}
              {item.email || "Sin email"} · {item.phone || "Sin teléfono"}
            </div>
            {item.profile_snapshot && (
              <dl className="inquiry-profile">
                <div>
                  <dt>Perfil</dt>
                  <dd>
                    {item.profile_snapshot.contactName} ·{" "}
                    {item.profile_snapshot.legalName || "Particular"}
                  </dd>
                </div>
                <div>
                  <dt>Fiscal</dt>
                  <dd>{item.profile_snapshot.taxId}</dd>
                </div>
                <div>
                  <dt>Entrega/facturación</dt>
                  <dd>
                    {item.profile_snapshot.addressLine1},{" "}
                    {item.profile_snapshot.postalCode}{" "}
                    {item.profile_snapshot.city} (
                    {item.profile_snapshot.province})
                  </dd>
                </div>
              </dl>
            )}
            <label>
              Estado visible para el cliente
              <select
                value={item.public_status || "received"}
                onChange={(e) =>
                  change(item.id, { public_status: e.target.value })
                }
              >
                <option value="received">Recibida</option>
                <option value="reviewing">En revisión</option>
                <option value="awaiting_customer">Información pendiente</option>
                <option value="quoted">Oferta preparada</option>
                <option value="closed">Cerrada</option>
              </select>
            </label>
            <label>
              Nota interna
              <textarea
                rows={3}
                maxLength={2000}
                value={item.admin_notes ?? ""}
                onChange={(e) =>
                  change(item.id, { admin_notes: e.target.value })
                }
              />
            </label>
            <button disabled={saving === item.id} onClick={() => save(item)}>
              {saving === item.id ? "Guardando…" : "Guardar seguimiento"}
            </button>
            {item.documents?.map((file) => (
              <a
                key={file.url}
                href={file.url}
                target="_blank"
                rel="noreferrer"
              >
                {file.name} ↗
              </a>
            ))}
          </article>
        ))}
      </div>
    </section>
  );
}
