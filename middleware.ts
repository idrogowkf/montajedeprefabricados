import {clerkMiddleware,createRouteMatcher} from "@clerk/nextjs/server";
const isProtected=createRouteMatcher(["/administracion(.*)","/api/admin(.*)"]);
export default clerkMiddleware(async(auth,request)=>{if(isProtected(request))await auth.protect();});
export const config={matcher:["/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)","/(api|trpc)(.*)"]};
