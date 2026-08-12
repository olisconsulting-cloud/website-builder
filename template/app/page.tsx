import { Abschnitt, AbschnittKopf, Spalte } from "@/components/abschnitt";
import { KontaktFormular } from "@/components/kontakt-formular";
import { JsonLd } from "@/components/json-ld";
import { organisation } from "@/lib/jsonld";
import { site } from "@/lib/site";

/**
 * Die Startseite des Gerüsts.
 *
 * Sie zeigt die REIHENFOLGE und die AUSZEICHNUNG einer Landingpage — nicht
 * ihr Aussehen. Es gibt hier bewusst keinen fertigen Aufmacher: Sobald das
 * Gerüst eine Optik mitbringt, sehen alle Seiten daraus wie Geschwister aus,
 * und genau dagegen ist die ganze Konstruktion gebaut.
 *
 * Die Platzhaltertexte sind zugleich der deutsche Härtetest: echte Komposita
 * („Barrierefreiheitserklärung“, „Datenschutzbeauftragter“) und Versal-Umlaute
 * („ÜBER UNS“, „Öffnungszeiten“). Hält das Layout DAMIT, hält es auch mit
 * echter Kundensprache.
 */
export default function Startseite() {
  return (
    <>
      <JsonLd daten={organisation()} />

      {/* --- Aufmacher ---------------------------------------------------- */}
      <Abschnitt ueberschriftId="aufmacher">
        <div className="flex flex-col gap-6">
          <AbschnittKopf
            als="h1"
            ueberschriftId="aufmacher"
            augenbraue="Platzhalter — Augenbraue"
            ueberschrift="Überschrift mit Ärger, Öl und Übermut"
            vorspann="Höchstens 150 Zeichen und drei Zeilen: der eine Satz, der sagt, was die Firma tut und für wen. Kein Slogan, kein Versprechen."
          />
          <div className="flex flex-wrap gap-3">
            {/* Primär-CTA: höchstens 2 Wörter UND 18 Zeichen (de-kalibrierung §1). */}
            <a
              href="#kontakt"
              className="inline-flex items-center rounded-md bg-primary px-5 py-2.5 text-primary-foreground"
            >
              Termin anfragen
            </a>
            <a
              href="#leistungen"
              className="inline-flex items-center rounded-md border px-5 py-2.5"
            >
              Leistungen
            </a>
          </div>
        </div>
      </Abschnitt>

      {/* --- Leistungen --------------------------------------------------- */}
      <Abschnitt id="leistungen" ueberschriftId="leistungen-titel">
        <div className="flex flex-col gap-8">
          <AbschnittKopf
            ueberschriftId="leistungen-titel"
            ueberschrift="Leistungen"
            vorspann="Drei bis fünf Punkte. Mehr merkt sich niemand nach dem ersten Besuch."
          />
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              "Grundstücksverkehrsgenehmigung",
              "Datenschutzbeauftragter",
              "Öffentlichkeitsarbeit",
            ].map((titel) => (
              // `min-w-0` ist im Deutschen Pflicht, nicht Kosmetik: Ein
              // Raster-Feld schrumpft von sich aus nie unter sein längstes
              // Wort. „Grundstücksverkehrsgenehmigung" hielt die Spalte
              // dadurch auf 340 px auf — bei 320 px Bildbreite. Erst `min-w-0`
              // erlaubt das Schrumpfen, danach greift der Umbruch.
              <li key={titel} className="flex min-w-0 flex-col gap-2 rounded-lg border p-6">
                <h3 className="display-de text-lg">{titel}</h3>
                <p className="text-sm text-muted-foreground">
                  Ein bis zwei Sätze, was dahintersteckt — in der Sprache der
                  Kundin, nicht in der des Fachs.
                </p>
              </li>
            ))}
          </ul>
        </div>
      </Abschnitt>

      {/* --- Über uns ----------------------------------------------------- */}
      <Abschnitt id="ueber-uns" ueberschriftId="ueber-uns-titel" eng>
        <div className="flex flex-col gap-6">
          {/* Versaler Umlaut in Großschreibung — der härteste Fall für die
              Zeilenhöhe. Ohne `display-de` würden die Punkte auf Ü beschnitten. */}
          <h2 id="ueber-uns-titel" className="display-de text-sm tracking-widest uppercase">
            Über uns
          </h2>
          <p className="lesetext">
            Ein Absatz Fließtext mit echten deutschen Komposita, damit der
            Zeilenumbruch geprüft ist: Barriere&shy;freiheits&shy;erklärung,
            Grundstücks&shy;verkehrs&shy;genehmigung,
            Arbeits&shy;unfähigkeits&shy;bescheinigung. Trennen übernimmt der
            Browser über <code>hyphens: auto</code>; die weichen Trennstellen
            oben sind für die Wörter, bei denen er falsch läge.
          </p>
        </div>
      </Abschnitt>

      {/* --- Kontakt ------------------------------------------------------ */}
      <Abschnitt id="kontakt" ueberschriftId="kontakt-titel">
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="flex flex-col gap-6">
            <AbschnittKopf
              ueberschriftId="kontakt-titel"
              ueberschrift="Kontakt"
              vorspann="Schreib uns, was du brauchst. Wir antworten persönlich."
            />
            <dl className="flex flex-col gap-3 text-sm">
              <div>
                <dt className="text-muted-foreground">Öffnungszeiten</dt>
                <dd>Montag bis Donnerstag, 9 bis 17 Uhr</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Anschrift</dt>
                <dd>
                  {site.kontakt.strasse}, {site.kontakt.plz} {site.kontakt.ort}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">E-Mail</dt>
                <dd>
                  <a
                    href={`mailto:${site.kontakt.email}`}
                    className="underline underline-offset-4"
                  >
                    {site.kontakt.email}
                  </a>
                </dd>
              </div>
            </dl>
          </div>

          <Spalte className="px-0 sm:px-0">
            <KontaktFormular />
          </Spalte>
        </div>
      </Abschnitt>
    </>
  );
}
