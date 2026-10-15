import {auth} from "@clerk/nextjs/server";
import {redirect} from "next/navigation";
import Brand from "@/components/v21/Brand";
import CustomerAccount from "@/components/account/CustomerAccount";
import "./account.css";

export const metadata={title:"Mi cuenta"};
export default async function AccountPage(){const {userId}=await auth();if(!userId)redirect("/acceso-administracion?redirect_url=/mi-cuenta");return <main className="account-page"><header className="account-head"><Brand/><a href="/tienda">Volver a la tienda</a></header><CustomerAccount/></main>;}
