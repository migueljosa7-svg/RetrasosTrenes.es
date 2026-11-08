import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/LegalPage";
import { LEGAL } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Política de Privacidad | RetrasosTrenes.es",
  description: "Cómo tratamos tus datos: Google Analytics 4, cookies de terceros, Google AdSense y tus derechos según el RGPD y la LOPDGDD.",
  alternates: { canonical: "/politica-privacidad" },
};

export default function PoliticaPrivacidad() {
  return (
    <LegalPage title="Política de privacidad" slug="politica-privacidad">
      <h2>1. Responsable del tratamiento</h2>
      <ul>
        <li>Responsable: {LEGAL.owner}</li>
        <li>NIF/CIF: {LEGAL.taxId}</li>
        <li>Domicilio: {LEGAL.address}</li>
        <li>Contacto: <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a></li>
      </ul>

      <h2>2. Qué datos tratamos</h2>
      <p>
        RetrasosTrenes.es no exige registro ni solicita datos personales para consultar la información. Los datos que se tratan son:
      </p>
      <ul>
        <li>Datos de navegación (dirección IP anonimizada, dispositivo, navegador, páginas visitadas, duración de la visita) recogidos mediante cookies o tecnologías similares.</li>
        <li>Datos que nos envíes voluntariamente por correo electrónico (nombre, dirección de correo y el contenido de tu mensaje).</li>
        <li>Preferencias guardadas en tu navegador (por ejemplo, haber cerrado el aviso de instalación de la app), que no salen de tu dispositivo.</li>
      </ul>

      <h2>3. Finalidad y base jurídica</h2>
      <ul>
        <li><strong>Analítica web</strong> para conocer el uso del sitio y mejorarlo. Base: tu consentimiento (art. 6.1.a RGPD).</li>
        <li><strong>Publicidad</strong> para financiar el sitio. Base: tu consentimiento (art. 6.1.a RGPD).</li>
        <li><strong>Atender tus consultas</strong>. Base: interés legítimo / medidas precontractuales a petición tuya.</li>
      </ul>

      <h2>4. Google Analytics 4</h2>
      <p>
        Usamos Google Analytics 4, un servicio de Google Ireland Limited, para obtener estadísticas agregadas de uso. Está configurado con
        anonimización de IP. Google puede transferir datos a terceros países bajo las garantías que establece su propia documentación. Más
        información en la{" "}
        <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">política de privacidad de Google</a>. Puedes
        evitar la analítica con el{" "}
        <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">complemento de inhabilitación de Google Analytics</a>.
      </p>

      <h2>5. Google AdSense y cookies de terceros</h2>
      <p>
        Mostramos publicidad mediante Google AdSense. Google y sus socios publicitarios pueden utilizar cookies e identificadores para
        mostrar anuncios basados en tus visitas a este y otros sitios. Puedes gestionar la publicidad personalizada en{" "}
        <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">Configuración de anuncios de Google</a> y
        consultar cómo Google usa los datos en{" "}
        <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">policies.google.com/technologies/partner-sites</a>.
        Más información sobre las cookies en nuestra <Link href="/politica-cookies">Política de cookies</Link>.
      </p>

      <h2>6. Destinatarios</h2>
      <p>
        Los datos pueden ser comunicados a Google (analítica y publicidad) y a nuestro proveedor de alojamiento (Vercel Inc.), en calidad de
        encargados o responsables independientes según el caso. No vendemos tus datos.
      </p>

      <h2>7. Conservación</h2>
      <p>
        Los datos analíticos se conservan según los plazos configurados en Google Analytics. Las consultas por correo se conservan el tiempo
        necesario para atenderlas y cumplir obligaciones legales.
      </p>

      <h2>8. Tus derechos</h2>
      <p>
        Puedes ejercer los derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad, y retirar tu consentimiento en
        cualquier momento, escribiendo a <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a>. Si consideras que tus derechos no han sido
        atendidos, puedes reclamar ante la <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer">Agencia Española de Protección de Datos</a>.
      </p>

      <h2>9. Menores</h2>
      <p>El sitio no está dirigido a menores de 14 años ni recoge conscientemente sus datos.</p>

      <h2>10. Cambios</h2>
      <p>Podemos actualizar esta política. La fecha de última actualización figura al inicio de la página.</p>
    </LegalPage>
  );
}
