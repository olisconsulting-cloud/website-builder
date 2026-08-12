# Website Builder — Werkstatt für deutschsprachige Marketing-Websites

@CONTEXT.md

Nachschlagewerk bei Bedarf: [REFERENCES.md](REFERENCES.md) — MCP-Server, Doktrin-Herkunft,
Stack-Doku, Rechtsgrundlagen. Bewusst kein Import, sonst dauerhaft im Kontext.

Hier entstehen Landingpages und Marketing-Seiten für Kunden — keine Dashboards, keine Web-Apps.
Der Ordner ist die Werkstatt: `template/` wird pro Auftrag nach `sites/kunde-name/` kopiert.

## Rahmen und Entscheidungen

- Stack: Next.js 16 (App Router) · React 19 · Tailwind v4 · shadcn/ui · TypeScript.
- Tailwind v4 ist CSS-first: Tokens stehen im `@theme`-Block von `app/globals.css`.
  **Kein `tailwind.config.js` anlegen** — das ist v3-Denke und bricht den Build-Pfad.
- `"use client"` nur an interaktiven Blättern. Marketing-Seiten sind überwiegend statisch.
- Hosting wird pro Kunde entschieden, das Gerüst bleibt deploy-neutral.

## Doktrin-Mechanik

- Genau EINE Design-Doktrin je Session. `sites/kunde-name/DOCTRINE.md` enthält ein Wort:
  `taste` oder `impeccable`. Der Router lädt genau diese eine Datei aus `doctrine/`.
- **Taucht eine zweite Doktrin im Kontext auf: abbrechen, nicht mischen.**
- `doctrine/de-kalibrierung.md` und `doctrine/budget.md` werden VOR der Doktrin gelesen und
  überstimmen sie bei Widerspruch. Kein Aushandeln.
- **Stillgelegt** in `.claude/settings.json`: `frontend-design`, `motion-design`,
  `ui-ux-pro-max`. Das sind global installierte Design-Skills, die von selbst triggern — jeder
  von ihnen ist eine dritte Doktrin im Kontext. Wer sie nicht installiert hat, lässt die
  Einträge trotzdem stehen; sie tun dann nichts.
- Der Detektor `npx impeccable detect` ist Messgerät, nicht Doktrin, und läuft immer.

## Zusammenarbeit

- Ein Auftraggeber, ein Modell als Sparringspartner — kein Ausführungsgehilfe. Widerspruch ist
  erwünscht, wenn er belegt ist.
- Bei dünnem Briefing: höchstens fünf Rückfragen. Alles Übrige wird angenommen und steht
  sichtbar in `BRIEFING.md` unter „Angenommen, nicht bestätigt".
- Nutzertexte werden vor dem Einbau auf Deutsch geprüft: Anglizismen, Nominalstil, Füllwörter,
  generische Modell-Phrasen. Wer den Skill `deutsche-copy-review` installiert hat, nimmt ihn;
  sonst gilt `doctrine/de-kalibrierung.md` §3 als Prüfliste.
- CONTEXT.md ist Living-Doc — wenn `last_updated` >30 Tage: "Aktueller Stand" review.
- Craft-Principles: siehe `decisions/000-craft-principles.md` — bei Konflikt mit einer Säule:
  Entscheidung anpassen, nicht Säulen.

## Dokument-Index

- `doctrine/` — die zwei Doktrinen plus die zwei Dateien, die sie überstimmen
- `template/` — das Next.js-Gerüst, wird pro Auftrag kopiert
- `sites/` — die einzelnen Websites, je mit eigener `DOCTRINE.md`
- `brand-kits/` — wiederverwendbare Token-Sätze je Kunde
- `decisions/` — Architekturentscheidungen, Vorlage in `decisions/TEMPLATE.md`
- `CLAUDE.local.md` — aktueller Fokus, volatil, nicht in Git (steht in `.gitignore`)

## IMPORTANT — Critical Rules

- Kein „fertig" ohne `QA.md` mit Messwerten. Gemessen schlägt gemeint.
- Keine externen Hotlinks in Produktion — Bilder, Icons und Schriften liegen lokal.
- DO NOT commit Geheimnisse — alles in `.env`, `.env` ist in `.gitignore`.

<!-- Die letzten beiden Regeln setzt .claude/hooks/guard.py deterministisch durch.
     Sie stehen hier nur noch als Begründung, nicht als alleiniger Wirkmechanismus. -->

