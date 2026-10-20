import {describe,expect,it} from "vitest";
import {readFileSync} from "node:fs";
import {join} from "node:path";

describe("store taxonomy controls",()=>{
  it("keeps one category selector below the hero and removes duplicate filters",()=>{
    const source=readFileSync(join(process.cwd(),"components/store/MarketplaceMockup.tsx"),"utf8");
    expect(source).toContain("CatalogSearch");
    expect(source).toContain('className="quick-categories"');
    expect(source).not.toContain("CatalogFilters");
    expect(source).not.toContain('className="category-bar"');
  });
  it("presents functional categories instead of brand categories",()=>{
    const source=readFileSync(join(process.cwd(),"components/store/MarketplaceMockup.tsx"),"utf8");
    for(const label of ["Fijación","Corte y perforación","Trabajos en altura"]){expect(source).toContain(label);}
    expect(source).not.toContain('title="Productos Hilti"');
  });
  it("uses a dedicated product inquiry without exposing missing datasheets",()=>{
    const source=readFileSync(join(process.cwd(),"components/store/MarketplaceMockup.tsx"),"utf8");
    const inquiry=readFileSync(join(process.cwd(),"components/store/ProductInquiryPanel.tsx"),"utf8");
    expect(source).toContain("ProductInquiryPanel");
    expect(source).not.toContain("Solicitar ficha técnica");
    expect(inquiry).toContain("Cuéntanos qué producto necesitas");
    expect(source).not.toContain("Configuración técnica necesaria");
  });
  it("keeps URL state without the duplicated category bar",()=>{
    const source=readFileSync(join(process.cwd(),"components/store/MarketplaceMockup.tsx"),"utf8");
    expect(source).not.toContain("Familias de producto");
    expect(source).toContain("serializeCatalogState");
    expect(source).toContain('addEventListener("popstate"');
  });
  it("keeps commercial intelligence out of the public storefront",()=>{
    const source=readFileSync(join(process.cwd(),"components/store/MarketplaceMockup.tsx"),"utf8");
    for(const internalLabel of ["ROTACIÓN ALTA","Fuente de mercado","Fuentes de mercado","margen objetivo"]){
      expect(source).not.toContain(internalLabel);
    }
    for(const publicLabel of ["Precio sin IVA","vatPercent","Total con IVA","Transporte"]){
      expect(source).toContain(publicLabel);
    }
  });
  it("offers assisted sourcing without a lateral filter panel",()=>{
    const source=readFileSync(join(process.cwd(),"components/store/MarketplaceMockup.tsx"),"utf8");
    const css=readFileSync(join(process.cwd(),"app/catalog-enhancements.css"),"utf8");
    expect(source).toContain("¿No encuentras lo que buscas?");
    expect(source).toContain("Ayúdame a elegir");
    expect(source).toContain("TechnicalFinder");
    expect(source).not.toContain("CatalogFilters");
  });
  it("opens landing product hashes in the storefront",()=>{
    const source=readFileSync(join(process.cwd(),"components/store/MarketplaceMockup.tsx"),"utf8");
    expect(source).toContain("window.location.hash");
    expect(source).toContain('addEventListener("hashchange"');
    expect(source).toContain('id={product.id}');
    expect(source).toContain("setSelected(product)");
  });
  it("keeps quote navigation alive and styles every product action",()=>{
    const source=readFileSync(join(process.cwd(),"components/store/MarketplaceMockup.tsx"),"utf8");
    expect(source).toContain('onRequest("product")');
    expect(source).toContain("product-document");
    expect(source).toContain("product-panel-brand");
    expect(source).not.toContain('onMouseDown={onClose}><section className="product-panel"');
  });
  it("wires every storefront action instead of rendering inert controls",()=>{
    const source=readFileSync(join(process.cwd(),"components/store/MarketplaceMockup.tsx"),"utf8");
    expect(source).toContain('/mi-cuenta?seccion=solicitudes');
    expect(source).toContain('href="/mi-cuenta"');
    expect(source).not.toContain("Seguimiento por referencia");
    expect(source).not.toContain("SignInButton");
    expect(source).toContain("onCheckout");
    expect(source).toContain('value={sort}');
    expect(source).toMatch(/onChange=\{\(?event\)?\s*=>\s*setSort/);
  });
  it("links the landing category chips to real filtered catalog views",()=>{
    const hero=readFileSync(join(process.cwd(),"components/v21/Hero.tsx"),"utf8");
    for(const category of ["elevacion","fijacion","corte","altura","epi","sellado"])expect(hero).toContain(`/tienda?category=${category}`);
    expect(hero).toContain('/tienda?ayuda=1');
  });
});
