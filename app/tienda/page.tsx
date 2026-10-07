import type {Metadata} from "next";
import MarketplaceMockup from "@/components/store/MarketplaceMockup";
import {getCatalog} from "@/lib/catalog-db";
import {catalogProducts,hasCompleteStorefrontGallery} from "@/data/catalog";
import {toPublicCatalogProduct} from "@/lib/public-catalog";
import "./tienda.css";

export const metadata:Metadata={title:"Tienda profesional · Marketplace",robots:{index:false,follow:false}};
export const dynamic="force-dynamic";
export default async function StoreMockupPage(){let products=catalogProducts;try{products=await getCatalog()}catch{}return <MarketplaceMockup initialProducts={products.filter(hasCompleteStorefrontGallery).map(toPublicCatalogProduct)}/>}
