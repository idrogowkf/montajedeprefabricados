import type {Metadata} from "next";
import CatalogAdmin from "@/components/admin/CatalogAdmin";
import "./admin.css";
import "./price-audit.css";
import "./filters.css";
import {notFound} from "next/navigation";
import {requireAdminIdentity} from "@/lib/admin-access.server";

export const metadata:Metadata={title:"Administración comercial · Marketplace",robots:{index:false,follow:false}};
export default async function AdminPage(){if(!await requireAdminIdentity())notFound();return <CatalogAdmin/>}
