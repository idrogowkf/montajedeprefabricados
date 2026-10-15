import "server-only";
import {auth,currentUser} from "@clerk/nextjs/server";

export type CustomerIdentity={
  userId:string;
  email:string;
  verifiedEmails:string[];
  firstName:string;
  lastName:string;
};

export async function getCustomerIdentity():Promise<CustomerIdentity|null>{
  const {userId}=await auth();
  if(!userId)return null;
  const user=await currentUser();
  if(!user)return null;
  const verifiedEmails=user.emailAddresses
    .filter(address=>address.verification?.status==="verified")
    .map(address=>address.emailAddress.trim().toLowerCase());
  const primary=user.emailAddresses.find(address=>address.id===user.primaryEmailAddressId&&address.verification?.status==="verified")?.emailAddress.trim().toLowerCase();
  const email=primary??verifiedEmails[0];
  if(!email)return null;
  return {userId,email,verifiedEmails:[...new Set(verifiedEmails)],firstName:user.firstName??"",lastName:user.lastName??""};
}
