# Ladezeit-Budget

**Diese Datei überstimmt jede Doktrin.** Der Router liest sie **vor** der Doktrin.
Bei Widerspruch zwischen Doktrin und Budget gewinnt das Budget.

**Warum:** `doctrine/taste.md` schreibt ein eigenes Bild **pro Sektion** vor. Acht Vollbreite-Bilder
plus Scroll-Animation sind bei einer Marketing-Seite direkt gegen LCP gerichtet. Bei Marketing-Verkehr
ist Ladezeit nicht Kosmetik, sondern Abschlussquote und Ranking zugleich. Keine der geprüften
Design-Quellen kennt ein Budget — deshalb steht es hier.

---

## Rang der Zahlen — im Auslieferungszustand ein Tor

Die Werte unten sind **Freigabe-Tore**: Reißt eine Seite eine Grenze, ist sie nicht fertig.
Das ist der Zustand, in dem diese Werkstatt ausgeliefert wird.

**Ein Projekt darf die Tore zu Beobachtungswerten herabstufen** — Ladezeit gegen gestalterische
Qualität abzuwägen ist eine legitime Entscheidung der Auftraggeberseite, etwa wenn das
Bildmaterial *der* Inhalt ist und ein Wegrechnen keine schnellere Seite ergäbe, sondern keine
mehr. Aber nur unter drei Bedingungen, sonst verfällt das Budget schleichend:

1. **Die Entscheidung steht schriftlich** in einem ADR unter `decisions/`, mit Datum, wörtlichem
   Zitat und dem gemessenen Stand, auf den sie sich bezieht.
2. **Die Messpflicht bleibt.** Nachrangig heißt: nicht optimieren müssen. Es heißt nicht:
   nicht messen. Jede gerissene Grenze kommt mit ihrer **Ursache** nach `QA.md`.
3. **Der Rückweg steht im selben ADR** — die Ereignisse, bei denen die Tore wieder scharf sind.
   Bewährt haben sich: das erste zahlende Kundenprojekt, ein Messwert schlechter als der im ADR
   festgehaltene Stand, und widersprechende Felddaten (Search Console, CrUX) — echte Besucher
   schlagen jedes Laborprofil.

Wer diese Datei liest und die Zahlen unten als Tor durchsetzen will: **erst in `decisions/`
nachsehen, ob eine Herabstufung vorliegt.** Findet sich keine, sind es Tore.

## Die Messwerte

| Messwert | Grenze | Gemessen mit |
|---|---|---|
| LCP (größtes Element sichtbar) | **< 2,5 s** auf 4G-Mobile | Lighthouse CI, Mobile-Profil |
| TBT (Hauptthread blockiert) | **< 200 ms** | Lighthouse CI, `total-blocking-time` |
| CLS (Layout-Sprung) | **< 0,1** | Lighthouse CI |
| JavaScript gesamt | **< 190 KB** übertragen | Lighthouse CI, `resource-summary:script:size` |
| davon eigener Client-Code | **< 40 KB** | `npm run check:budget` |
| Lighthouse Performance | **≥ 90** mobil | Lighthouse CI |

Diese Zahlen sind **gemessen, nicht geraten** — wie, steht jeweils unten. Sie gelten als Tor,
solange kein ADR sie nach dem Verfahren oben herabstuft; auch dann bleibt genau diese Tabelle
der Maßstab.

**Warum hier TBT und nicht INP steht:** INP misst, wie schnell die Seite auf einen echten Klick
reagiert — das braucht echte Besucher und ist im Labor nicht messbar. Lighthouse liefert
stattdessen TBT: wie lange der Hauptthread blockiert war. Das ist das beste Ersatzmaß, und es ist
das, was `check:perf` tatsächlich prüft. Echtes INP kommt erst nach dem Start aus den Felddaten
(Search Console, CrUX) — und gehört dann in die `QA.md` der Seite nachgetragen.
Hier stand bis zum 28.07.2026 „INP, gemessen mit Lighthouse CI". Das war nicht einlösbar.

### Warum das JavaScript-Budget zweigeteilt ist

Hier stand bis zum 28.07.2026 „< 150 KB gzip". Das war eine runde Zahl, keine Messung — und sie
ist mit diesem Stack **grundsätzlich unerreichbar**. Gemessen am leeren Gerüst:

> Eine Seite aus `template/` **ohne eine einzige Client-Komponente** — kein Formular, keine
> Bewegung, nur Server-Komponenten — liefert **151 KB** JavaScript aus.
> Gemessen am 28.07.2026 mit Next 16.2.12, React 19.2.4, Lighthouse CI 0.15.1, Profil Mobil.

Diese 151 KB sind der **Rahmen-Boden**: React plus Next-Laufzeit, nicht beeinflussbar, außer man
wechselt den Stack. Ein Budget, das darunter liegt, misst nicht die eigene Arbeit, sondern nur
die Wahl des Frameworks — und meldet dauerhaft Rot, was ein Tor wertlos macht.

Deshalb gilt: **190 KB gesamt**, also rund 40 KB für alles Selbstgebaute. Das ist eng genug, dass
ein Fehlgriff sofort auffällt (Zod im Browser-Bündel wären allein +60 KB gewesen), und weit genug,
dass ein Formular plus ein, zwei bewegte Bausteine hineinpassen.

**Bei jedem Next-Upgrade den Boden neu messen** und die 190 KB nachziehen. Ein Budget, das aus
einer alten Messung stammt, ist wieder eine runde Zahl.

Damit das nicht am Vorsatz hängt, prüft `npm run check:budget` beides:

1. Steht in `template/budget-boden.json` noch die Version, mit der der Boden gemessen wurde?
   Passt sie nicht zu `package.json`, **bricht der Lauf ab** und verlangt die Nachmessung. Ein
   veralteter Boden kann so nicht still weiterwirken.
2. Liegt `Gesamtwert minus Boden` unter 40 KB? Das ist der Teil, den wir selbst verantworten.

Der Boden selbst wird von Hand gemessen — dafür wird das Formular vorübergehend aus
`app/page.tsx` genommen. Kein Skript soll das automatisch tun; wer den Boden ändert, soll es
merken. Die Anleitung steht in `budget-boden.json`.

---

## Bilder

- Jedes Sektionsbild über `next/image` mit gesetztem `sizes`. Format AVIF mit WebP-Rückfall.
- **Nur das Hero-Bild bekommt `priority`.** Alles darunter lädt verzögert.
- Höhe oder `aspect-ratio` immer reservieren — sonst CLS.

### Zwei Sorten Bild, zwei Regeln

Hier stand bis zum 28.07.2026 nur ein Satz: „Obergrenze 5 Vollbreite-Bilder pro Landingpage."
Die Regel ist richtig, aber sie zählt das Falsche. Sie zählt **Stück**, obwohl das, was LCP
kostet, **Bytes im ersten Sichtfeld** sind. Auf einer Galerieseite kollidiert das sofort: Ein
Raster mit sechzehn Vorschaubildern verstößt dem Wortlaut nach dagegen, dem Sinn nach nicht.

Gemessen am 28.07.2026 an sechzehn echten Vollseiten-Aufnahmen einer Galerieseite
(AVIF, `sharp` effort 4):

| | Breite | Schnitt | größte | Summe über 16 |
|---|---|---|---|---|
| Galerie-Vorschau | 520 px, q45 | **9 KB** | 14 KB | 149 KB |
| hohe Aufnahme | 1200 px, q40 | 148 KB | 346 KB | 2377 KB |

Der Faktor zwischen beiden ist **16**. Sie mit derselben Zahl zu regeln, wäre Willkür.
Deshalb ab jetzt zwei Kategorien:

**1. Vollbreite-Sektionsbild — unverändert höchstens 5 pro Seite.**
Ein großes Bild, das eine Sektion trägt und den Bildaufbau aufhält. Verlangt die Doktrin mehr,
wird zusammengestrichen. Ein Bild, das nur da ist, weil eine Regel „ein Bild pro Sektion" sagt,
trägt nichts und kostet LCP.

**2. Galerie-Vorschau — nicht nach Stück begrenzt, sondern nach Bytes.**
Kleine, gleichförmige Bilder in einem Raster, die zusammen einen Bestand zeigen. Für sie gilt:

- **je Vorschau höchstens 20 KB**,
- **im ersten Sichtfeld zusammen höchstens 150 KB**,
- alles darunter zwingend `loading="lazy"`,
- die Vollauflösung lädt **erst auf Anforderung**, nie mit der Seite.

Gemessen am umgesetzten Fall: sechs Kacheln im ersten Sichtfeld ≈ 52 KB — ein Drittel der
Grenze. Sechzehn Kacheln kosten in Summe 149 KB, aber davon liegt nur ein Bruchteil im ersten
Sichtfeld.

**Warum eine Byte-Grenze und keine höhere Stückzahl:** Eine Zahl wie „höchstens 12 Vorschauen"
wäre wieder geraten. Die Byte-Grenze misst das, was den Besucher tatsächlich Zeit kostet, und
sie hält auch dann, wenn jemand statt sechzehn Kacheln vierzig baut — dann muss er sie eben
kleiner rechnen. Das ist dieselbe Logik, mit der weiter oben aus „150 KB JavaScript" ein
gemessener Rahmen-Boden plus 40 KB Eigenanteil wurde.

**Die Grenze gilt nur für echte Galerien**, nicht als Hintertür für große Bilder. Wer ein
Sektionsbild auf 20 KB drückt und es „Vorschau" nennt, hat die Regel umgangen, nicht erfüllt.

## Keine externen Hotlinks in Produktion

`taste.md` verbietet Google-Fonts-Hotlinks (Z. 173 ff.), schreibt aber selbst Hotlinks vor:
`picsum.photos` (Z. 269, 626) und `cdn.simpleicons.org` (Z. 277). Das ist derselbe
Drittanbieter-Mechanismus mit Übertragung der Besucher-IP — technisch dieselbe Sache, die die Doktrin
an anderer Stelle untersagt, und in der EU zusätzlich ein Einwilligungsthema.

**Regel:**
- Icons über das npm-Paket `simple-icons` — taste bietet das selbst als Alternative an (Z. 277).
- `picsum.photos` nur in der Entwicklung. Vor Freigabe durch lokale Dateien ersetzt.
- Schriften self-hosted über `next/font`. Nie per `<link>`.
- Vor Freigabe: Netzwerk-Mitschnitt prüfen. **Null Anfragen an fremde Hosts** außer bewusst
  eingebundenen Diensten hinter Einwilligung.

## Schrift

Eine variable Schriftfamilie, self-hosted, `font-display: swap`. **Subsets `latin` UND
`latin-ext`, beide** — die deutschen Umlaute liegen im `latin`-Subset, nicht in `latin-ext`.
Begründung samt Messwerten in `de-kalibrierung.md` Abschnitt 4. Hier stand bis zum 28.07.2026
nur `latin-ext`; das kostete gemessen 152 ms LCP.

Zwei Familien nur mit Begründung — jede kostet einen render-blockierenden Ladevorgang. Deshalb
steht `single-font` des Detektors auf der Ignore-Liste (`decisions/001-detektor-kalibrierung.md`).

## Bewegung

- Scroll-Animation zuerst mit CSS scroll-driven animations oder `IntersectionObserver` lösen.
  GSAP + ScrollTrigger erst, wenn das nachweislich nicht reicht — nicht als Vorgabe.
- Lenis (`npm i lenis`) mit `autoRaf: false` an GSAPs Ticker hängen. Zwei getrennte Bildschleifen
  ruckeln.
- `prefers-reduced-motion` bricht jede Endlos-Animation, Parallaxe und Scroll-Übernahme ab.

## Video-Scroll (scroll-world)

Der gescrubbte KI-Film ist eine Ausnahme für einen einzelnen Abschnitt, **nie die Seitengrundlage**.
Wird er eingesetzt: eigene Messung vorher und nachher, Ergebnis in `QA.md`.

Bis zum 28.07.2026 stand hier: „Reißt er das Budget, fliegt er raus oder bekommt einen statischen
Rückfall." Der Rauswurf-Automatismus ist mit der Rang-Änderung oben entfallen — **die Messpflicht
vorher/nachher nicht.** Ein statischer Rückfall bleibt Pflicht, aber aus einem anderen Grund als
Ladezeit: ohne ihn ist der Abschnitt bei `prefers-reduced-motion` und ohne JavaScript leer.

Stand 29.07.2026: `scroll-world` ist als Skill installiert, aber **noch nie gelaufen** — die
Videoerzeugung braucht ein Backend, das auf diesem Rechner fehlt. Zustand und Kosten:
`decisions/002-scroll-world-installation.md`.

---

## Durchsetzung

`npm run check:perf` läuft Lighthouse CI gegen diese Werte und meldet Rot, wenn eine Grenze reißt.
**Das Skript bleibt auch beim Herabstufen unverändert** — ein Messgerät, das man beim Lockern
verstellt, ist danach kein Messgerät mehr. Was ein ADR ändern darf, ist die Folge eines roten
Laufs: Befund statt Stopp. Nie der gemessene Wert.

Das Ergebnis gehört unverändert in `QA.md`, samt gerissener Grenzen und ihrer Ursache. **Kein
„fertig" ohne diese Zahlen** — diese Regel steht auch in `AGENTS.md` und keine Herabstufung
berührt sie. Nachrangig heißt nicht ungemessen.
