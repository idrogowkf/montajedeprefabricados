import "server-only";
import {headers} from "next/headers";
import {auth} from "./auth";

export type CustomerIdentity={
  userId:string;
  email:string;
  verifiedEmails:string[];
  firstName:string;
  lastName:string;
};

export async function getCustomerIdentity():Promise<CustomerIdentity|null>{
  const session=await auth.api.getSession({headers:await headers()});if(!session)return null;const email=session.user.email.trim().toLowerCase(),parts=session.user.name.trim().split(/\s+/);return {userId:session.user.id,email,verifiedEmails:[email],firstName:parts[0]??"",lastName:parts.slice(1).join(" ")};
}
