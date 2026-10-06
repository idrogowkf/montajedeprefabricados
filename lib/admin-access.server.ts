import "server-only";
import {auth} from "@clerk/nextjs/server";
import {isAdminIdentity} from "./admin-access";

export async function requireAdminIdentity(){
  const {userId,sessionClaims}=await auth();
  return isAdminIdentity(userId,(sessionClaims??{}) as Record<string,unknown>)?userId:null;
}
