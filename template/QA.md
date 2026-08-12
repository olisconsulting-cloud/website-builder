# QA — Gerüst `template/`

**Stand:** 2026-07-28 · **Gemessen an:** Produktionsbau (`next build` + `next start -p 3111`)
**Umgebung:** Next 16.2.12 · React 19.2.4 · Tailwind 4 · Node 24.16.0 · Windows 11 ·
Messbrowser Edge 150.0.4078.99 (Chrome ist auf diesem Rechner nicht installiert)

Diese Datei ist zweierlei: der Nachweis, dass das Gerüst selbst die Tore besteht — und die
Vorlage für die `QA.md` jeder daraus gebauten Seite. **Ohne Zahlen gilt keine Seite als fertig.**

---

## 1. Bau und Typen

| Prüfung | Ergebnis |
|---|---|
| `npm run check:types` (`tsc --noEmit`) | sauber |
| `npm run lint` (ESLint) | sauber |
| `npm run build` | 9 Routen, alle statisch vorgerendert |

## 2. Ladezeit — `npm run check:perf`

Lighthouse CI, 3 Läufe, Profil Mobil, simulierte Drosselung (1638 kbit/s, 150 ms Umlaufzeit,
CPU-Faktor 4). Grenzen aus `doctrine/budget.md`.

| Messwert | Grenze | Gemessen | |
|---|---|---|---|
| LCP | < 2500 ms | **2490 ms** | hält |
| CLS | < 0,1 | **0** | hält |
| TBT (Ersatzmaß für INP) | < 200 ms | **17 ms** | hält |
| JavaScript gesamt | < 190 KB | **173,7 KB** | hält |
| davon eigener Client-Code | < 40 KB | **23,0 KB** (`check:budget`) | hält, 17 KB Reserve |
| Schriften | < 120 KB | **46 KB** | hält |
| Anfragen an Fremd-Hosts | 0 | **0** | hält |
| Lighthouse Leistung | ≥ 90 | **98** | hält |
| Lighthouse Barrierefreiheit | ≥ 95 | **100** | hält |
| Lighthouse SEO | ≥ 95 | **100** | hält |

**Zwei Zahlen, die zusammen gelesen werden müssen:** Ungedrosselt liegt LCP bei **99 ms** — die
Seite ist sofort da. Die 2490 ms sind das Ergebnis der simulierten Drosselung und damit ein
bewusst pessimistischer Wert. Beide gehören ins Protokoll: die eine sagt, wie schnell die Seite
ist, die andere, wie viel Reserve sie auf einer schlechten Mobilverbindung hat.

**Warum das JS-Budget 190 statt 150 KB ist:** Ein leeres Gerüst ohne eine einzige interaktive
Komponente liefert bereits **154 347 Bytes = 150,7 KB** aus — das ist der Rahmen-Boden von Next
und React, nicht beeinflussbar. Begründung in `doctrine/budget.md`.

Damit das nicht am Vorsatz hängt, rechnet `npm run check:budget` die Differenz und bricht in drei
Fällen ab. Alle drei sind geprüft, nicht behauptet:

| Fall | Verhalten | gemessen |
|---|---|---|
| Eigener Code über 40 KB | Abbruch mit Suchhinweis | ungetestet — nie eingetreten |
| Bericht älter als der Bau | Abbruch | **greift** (exit 1) |
| Next-Version weicht vom Boden ab | Abbruch, verlangt Nachmessung | **greift** (exit 1) |

Der dritte ist der wichtigste: Ohne ihn würde ein Next-Upgrade den Boden still veralten lassen
und das Budget schleichend aufweichen.

## 3. Barrierefreiheit — `npm run check:a11y`

axe-core über Playwright, WCAG 2.1 A + AA, zwei Breiten × vier Seiten:

> **8 Seitenaufrufe geprüft, 0 blockierende Verstöße.**
> (Handy 390 px mit `isMobile`/`hasTouch`, Desktop 1440 px; Startseite, Impressum,
> Datenschutz, Barrierefreiheitserklärung)

**Ehrliche Grenze:** Automatische Prüfung findet rund ein Drittel der Verstöße. Vor jeder
Freigabe zusätzlich von Hand: vollständige Bedienung mit der Tastatur, ein Durchgang mit
Screenreader, Prüfung bei 200 % Zoom. Diese drei sind hier **noch nicht** erfolgt.

## 3b. Kontrast von Bedienelementen — `npm run check:kontrast`

**Stand: 2026-07-31.** Eigenes Messgerät neben axe, weil axe genau diese Klasse nicht prüft:
den Kontrast der **Umrandung** und des **Fokusrings** eines Bedienelements (WCAG 1.4.11 und
2.4.7, je 3:1). Gemessen wird strukturell — jeder Knopf, jedes Feld, jeder Link —, nicht über
Klassennamen, damit die Prüfung das Kopieren in ein Kundenprojekt überlebt.

> **45 Werte gemessen, 0 Befunde.** (Text ≥ 4,5:1, Bedienelement ≥ 3:1)

Der erste Lauf am 31.07.2026 fand **15 Verstöße im Gerüst**, während axe 0 meldete und
Lighthouse Barrierefreiheit auf 100 stand. Ursache waren zwei unveränderte shadcn-Standardwerte:

| Token | vorher | gemessen | jetzt | gemessen |
| --- | --- | --- | --- | --- |
| `--input` (Feldrand) | `oklch(0.922 0 0)` | 1,26:1 | `oklch(0.65 0 0)` | **3,23:1** |
| `--ring` (Fokusring) | `oklch(0.708 0 0)` | 1,69:1 | `oklch(0.25 0 0)` | **3,19:1** |
| `--ring` dunkel | `oklch(0.556 0 0)` | 1,88:1 | `oklch(0.85 0 0)` | **3,8:1** |

`--border` bleibt unverändert hell: Es trägt Trennlinien, und die schulden keinen
Mindestkontrast. Der Fokusring braucht so dunkle Werte, weil shadcn ihn mit `ring-ring/50`
aufträgt — nur **halb deckend**. Wer den Token gegen den Grund rechnet statt gegen den
tatsächlich sichtbaren Mischwert, misst 2,58:1, wo 1,69:1 vorliegt.

**Ehrliche Grenze:** Das Tor kann nicht entscheiden, ob ein Rand ein Element *identifiziert*.
Es verlangt 3:1 für Schreibfelder und für Bedienelemente ohne Text und ohne Bildinhalt; bei
allem Übrigen weist es den Wert aus, ohne zu blockieren. Diese Ausnahmen stehen im Protokoll,
nicht im Verborgenen.

## 4. Deutsch-Härtetest — `npm run check:deutsch`

Drei Breiten (320, 390, 1440 px), echte Komposita und Versal-Umlaute:

> **0 Befunde.** Kein seitlicher Überlauf, kein gesprengter Kasten, alle Versal-Umlaute mit
> Reserve ≥ 0 px.

Drei echte Mängel hat dieser Test gefunden und behoben:

1. **Die Navigation brach bei 320 px nicht um** und schob die Seite auf 332 px. Deutsche
   Menüpunkte sind länger als englische. Behoben mit `flex-wrap`.
2. **Die `h1` hatte keine Größenstufe** und rendete in Browser-Standard 16 px. Bei
   `line-height: 1.05` ragte der Umlaut aus der Zeile. Behoben mit Größen-Token — derselbe
   Mangel, den der Detektor unabhängig als `flat-type-hierarchy` meldete.
3. **`hyphens: auto` wirkt in Edge 150 unter Windows nicht.** Gegenprobe: das Wort
   „Barrierefreiheitserklärung" blieb in einem 200-px-Kasten 418 px breit. Ohne Netz sprengte
   es die Seite auf 405 statt 320 px. Behoben mit `overflow-wrap: break-word` plus weichen
   Trennstellen. Der Befund steht jetzt in `doctrine/de-kalibrierung.md` §4 — die Doktrin
   behauptete vorher, `hyphens: auto` genüge.

## 5. Strecke hinter dem Formular — `npm run check:formular`

Mit gesetztem `KONTAKT_EMPFAENGER`, gegen den Produktionsbau:

| Fall | Erwartet | Gemessen |
|---|---|---|
| Gültig, mit JavaScript | Erfolgsmeldung, Zustellung | Erfolg, Zustellung protokolliert |
| Gültig, **ohne** JavaScript | Erfolgsmeldung, Zustellung | Erfolg, Zustellung protokolliert |
| Honigtopf gefüllt | Erfolg **melden**, NICHT zustellen | Erfolg gemeldet, keine Zustellung |
| Ungültige E-Mail | Fehler am Feld, kein HTTP-Fehler | „Diese Adresse sieht nicht vollständig aus." |

In keinem Fall ein HTTP-Fehler. Ohne gesetzten `KONTAKT_EMPFAENGER` verweigert der Server in
Produktion bewusst und meldet einen Fehler, statt die Anfrage still zu verlieren.

Zwei Fehler hat dieser Test gefunden, die der Bau **nicht** gemeldet hat:

1. **`formState.isValid` wurde erst im Klick-Handler gelesen.** React Hook Form überwacht ein
   Feld aus `formState` nur, wenn es beim Rendern gelesen wurde. Das Formular blockierte jeden
   Versuch stumm — es ging kein einziger POST hinaus.
2. **Die Server-Action-Datei exportierte ein Objekt.** Eine Datei mit `"use server"` darf
   ausschließlich asynchrone Funktionen exportieren. Jedes Absenden endete mit HTTP 500.
   `next build` meldete das nicht.

**Noch offen pro Projekt:** Der Versand ist nicht angebunden (`zustellen()` in
`app/actions/kontakt.ts` protokolliert nur). Vor der Freigabe echt versenden und **im Postfach
nachsehen** — ein grüner Lauf beweist nur, dass die Anfrage den Server erreicht.

## 6. Gestaltungs-Detektor — `npx impeccable detect http://localhost:3111`

> 2 Befunde: `overused-font` (Geist), `single-font`.

Beide erwartet, Begründung in `decisions/001-detektor-kalibrierung.md`. `single-font` steht auf
der Ignore-Liste (`doctrine/budget.md` schreibt eine Familie vor). `overused-font` bleibt
**bewusst aktiv**: Solange er feuert, trägt die Seite noch die Schrift der Vorlage — es hat also
noch niemand für diesen Kunden eine Schrift gewählt.

`flat-type-hierarchy` feuerte im ersten Lauf und ist nach dem Einbau der Größenstufen weg.

---

## Was für dieses Gerüst NICHT geprüft ist

Ehrlichkeit vor Vollständigkeit — diese Punkte sind offen und gehören in die `QA.md` der
jeweiligen Seite:

- **Tastatur und Screenreader von Hand.** Siehe Abschnitt 3.
- **Echter Mailversand.** Siehe Abschnitt 5.
- **Rechtstexte.** Impressum, Datenschutz und Barrierefreiheitserklärung sind Vorlagen mit
  Lücken, kein Rechtsrat. Vor Freigabe von jemandem prüfen lassen, der dafür haftet.
- **Der Detail-Beweis** aus `CONTEXT.md` — beim Gerüst sinnlos, es hat absichtlich keine Optik.
- **Bilder.** Das Gerüst liefert keine aus; die Grenze von 5 Vollbreite-Bildern ist damit
  ungeprüft.
- **Zwei Sicherheitshinweise in Entwickler-Abhängigkeiten** (`npm audit`: ESLint-Kette).
  Produktions-Abhängigkeiten: **0 Lücken**, erzwungen über `overrides` in `package.json`.
