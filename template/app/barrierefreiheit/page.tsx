import type { Metadata } from "next";
import { Abschnitt, AbschnittKopf } from "@/components/abschnitt";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Barrierefreiheitserklärung",
  description: `Stand der Barrierefreiheit von ${site.firmierung} und wie du Hindernisse meldest.`,
  alternates: { canonical: "/barrierefreiheit" },
};

/**
 * Barrierefreiheitserklärung nach dem Barrierefreiheitsstärkungsgesetz (BFSG),
 * anwendbar seit dem 28.06.2025. Maßstab ist EN 301 549 und damit WCAG 2.1 AA.
 *
 * Ausnahme nur für Kleinstunternehmen: unter 10 Beschäftigte UND höchstens
 * 2 Mio. Euro Jahresumsatz — und selbst dann nur für Dienstleistungen, nicht
 * für Produkte. Im Zweifel gilt das Gesetz.
 *
 * VORLAGE, KEIN RECHTSRAT. Zwei Felder müssen ehrlich ausgefüllt werden: der
 * Konformitätsstatus und die Liste der bekannten Hindernisse. Eine Erklärung,
 * die „vollständig barrierefrei“ behauptet, ohne dass geprüft wurde, ist
 * schlechter als gar keine — sie ist eine falsche Zusicherung.
 */
export default function Barrierefreiheit() {
  const b = site.barrierefreiheit;
  const stand = new Date(b.stand).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <Abschnitt ueberschriftId="bf-titel">
      <div className="flex flex-col gap-8">
        <AbschnittKopf
          als="h1"
          ueberschriftId="bf-titel"
          /* Weiche Trennstellen (U+00AD). Sie sind unsichtbar, bis der Umbruch
             sie braucht — und sie brechen an der Fuge des Kompositums, wo ein
             Mensch es auch täte. Das Netz `overflow-wrap: break-word` fängt
             das Wort sonst zwar auf, aber an beliebiger Stelle. */
          ueberschrift={"Barriere­freiheits­erklärung"}
          vorspann={`Diese Erklärung gilt für die Website von ${site.firmierung}. Stand: ${stand}.`}
        />

        <div className="lesetext flex flex-col gap-6">
          <section>
            <h2 className="display-de mb-2 text-lg">Stand der Vereinbarkeit</h2>
            <p>
              {b.konformitaet === "vollstaendig"
                ? "Diese Website ist mit den Anforderungen der EN 301 549 (WCAG 2.1, Stufe AA) vereinbar."
                : "Diese Website ist mit den Anforderungen der EN 301 549 (WCAG 2.1, Stufe AA) teilweise vereinbar. Die Abweichungen sind unten aufgeführt."}
            </p>
          </section>

          <section>
            <h2 className="display-de mb-2 text-lg">Nicht barrierefreie Inhalte</h2>
            {/* TODO pro Projekt: echte Befunde aus `npm run check:a11y` und aus
                der Prüfung mit Tastatur und Screenreader eintragen. Diese Liste
                leer zu lassen, obwohl oben „teilweise“ steht, ist ein Widerspruch. */}
            <ul className="list-disc pl-5">
              <li>Noch einzutragen — hier gehören die bekannten Hindernisse hin.</li>
            </ul>
          </section>

          <section>
            <h2 className="display-de mb-2 text-lg">Erstellung dieser Erklärung</h2>
            <p>
              Diese Erklärung wurde am {stand} erstellt. Grundlage war eine
              Selbstbewertung mit automatisierter Prüfung (axe-core) sowie eine
              Prüfung der Bedienung mit der Tastatur.
            </p>
          </section>

          <section>
            <h2 className="display-de mb-2 text-lg">Hindernisse melden</h2>
            <p>
              Ist dir eine Barriere aufgefallen oder brauchst du eine Information
              in einer anderen Form? Schreib an{" "}
              <a href={`mailto:${b.meldeadresse}`} className="underline underline-offset-4">
                {b.meldeadresse}
              </a>
              . Wir antworten innerhalb von einem Monat.
            </p>
          </section>

          <section>
            <h2 className="display-de mb-2 text-lg">Schlichtungsverfahren</h2>
            <p>
              Bleibt deine Meldung ohne zufriedenstellende Antwort, kannst du
              dich an die zuständige Marktüberwachungs&shy;behörde deines
              Bundeslandes wenden.
            </p>
          </section>
        </div>
      </div>
    </Abschnitt>
  );
}
