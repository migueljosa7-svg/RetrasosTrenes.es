import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Política de Cookies | RetrasosTrenes.es",
  description: "Qué cookies analíticas y publicitarias usamos en RetrasosTrenes.es, para qué sirven y cómo puedes desactivarlas.",
  alternates: { canonical: "/politica-cookies" },
};

const rows = [
  { name: "_ga, _ga_*", provider: "Google Analytics 4", type: "Analítica", purpose: "Distinguir usuarios y medir el uso del sitio.", duration: "Hasta 2 años" },
  { name: "IDE, DSID y similares", provider: "Google (DoubleClick / AdSense)", type: "Publicitaria", purpose: "Mostrar y medir anuncios, y limitar su frecuencia.", duration: "Hasta 13 meses" },
  { name: "__gads, __gpi", provider: "Google AdSense", type: "Publicitaria", purpose: "Seleccionar anuncios y medir su rendimiento.", duration: "Hasta 13 meses" },
  { name: "rt-consent", provider: "RetrasosTrenes.es (localStorage)", type: "Técnica", purpose: "Guardar tu elección sobre cookies. Analíticas y publicitarias no se cargan hasta que aceptas.", duration: "Hasta que lo borres" },
  { name: "rt-pwa-dismissed", provider: "RetrasosTrenes.es (localStorage)", type: "Técnica", purpose: "Recordar que cerraste el aviso de instalación.", duration: "Hasta que lo borres" },
];

export default function PoliticaCookies() {
  return (
    <LegalPage title="Política de cookies" slug="politica-cookies">
      <h2>1. Qué son las cookies</h2>
      <p>
        Las cookies son pequeños archivos que un sitio guarda en tu dispositivo para recordar información sobre tu visita. Este sitio
        también puede usar tecnologías similares, como el almacenamiento local del navegador.
      </p>

      <h2>2. Cookies que utilizamos</h2>
      <div className="mb-3 overflow-x-auto rounded-xl border border-neutral-800">
        <table className="w-full min-w-[34rem] text-left text-xs">
          <thead className="bg-neutral-900 text-neutral-400">
            <tr>
              {["Cookie", "Titular", "Tipo", "Finalidad", "Duración"].map((h) => (
                <th key={h} className="px-3 py-2 font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.name} className="border-t border-neutral-800">
                <td className="px-3 py-2 font-mono text-neutral-200">{r.name}</td>
                <td className="px-3 py-2">{r.provider}</td>
                <td className="px-3 py-2">{r.type}</td>
                <td className="px-3 py-2">{r.purpose}</td>
                <td className="px-3 py-2">{r.duration}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>Los nombres y duraciones de las cookies de Google pueden cambiar; los valores indicados son orientativos.</p>

      <h2>3. Cookies analíticas</h2>
      <p>
        Nos permiten contar visitas y ver qué páginas se consultan más, para mejorar el servicio. Usamos Google Analytics 4 con la IP anonimizada.
      </p>

      <h2>4. Cookies publicitarias</h2>
      <p>
        Google AdSense y sus socios pueden usar cookies para mostrar anuncios relevantes según tu navegación. Puedes revisar y desactivar la
        personalización en <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">adssettings.google.com</a>.
      </p>

      <h2>5. Cómo desactivar o eliminar cookies</h2>
      <p>Puedes bloquear o borrar las cookies desde la configuración de tu navegador:</p>
      <ul>
        <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">Google Chrome</a></li>
        <li><a href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias" target="_blank" rel="noopener noreferrer">Mozilla Firefox</a></li>
        <li><a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer">Safari</a></li>
        <li><a href="https://support.microsoft.com/es-es/microsoft-edge" target="_blank" rel="noopener noreferrer">Microsoft Edge</a></li>
      </ul>
      <p>Desactivar las cookies publicitarias no elimina los anuncios, pero estos serán menos relevantes.</p>

      <h2>6. Más información</h2>
      <p>
        Consulta nuestra <Link href="/politica-privacidad">Política de privacidad</Link> para saber cómo tratamos tus datos y cómo ejercer tus derechos.
      </p>
    </LegalPage>
  );
}
