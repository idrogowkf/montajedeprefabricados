import {headers} from "next/headers";
import {redirect} from "next/navigation";
import {auth} from "@/lib/auth";
import Brand from "@/components/v21/Brand";
import CustomerAccount from "@/components/account/CustomerAccount";
import "./account.css";

export const metadata={title:"Mi cuenta"};
export default async function AccountPage(){const session=await auth.api.getSession({headers:headers()});if(!session?.user)redirect("/iniciar-sesion?redirect_url=/mi-cuenta");return <main className="account-page"><header className="account-head"><Brand/><a href="/tienda">Volver a la tienda</a></header><CustomerAccount/></main>;}
