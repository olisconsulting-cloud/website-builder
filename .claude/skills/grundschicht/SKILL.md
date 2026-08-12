---
name: grundschicht
description: Prüft und füllt die Schicht, die keine Design-Doktrin abdeckt — Auffindbarkeit, die Strecke hinter dem Formular, deutsche Rechtspflichten und Ladezeit. Nutze diesen Skill beim Bau einer Seite in sites/, bevor sie zur Abnahme geht.
disable-model-invocation: true
---

# Grundschicht

Fünf Design-Quellen wurden auf 13 Achsen kartiert. **Vier Achsen deckt keine davon ab** —
und sie entscheiden darüber, ob eine Marketing-Seite ihren Zweck erfüllt:

1. **Auffindbarkeit** — eine schöne Seite, die niemand findet.
2. **Die Strecke hinter dem Formular** — Anfragen, die still verloren gehen.
3. **Deutsche Rechtspflichten** — bei Kundenprojekten ein Haftungsthema.
4. **Ladezeit als Budget** — siehe `doctrine/budget.md`.

Das Gerüst `template/` bringt für alle vier die Mechanik mit. Dieser Skill sagt, was pro
Projekt trotzdem noch **entschieden und gefüllt** werden muss — genau das, was eine Vorlage
nicht wissen kann.

---

## 1. Auffindbarkeit

Im Gerüst vorhanden: `generateMetadata`, Open Graph mit erzeugtem Vorschaubild, `sitemap.ts`,
`robots.ts`, JSON-LD-Bausteine.

Pro Projekt zu tun:

- **`NEXT_PUBLIC_SITE_URL` setzen.** Ohne diesen Wert zeigen Canonical, Sitemap und Open Graph
  auf `localhost`. Das ist der häufigste stille Fehler beim Start.
- **`lib/site.ts` füllen** — `beschreibung` wird zur Meta-Description. Höchstens 155 Zeichen,
  ein Satz, was die Firma tut. Kein Werbetext.
- **Jede neue Unterseite in `app/sitemap.ts` eintragen.** Eine Sitemap, die drei von acht Seiten
  kennt, ist schlechter als keine: Sie erklärt die anderen fünf für unwichtig.
- **JSON-LD passend wählen.** `organisation()` immer. Bei Ladengeschäft oder Praxis zusätzlich
  `LocalBusiness` mit Öffnungszeiten. Bei einer Fragen-Sektion `fragenUndAntworten()`.
  **Nur auszeichnen, was auf der Seite sichtbar steht** — erfundene Bewertungen oder Preise
  verstoßen gegen Googles Richtlinien.
- **Vorschaubild ansehen.** `app/opengraph-image.tsx` erzeugt einen schmucklosen Rückfall.
  Pro Kunde ersetzen — dieses Bild ist oft der erste Eindruck in WhatsApp und LinkedIn.
- **Rechtsseiten auf `noindex`** lassen (steht bereits so im Gerüst), die
  Barrierefreiheitserklärung dagegen **nicht** — sie soll auffindbar sein.

## 2. Die Strecke hinter dem Formular

Im Gerüst vorhanden: Prüfung im Browser und auf dem Server, Honigtopf, Einwilligungsfeld,
Erfolgs- und Fehlerpfad, Absenden auch ohne JavaScript.

Pro Projekt zu tun:

- **`zustellen()` in `app/actions/kontakt.ts` anbinden.** Sie protokolliert bisher nur.
  Zugangsdaten ausschließlich über `process.env`.
- **`KONTAKT_EMPFAENGER` setzen.** Fehlt der Wert, verweigert der Server in Produktion bewusst,
  statt Anfragen still zu schlucken. Das ist Absicht — nicht durch ein stilles `return` ersetzen.
- **Eine echte Anfrage abschicken und im Postfach nachsehen.** `npm run check:formular` beweist,
  dass die Anfrage den Server erreicht — nicht, dass die Mail ankommt. Auch den Spam-Ordner
  prüfen.
- **Den Fehlerfall erzwingen** (Empfänger falsch setzen) und ansehen, was der Besucher liest.
  Er muss einen zweiten Weg genannt bekommen.
- **Bei Newsletter zusätzlich Double-Opt-In.** § 7 UWG und DSGVO — eine Anmeldung ohne
  Bestätigungsklick ist abmahnfähig.
- **Löschfrist festlegen und einhalten.** Sie steht in der Datenschutzerklärung; wer sie dort
  behauptet und nicht umsetzt, hat ein größeres Problem als eine fehlende Angabe.

## 3. Rechtsschicht Deutschland

Im Gerüst vorhanden: drei Vorlagen mit markierten Lücken.

**Vorlagen sind kein Rechtsrat.** Vor der Freigabe von jemandem prüfen lassen, der dafür haftet.

- **Impressum** (§ 5 DDG): Pflichtangaben hängen an Rechtsform, Kammer und Tätigkeit.
  `lib/site.ts` → `rechtliches` füllen; leere Felder fallen automatisch weg.
- **Datenschutzerklärung** (Art. 13 DSGVO): **Erst den Netzwerk-Mitschnitt der fertigen Seite
  ansehen, dann schreiben.** Jeder fremde Aufruf muss erklärt sein — und was im Mitschnitt nicht
  auftaucht, gehört auch nicht in den Text. Eine abgeschriebene Erklärung, die Dienste
  beschreibt, die es nicht gibt, ist so angreifbar wie eine, die welche verschweigt.
- **Barrierefreiheitserklärung** (BFSG seit 28.06.2025, Maßstab EN 301 549 / WCAG 2.1 AA):
  Ausnahme nur bei **unter 10 Beschäftigten UND höchstens 2 Mio. Euro Umsatz**, und nur für
  Dienstleistungen. Im Zweifel gilt das Gesetz.
  Zwei Felder ehrlich ausfüllen: der Konformitätsstatus und die Liste der bekannten Hindernisse.
  „Vollständig barrierefrei" ohne Prüfung ist eine falsche Zusicherung — schlechter als
  „teilweise" mit ehrlicher Liste.
- **Einwilligung vor jedem Drittanbieter-Skript.** Ohne Skripte Dritter braucht die Seite kein
  Einwilligungsfenster — das ist der bessere Weg, nicht der faule.

## 4. Ladezeit

Grenzen und Begründung: `doctrine/budget.md`. Gemessen mit `npm run check:perf`.

Pro Projekt zu beachten:

- **Höchstens 5 Vollbreite-Bilder.** Verlangt die Doktrin mehr, wird zusammengestrichen.
- **Nur das Bild im Aufmacher bekommt `priority`.** Alles darunter lädt verzögert.
- **Höhe oder `aspect-ratio` immer reservieren**, sonst springt das Layout.
- **Bilder lokal.** Keine fremden Hosts — der Guard-Hook blockt sie beim Schreiben.
- **Bild-Herkunft und Rechte dokumentieren.** Wer das Bild gemacht hat, unter welcher Lizenz,
  wie lange sie gilt. Keine Design-Quelle erwähnt das; teuer wird es trotzdem.
- **Wird Lenis oder GSAP eingeschaltet: vorher und nachher messen**, Ergebnis in `QA.md`.
  Reißt die Bewegung das Budget, fliegt sie raus oder bekommt einen statischen Rückfall.

---

## Abschluss-Frage

Bevor die Seite zur Abnahme geht, eine Zeile in `QA.md` zu jedem der vier Punkte:
**Was ist geprüft, und was ist bewusst offen?** Ein offener Punkt, der benannt ist, ist eine
Entscheidung. Ein offener Punkt, der nicht benannt ist, ist ein Fehler mit Verzögerung.
