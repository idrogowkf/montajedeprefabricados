import {SignIn} from "@clerk/nextjs";
import Brand from "@/components/v21/Brand";
import "../../acceso-administracion/access.css";

const appearance={elements:{rootBox:"clerk-root",card:"clerk-card",headerTitle:"clerk-hidden",headerSubtitle:"clerk-hidden",socialButtonsBlockButton:"clerk-social",formButtonPrimary:"clerk-primary",footer:"clerk-footer"}};
export default function CustomerSignInPage(){return <main className="admin-access-shell"><section className="access-brand"><Brand/><div><small>ÁREA DE CLIENTE</small><h1>Tu cuenta,<br/><em>tus solicitudes.</em></h1><p>Accede para completar tus datos una sola vez, solicitar ofertas y consultar su estado.</p></div><ul><li>Historial de solicitudes</li><li>Datos fiscales protegidos</li><li>Seguimiento comercial centralizado</li></ul></section><section className="access-form"><div className="access-form-head"><span>ACCESO SEGURO</span><h2>Bienvenido</h2><p>Continúa con tu correo o cuenta vinculada.</p></div><SignIn routing="path" path="/iniciar-sesion" fallbackRedirectUrl="/mi-cuenta" appearance={appearance}/><div className="access-help"><a href="/tienda">← Volver a la tienda</a></div></section></main>}
