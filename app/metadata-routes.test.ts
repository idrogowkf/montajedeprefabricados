import {describe,expect,it} from "vitest";
import robots from "./robots";
import sitemap from "./sitemap";
import manifest from "./manifest";
describe("metadata routes",()=>{it("publishes the canonical sitemap in robots",()=>{expect(robots().sitemap).toBe("https://montajesprefabricados.com/sitemap.xml")});it("includes every current public route in the sitemap",()=>{const urls=sitemap().map(item=>item.url);expect(urls).toContain("https://montajesprefabricados.com/");expect(urls).toContain("https://montajesprefabricados.com/presupuesto");expect(urls).toContain("https://montajesprefabricados.com/madrid");expect(urls).toContain("https://montajesprefabricados.com/tipos/puentes")});it("exposes a complete Spanish web manifest",()=>{expect(manifest()).toMatchObject({name:"Montaje de Prefabricados",short_name:"Montaje Prefabricados",lang:"es",start_url:"/"})})});
