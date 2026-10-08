type Claims=Record<string,unknown>;

export function isAdminEmail(email:string|null|undefined,configuredEmails=process.env.ADMIN_EMAILS??""){
  if(!email)return false;
  const allowed=new Set(configuredEmails.split(",").map(value=>value.trim().toLowerCase()).filter(Boolean));
  return allowed.has(email.trim().toLowerCase());
}

export function isAdminIdentity(userId:string|null|undefined,claims:Claims={},configuredIds=process.env.ADMIN_USER_IDS??""){
  if(!userId)return false;
  const ids=new Set(configuredIds.split(",").map(value=>value.trim()).filter(Boolean));
  const metadata=(claims.metadata&&typeof claims.metadata==="object"?claims.metadata:{}) as Claims;
  const publicMetadata=(claims.publicMetadata&&typeof claims.publicMetadata==="object"?claims.publicMetadata:{}) as Claims;
  const roles=[claims.role,claims.org_role,metadata.role,publicMetadata.role].map(String);
  return ids.has(userId)||roles.some(role=>role==="admin"||role==="org:admin");
}
