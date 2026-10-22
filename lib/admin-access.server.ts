import "server-only";
import {headers} from "next/headers";
import {auth} from "./auth";
import {isAdminEmail,isAdminIdentity} from "./admin-access";

export async function requireAdminIdentity(){
  const session=await auth.api.getSession({headers:await headers()});
  if(!session?.user)return null;
  return isAdminIdentity(session.user.id)||isAdminEmail(session.user.email)?session.user.id:null;
}
