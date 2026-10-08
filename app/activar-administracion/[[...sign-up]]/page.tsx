import type {Metadata} from "next";
import {SignUp} from "@clerk/nextjs";
import "../../acceso-administracion/access.css";

export const metadata:Metadata={title:"Activar cuenta administrativa",robots:{index:false,follow:false}};
const appearance={elements:{rootBox:"admin-auth-root",card:"admin-auth-card",headerTitle:"admin-auth-title",headerSubtitle:"admin-auth-subtitle",formButtonPrimary:"admin-auth-submit",formFieldInput:"admin-auth-input",socialButtons:"admin-auth-hidden",dividerRow:"admin-auth-hidden",footerAction:"admin-auth-hidden",footer:"admin-auth-footer"}};
export default function ActivateAdminPage(){return <main className="admin-access-shell"><section className="access-brand"><a href="/" className="access-logo"><b>MP</b><span>MONTAJE DE<br/>PREFABRICADOS</span></a><div><small>ACTIVACIÓN PRIVADA</small><h1>Crea tu clave<br/><em>administrativa.</em></h1><p>Este acceso está reservado a la cuenta invitada por Montaje de Prefabricados.</p></div><ul><li>Invitación de un solo uso</li><li>Contraseña cifrada</li><li>Sesión protegida</li></ul></section><section className="access-form"><div className="access-form-head"><span>PRIMER ACCESO</span><h2>Activa tu cuenta</h2><p>Confirma el correo invitado y establece tu contraseña privada.</p></div><SignUp routing="path" path="/activar-administracion" fallbackRedirectUrl="/administracion" appearance={appearance}/></section></main>}
