import type { Metadata } from "next";
import { Abschnitt, AbschnittKopf } from "@/components/abschnitt";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Impressum",
  description: `Anbieterkennzeichnung nach § 5 DDG für ${site.firmierung}.`,
  robots: { index: false, follow: true },
  alternates: { canonical: "/impressum" },
};

/**
 * Anbieterkennzeichnung nach § 5 DDG (seit 14.05.2024 Nachfolger des § 5 TMG).
 *
 * VORLAGE, KEIN RECHTSRAT. Die Pflichtangaben unterscheiden sich je nach
 * Rechtsform, Kammerzugehörigkeit und Tätigkeit. Vor der Freigabe von jemandem
 * prüfen lassen, der dafür haftet.
 */
export default function Impressum() {
  const r = site.rechtliches;

  return (
    <Abschnitt ueberschriftId="impressum-titel">
      <div className="flex flex-col gap-8">
        <AbschnittKopf als="h1" ueberschriftId="impressum-titel" ueberschrift="Impressum" />

        <div className="lesetext flex flex-col gap-6">
          <section>
            <h2 className="display-de mb-2 text-lg">Angaben gemäß § 5 DDG</h2>
            <p>
              {site.firmierung}
              <br />
              {site.kontakt.strasse}
              <br />
              {site.kontakt.plz} {site.kontakt.ort}
            </p>
          </section>

          {r.vertretung ? (
            <section>
              <h2 className="display-de mb-2 text-lg">Vertreten durch</h2>
              <p>{r.vertretung}</p>
            </section>
          ) : null}

          <section>
            <h2 className="display-de mb-2 text-lg">Kontakt</h2>
            <p>
              Telefon: {site.kontakt.telefon}
              <br />
              E-Mail:{" "}
              <a href={`mailto:${site.kontakt.email}`} className="underline underline-offset-4">
                {site.kontakt.email}
              </a>
            </p>
          </section>

          {r.registergericht ? (
            <section>
              <h2 className="display-de mb-2 text-lg">Registereintrag</h2>
              <p>
                Registergericht: {r.registergericht}
                <br />
                Registernummer: {r.registernummer}
              </p>
            </section>
          ) : null}

          {r.umsatzsteuerId ? (
            <section>
              <h2 className="display-de mb-2 text-lg">Umsatzsteuer-Identifikationsnummer</h2>
              <p>Gemäß § 27 a Umsatzsteuergesetz: {r.umsatzsteuerId}</p>
            </section>
          ) : null}

          {r.aufsichtsbehoerde ? (
            <section>
              <h2 className="display-de mb-2 text-lg">Aufsichtsbehörde</h2>
              <p>{r.aufsichtsbehoerde}</p>
            </section>
          ) : null}

          <section>
            <h2 className="display-de mb-2 text-lg">Streitbeilegung</h2>
            <p>
              Wir sind nicht bereit und nicht verpflichtet, an
              Streitbeilegungs&shy;verfahren vor einer
              Verbraucher&shy;schlichtungs&shy;stelle teilzunehmen.
            </p>
          </section>
        </div>
      </div>
    </Abschnitt>
  );
}
