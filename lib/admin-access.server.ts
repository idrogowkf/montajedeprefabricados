import "server-only";
import {auth,currentUser} from "@clerk/nextjs/server";
import {isAdminEmail,isAdminIdentity} from "./admin-access";

export async function requireAdminIdentity(){
  const {userId,sessionClaims}=await auth();
  if(!userId)return null;
  if(isAdminIdentity(userId,(sessionClaims??{}) as Record<string,unknown>))return userId;
  const user=await currentUser();
  const role=String(user?.publicMetadata?.role??user?.privateMetadata?.role??"");
  const email=user?.emailAddresses.find(item=>item.id===user.primaryEmailAddressId)?.emailAddress??user?.emailAddresses[0]?.emailAddress;
  return role==="admin"||isAdminEmail(email)?userId:null;
}
