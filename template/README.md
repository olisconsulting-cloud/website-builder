# Gerüst für deutschsprachige Marketing-Seiten

Dieser Ordner wird pro Auftrag nach `sites/kunde-name/` **kopiert**, nicht verändert. Er gibt
Struktur und Prüfbarkeit vor — **nie das Aussehen**. Alles, was zwei Seiten wie Geschwister
aussehen ließe, gehört nicht hierher.

Stack: Next.js 16 (App Router) · React 19 · Tailwind v4 (CSS-first) · shadcn/ui · TypeScript.
**Kein `tailwind.config.js`** — Tokens stehen im `@theme`-Block von `app/globals.css`.

## Loslegen

```bash
npm install
cp .env.example .env.local     # ausfüllen, echte Werte nie in Git
npm run dev                    # http://localhost:3000
```

## Was pro Kunde angefasst wird

| Datei | Was dort steht |
|---|---|
| `lib/site.ts` | Firmenname, Anschrift, Kontakt, Impressumsangaben — **die einzige Quelle** |
| `app/globals.css`, Block „MARKEN-EBENE" | Farben, Maße, Rhythmus, Schriftgrade |
| `app/layout.tsx`, `const schrift` | die Schriftfamilie |
| `app/page.tsx` | Reihenfolge und Inhalt der Abschnitte |
| die drei Rechtsseiten | Lücken füllen, dann prüfen lassen |

Alles andere sollte unangetastet bleiben. Wer `components/abschnitt.tsx` verändert, verändert
alle künftigen Seiten mit.

## Prüfen

```bash
npm run check:all        # Typen, Lint, Bau, Barrierefreiheit, Deutsch, Ladezeit
```

Einzeln:

| Befehl | Was gemessen wird |
|---|---|
| `check:types` | TypeScript ohne Ausgabe |
| `check:a11y` | axe-core über Playwright, WCAG 2.1 AA, zwei Breiten × vier Seiten |
| `check:deutsch` | Komposita und Versal-Umlaute bei 320, 390, 1440 px |
| `check:perf` | Lighthouse CI gegen `doctrine/budget.md` |
| `check:budget` | Gesamtwert minus Rahmen-Boden = eigener Client-Code, Grenze 40 KB |
| `check:formular` | die Strecke hinter dem Formular, Ende zu Ende |

`check:budget` bricht auch ab, wenn der in `budget-boden.json` gespeicherte Rahmen-Boden nicht
mehr zur installierten Next-Version passt. Dann muss er neu gemessen werden — die Anleitung steht
in derselben Datei. So kann ein Next-Upgrade das Budget nicht still aufweichen.

`check:formular` läuft **nicht** in `check:all`: Es braucht einen laufenden Server mit gesetztem
Empfänger und gehört von Hand vor jede Freigabe.

```bash
KONTAKT_EMPFAENGER=... npm run start:pruef
npm run check:formular
```

Die Prüfläufe nutzen **Port 3111**, nicht 3000. Grund: Läuft nebenher ein Entwicklungs-Server auf
3000, prüft das Tor klaglos einen alten Stand und meldet grün. Genau das ist hier einmal passiert.

Dazu, doktrin-unabhängig:

```bash
npx impeccable detect http://localhost:3111
```

Zwei Befunde sind auf einer frischen Kopie erwartet — siehe `decisions/001-detektor-kalibrierung.md`.

## Was schon eingebaut ist

- **Deutsche Kalibrierung**: `lang="de-DE"`, Trennung plus Netz, Reserve für Ä/Ö/Ü,
  Buchstabenabstand −0,04 em, Zeilenmaß 62 Zeichen.
- **Auffindbarkeit**: `generateMetadata`, Open Graph samt erzeugtem Vorschaubild, `sitemap.ts`,
  `robots.ts`, JSON-LD.
- **Formular**: React Hook Form im Browser, Zod auf dem Server, Honigtopf, Einwilligungsfeld,
  Erfolgs- und Fehlerpfad — funktioniert auch **ohne JavaScript**.
- **Rechtsschicht**: Impressum, Datenschutz, Barrierefreiheitserklärung als Vorlagen.
- **Weiches Scrollen** über CSS. Lenis liegt fertig verdrahtet in
  `components/sanftes-scrollen.tsx`, ist aber **nicht eingeschaltet** — es kostet rund 8 KB und
  ist laut `doctrine/budget.md` erst dran, wenn CSS nachweislich nicht reicht.

## Was bewusst fehlt

Ein fertiger Aufmacher, eine Farbwelt, eine Bildsprache. Das ist keine Lücke, sondern der Zweck:
Diese Entscheidungen trifft die Design-Doktrin pro Projekt, nicht die Vorlage.

Messwerte des Gerüsts: [QA.md](QA.md).
