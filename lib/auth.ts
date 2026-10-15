import "server-only";
import {betterAuth} from "better-auth";
import {Pool} from "pg";
import {Resend} from "resend";

const pool=new Pool({connectionString:process.env.DATABASE_URL,ssl:process.env.NODE_ENV==="production"?{rejectUnauthorized:false}:undefined,max:5});
async function sendAuthEmail(to:string,subject:string,title:string,url:string,action:string){if(!process.env.RESEND_API_KEY)throw new Error("RESEND_API_KEY no configurada");const resend=new Resend(process.env.RESEND_API_KEY);const result=await resend.emails.send({from:process.env.MAIL_FROM||"Montaje Prefabricado <ofertas@montajesprefabricados.com>",to,subject,html:`<div style="font-family:Arial;max-width:620px;margin:auto;border-top:6px solid #d92332;padding:32px"><h1>${title}</h1><p>Has recibido este correo desde Montaje Prefabricado.</p><p><a href="${url}" style="display:inline-block;background:#d92332;color:#fff;padding:14px 22px;text-decoration:none;font-weight:bold">${action}</a></p><p>Si no has solicitado esta acción, ignora el mensaje.</p></div>`});if(result.error)throw new Error(result.error.message);}

export const auth=betterAuth({
 database:pool,
 baseURL:process.env.BETTER_AUTH_URL,
 secret:process.env.BETTER_AUTH_SECRET,
 emailAndPassword:{enabled:true,requireEmailVerification:true,minPasswordLength:10,revokeSessionsOnPasswordReset:true,sendResetPassword:async({user,url})=>sendAuthEmail(user.email,"Recupera tu contraseña","Restablecer contraseña",url,"Crear nueva contraseña")},
 emailVerification:{sendOnSignUp:true,sendOnSignIn:true,autoSignInAfterVerification:true,sendVerificationEmail:async({user,url})=>sendAuthEmail(user.email,"Verifica tu correo","Confirma tu correo electrónico",url,"Verificar correo")},
 user:{deleteUser:{enabled:true}},
 trustedOrigins:["https://www.montajedeprefabricados.com","https://*.vercel.app"],
});
