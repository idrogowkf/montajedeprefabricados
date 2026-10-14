import {clerkMiddleware,createRouteMatcher} from "@clerk/nextjs/server";
import {NextResponse} from "next/server";

const isAdminPage=createRouteMatcher(["/administracion(.*)"]);
const isAdminApi=createRouteMatcher(["/api/admin(.*)"]);

export default clerkMiddleware(async(auth,request)=>{
  if(isAdminApi(request))await auth.protect();
  if(isAdminPage(request)){
    const {userId}=await auth();
    if(!userId){
      const signInUrl=new URL("/acceso-administracion",request.url);
      signInUrl.searchParams.set("redirect_url",request.url);
      return NextResponse.redirect(signInUrl);
    }
  }
});
export const config={matcher:["/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)","/(api|trpc)(.*)"]};
