# Referenzen — Website Builder

Externe Quellen und Werkzeuge. **Keine Zugangsdaten hier** — die gehören in `.env`.

## MCP-Server (`.mcp.json`)

| Server | Wofür | Quelle |
|---|---|---|
| `shadcn` | Komponenten und fertige Blöcke aus der Registry ziehen | <https://ui.shadcn.com/docs/mcp> |
| `context7` | Aktuelle Bibliotheks-Doku — Next 16 und Tailwind v4 sind jünger als jeder Wissensstand | <https://context7.com/docs/clients/claude-code> |
| `chrome-devtools` | Konsole, Netzwerk, Performance-Traces am laufenden Browser | <https://github.com/ChromeDevTools/chrome-devtools-mcp> |
| `playwright` (global) | Screenshots, Klickstrecken, axe-Prüfung | <https://github.com/microsoft/playwright-mcp> |

Die drei projekt-lokalen Server brauchen eine einmalige Bestätigung beim Sitzungsstart.

**Bewusst nicht im Einsatz:** `refero` (Design-Referenzen fremder Seiten). Der Maßstab dieser
Werkstatt ist der eigene Mess-Anker in `CONTEXT.md`, nicht eine fremde Website — wer sich an
fremden Seiten misst, baut ihren Durchschnitt nach.

## Design-Doktrinen (liegen als Dateien in `doctrine/`)

| Datei | Herkunft | Warum als Datei statt als Skill |
|---|---|---|
| `taste.md` | [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) v2 „design-taste-frontend" | Skills triggern von selbst. Zwei Doktrinen gleichzeitig ergeben Matsch — als Datei lädt der Router genau eine. |
| `impeccable.md` | [pbakaus/impeccable](https://github.com/pbakaus/impeccable) v3.3.1, SKILL.md + `craft-floor.md` | dito |

`de-kalibrierung.md` und `budget.md` sind Arbeit dieser Werkstatt und überstimmen beide.

Beide Quell-Doktrinen sind hier **wortgleich als Datei** abgelegt, nicht nacherzählt. Lizenzen
und Copyright-Vermerke stehen in [THIRD-PARTY-LICENSES.md](THIRD-PARTY-LICENSES.md).

## Werkzeuge ohne Installation

- **impeccable-Detektor** — `npx impeccable detect .` 60 maschinelle Prüfregeln, läuft
  ohne Modell, kostet nur den Aufruf und die Befunde.

## Skills (projekt-lokal unter `.claude/skills/`)

Fünf von acht aus [emilkowalski/skills](https://github.com/emilkowalski/skills) — Autor von
Sonner und Vaul, die Animations-Skills sind die schärfsten im Feld:
`review-animations`, `improve-animations`, `find-animation-opportunities`,
`animation-vocabulary`, `prototype`.

**Bewusst weggelassen:** `apple-design` (zweite Ästhetik-Doktrin), `emil-design-eng`
(Pflicht-Werbesatz für den Kurs des Autors), `pick-ui-library` (erklärter Interessenkonflikt).

## Stack-Doku

- Next.js — <https://nextjs.org/docs>
- Tailwind v4, CSS-first mit `@theme` — <https://tailwindcss.com/docs>
- shadcn/ui — <https://ui.shadcn.com>
- Lenis (weiches Scrollen, Paketname ist `lenis`, **nicht** `@studio-freight/lenis`) —
  <https://github.com/darkroomengineering/lenis>
- GSAP ScrollTrigger — <https://gsap.com/docs/v3/Plugins/ScrollTrigger/>

## Rechtsgrundlagen (Deutschland)

- **BFSG** — Barrierefreiheitsstärkungsgesetz, gilt seit 28.06.2025. Maßstab EN 301 549 bzw.
  WCAG 2.1 AA. Ausnahme nur bei unter 10 Mitarbeitern **und** höchstens 2 Mio. € Umsatz, und
  nur für Dienstleistungen. <https://www.ihk.de/stuttgart/fuer-unternehmen/recht-und-steuern/it-recht/barrierefreie-webseiten-6200594>
- DSGVO — Einwilligung vor jedem Drittanbieter-Skript und vor jedem externen Hotlink.
- § 7 UWG — Double-Opt-In bei Newsletter-Anmeldung.

## Inspirations-Quellen

<!-- Wird beim ersten echten Projekt gefüllt — siehe Mess-Anker in CONTEXT.md. -->

Beim Auslieferungsstand leer, und das ist Absicht. Der Anker entsteht aus der Wahl zwischen
zwei **eigenen** Entwürfen desselben Briefings — je einer pro Doktrin — nicht aus fremden Seiten.
Wie das läuft, steht im Skill `prototype`.
