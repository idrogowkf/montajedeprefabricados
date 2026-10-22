import {getSessionCookie} from "better-auth/cookies";
import {NextRequest,NextResponse} from "next/server";

export function proxy(request:NextRequest){
  const path=request.nextUrl.pathname;
  const protectedPage=path.startsWith("/mi-cuenta")||path.startsWith("/administracion");
  if(!protectedPage||getSessionCookie(request))return NextResponse.next();
  const target=path.startsWith("/administracion")?"/acceso-administracion":"/iniciar-sesion";
  const signInUrl=new URL(target,request.url);
  signInUrl.searchParams.set("redirect_url",request.url);
  return NextResponse.redirect(signInUrl);
}

export const config={matcher:["/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)","/(api|trpc)(.*)"]};
