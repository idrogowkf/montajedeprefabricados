import type {Metadata} from "next";
import MarketplaceMockup from "@/components/store/MarketplaceMockup";
import "./tienda.css";

export const metadata:Metadata={title:"Marketplace interactivo · Prototipo",robots:{index:false,follow:false}};
export default function StoreMockupPage(){return <MarketplaceMockup/>}
