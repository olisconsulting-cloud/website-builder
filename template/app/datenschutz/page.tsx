import type { Metadata } from "next";
import { Abschnitt, AbschnittKopf } from "@/components/abschnitt";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Datenschutzerklärung",
  description: `Wie ${site.firmierung} mit personenbezogenen Daten umgeht.`,
  robots: { index: false, follow: true },
  alternates: { canonical: "/datenschutz" },
};

/**
 * Gerüst einer Datenschutzerklärung nach Art. 13 DSGVO.
 *
 * VORLAGE, KEIN RECHTSRAT — und bewusst UNVOLLSTÄNDIG. Was hier stehen muss,
 * hängt daran, was die Seite tatsächlich tut: Hosting, Formular, Analyse,
 * Karten, Schriften, Videos. Eine abgeschriebene Erklärung, die Dienste
 * beschreibt, die es nicht gibt — oder welche verschweigt, die es gibt — ist
 * abmahnfähig.
 *
 * Vorgehen: erst den Netzwerk-Mitschnitt der fertigen Seite ansehen, dann
 * jeden fremden Aufruf hier erklären. Was im Mitschnitt nicht auftaucht,
 * gehört auch nicht in den Text.
 */
export default function Datenschutz() {
  const dsb = site.rechtliches.datenschutzbeauftragter;

  return (
    <Abschnitt ueberschriftId="ds-titel">
      <div className="flex flex-col gap-8">
        <AbschnittKopf
          als="h1"
          ueberschriftId="ds-titel"
          ueberschrift="Datenschutzerklärung"
          vorspann="Was wir mit deinen Daten tun, warum wir es dürfen und wie lange wir sie behalten."
        />

        <div className="lesetext flex flex-col gap-6">
          <section>
            <h2 className="display-de mb-2 text-lg">Verantwortliche Stelle</h2>
            <p>
              {site.firmierung}
              <br />
              {site.kontakt.strasse}
              <br />
              {site.kontakt.plz} {site.kontakt.ort}
              <br />
              <a href={`mailto:${site.kontakt.email}`} className="underline underline-offset-4">
                {site.kontakt.email}
              </a>
            </p>
          </section>

          {dsb ? (
            <section>
              <h2 className="display-de mb-2 text-lg">Datenschutzbeauftragter</h2>
              <p>{dsb}</p>
            </section>
          ) : null}

          <section>
            <h2 className="display-de mb-2 text-lg">Aufruf dieser Website</h2>
            <p>
              Beim Aufruf übermittelt dein Browser technische Daten an unseren
              Server (IP-Adresse, Zeitpunkt, aufgerufene Seite, Browsertyp).
              Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO — unser berechtigtes
              Interesse am sicheren Betrieb.
            </p>
            {/* TODO pro Projekt: Hoster benennen, Speicherdauer der Server-Logs
                eintragen, Auftragsverarbeitungsvertrag erwähnen. */}
            <p className="mt-2 text-sm text-muted-foreground">
              Noch einzutragen: Hoster, Speicherdauer, Auftragsverarbeitung.
            </p>
          </section>

          <section>
            <h2 className="display-de mb-2 text-lg">Kontaktformular</h2>
            <p>
              Sendest du uns eine Anfrage, verarbeiten wir Name, E-Mail-Adresse,
              optional Telefonnummer und deine Nachricht, um zu antworten.
              Rechtsgrundlage ist deine Einwilligung nach Art. 6 Abs. 1 lit. a
              DSGVO. Du kannst sie jederzeit widerrufen; die Verarbeitung bis
              zum Widerruf bleibt davon unberührt.
            </p>
            {/* TODO pro Projekt: Löschfrist eintragen und einhalten. */}
            <p className="mt-2 text-sm text-muted-foreground">
              Noch einzutragen: Löschfrist der Anfragen.
            </p>
          </section>

          <section>
            <h2 className="display-de mb-2 text-lg">Schriften und externe Dienste</h2>
            <p>
              Die verwendete Schrift wird von unserem eigenen Server
              ausgeliefert. Es findet dabei keine Verbindung zu Dritten statt
              und es wird keine IP-Adresse an Dritte übertragen.
            </p>
            {/* Diese Aussage stimmt nur, solange sie stimmt. Vor der Freigabe
                den Netzwerk-Mitschnitt prüfen (doctrine/budget.md). */}
          </section>

          <section>
            <h2 className="display-de mb-2 text-lg">Deine Rechte</h2>
            <p>
              Du hast das Recht auf Auskunft (Art. 15), Berichtigung (Art. 16),
              Löschung (Art. 17), Einschränkung der Verarbeitung (Art. 18),
              Datenübertragbarkeit (Art. 20) und Widerspruch (Art. 21). Außerdem
              kannst du dich bei einer Datenschutz&shy;aufsichts&shy;behörde
              beschweren.
            </p>
          </section>
        </div>
      </div>
    </Abschnitt>
  );
}
