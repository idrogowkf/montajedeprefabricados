import type {Metadata} from "next";
import {SignIn} from "@clerk/nextjs";
import Brand from "@/components/v21/Brand";
import "../access.css";

export const metadata:Metadata={title:"Acceso de administración",robots:{index:false,follow:false}};

const appearance={
  elements:{
    rootBox:"admin-auth-root",
    card:"admin-auth-card",
    headerTitle:"admin-auth-title",
    headerSubtitle:"admin-auth-subtitle",
    formButtonPrimary:"admin-auth-submit",
    formFieldInput:"admin-auth-input",
    socialButtons:"admin-auth-hidden",
    dividerRow:"admin-auth-hidden",
    footerAction:"admin-auth-hidden",
    footer:"admin-auth-footer",
  },
};

export default function AdminSignInPage(){return <main className="admin-access-shell"><section className="access-brand"><Brand /><div><small>ÁREA PRIVADA</small><h1>Acceso de<br/><em>administración.</em></h1><p>Gestión del catálogo, precios, documentación técnica, proveedores y solicitudes comerciales.</p></div><ul><li>Sesión protegida</li><li>Acceso exclusivo del administrador</li><li>Actividad comercial centralizada</li></ul></section><section className="access-form"><div className="access-form-head"><span>IDENTIFICACIÓN SEGURA</span><h2>Bienvenido</h2><p>Accede con el correo administrativo y tu contraseña.</p></div><SignIn routing="path" path="/acceso-administracion" fallbackRedirectUrl="/administracion" appearance={appearance}/><div className="access-help"><b>Correo y contraseña</b><span>Si has olvidado tu clave, utiliza la recuperación segura disponible en el formulario.</span><a href="/">← Volver a la página principal</a></div></section></main>}
