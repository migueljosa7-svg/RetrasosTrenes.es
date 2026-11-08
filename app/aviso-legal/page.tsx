import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { LEGAL } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Aviso Legal y Condiciones de Uso | RetrasosTrenes.es",
  description: "Información legal del titular, propiedad intelectual, limitación de responsabilidad sobre los datos de transporte y condiciones de uso.",
  alternates: { canonical: "/aviso-legal" },
};

export default function AvisoLegal() {
  return (
    <LegalPage title="Aviso legal y condiciones de uso" slug="aviso-legal">
      <h2>1. Datos del titular</h2>
      <p>
        En cumplimiento de la Ley 34/2002 de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE), se informa
        de que este sitio web es titularidad de:
      </p>
      <ul>
        <li>Titular: {LEGAL.owner}</li>
        <li>NIF/CIF: {LEGAL.taxId}</li>
        <li>Domicilio: {LEGAL.address}</li>
        <li>Correo electrónico: {LEGAL.email}</li>
      </ul>

      <h2>2. Naturaleza del servicio</h2>
      <p>
        RetrasosTrenes.es es un sitio informativo independiente que muestra el estado del servicio de trenes de Cercanías, Rodalies y
        Media Distancia en España. No está afiliado con Renfe, Adif, el Ministerio de Transportes ni ninguna otra operadora o
        administración. Los nombres de líneas, estaciones y operadores se usan únicamente con fines informativos e identificativos.
      </p>

      <h2>3. Limitación de responsabilidad sobre los datos</h2>
      <p>
        La información sobre retrasos, incidencias, horarios y vías procede de fuentes de datos abiertos y puede contener errores, omisiones o
        retrasos de actualización. No garantizamos su exactitud, integridad ni disponibilidad continua. <strong>Antes de viajar, consulta
        siempre los canales oficiales del operador.</strong>
      </p>
      <p>
        El titular no responderá de los daños o perjuicios (pérdida de conexiones, de citas, costes de transporte alternativo u otros) derivados
        de decisiones tomadas a partir de la información publicada, ni de interrupciones técnicas del sitio o de servicios de terceros enlazados.
      </p>

      <h2>4. Condiciones de uso</h2>
      <ul>
        <li>El acceso al sitio es gratuito y atribuye la condición de usuario.</li>
        <li>El usuario se compromete a hacer un uso lícito del sitio y a no realizar acciones que puedan dañarlo o sobrecargarlo (por ejemplo, extracción masiva automatizada).</li>
        <li>El titular puede modificar, suspender o retirar contenidos y funcionalidades en cualquier momento y sin previo aviso.</li>
      </ul>

      <h2>5. Propiedad intelectual e industrial</h2>
      <p>
        El diseño, el código fuente, los textos originales y la estructura del sitio son titularidad del titular o se utilizan con la debida
        licencia. Queda prohibida su reproducción, distribución o transformación sin autorización expresa, salvo lo permitido por la ley. Los datos
        de terceros conservan las condiciones de reutilización de su fuente original. Las marcas citadas pertenecen a sus respectivos propietarios.
      </p>

      <h2>6. Enlaces</h2>
      <p>
        Este sitio puede enlazar a páginas de terceros. No controlamos su contenido y no asumimos responsabilidad por él.
      </p>

      <h2>7. Legislación aplicable y jurisdicción</h2>
      <p>
        Estas condiciones se rigen por la legislación española. Para cualquier controversia, las partes se someten a los juzgados y tribunales
        que resulten competentes conforme a la normativa vigente, sin perjuicio de los derechos que correspondan a los consumidores.
      </p>

      <h2>8. Contacto</h2>
      <p>
        Para cualquier consulta o para comunicar un error en los datos, escribe a <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a>.
      </p>
    </LegalPage>
  );
}
