import type {Metadata} from "next";
import CatalogAdmin from "@/components/admin/CatalogAdmin";
import "./admin.css";
import "./price-audit.css";
import "./filters.css";

export const metadata:Metadata={title:"Administración comercial · Entorno local",robots:{index:false,follow:false}};
export default function AdminPage(){return <CatalogAdmin/>}
