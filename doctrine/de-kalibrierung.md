# Sprachkalibrierung Deutsch

**Diese Datei überstimmt jede Doktrin.** Der Router liest sie **vor** `taste.md` bzw. `impeccable.md`.
Bei Widerspruch gewinnt diese Datei. Kein Aushandeln.

**Warum:** `doctrine/taste.md` enthält null Treffer zu Deutsch, Lokalisierung oder i18n (geprüft am
Original, 87.253 Bytes). Seine tragenden Regeln sind an englischer Wortlänge geeicht. Deutsche Wörter
sind rund 30 % länger, Komposita sprengen die Zeile. Ohne diese Datei brechen die Regeln, die die
Doktrin am stärksten machen, genau dort, wo sie greifen sollen.

Alle Zeilenangaben unten beziehen sich auf `doctrine/taste.md`.

---

## 1. Längengrenzen — Wörter zählen gilt nicht

| Regel | Original (englisch) | **Deutsch stattdessen** |
|---|---|---|
| Hero-Untertext (Z. 236, 242) | „max 20 words AND max 3-4 lines" | **max 150 Zeichen** und max 3 Zeilen |
| Hero-Headline (Z. 236, 241) | „max 2 lines on desktop" | unverändert 2 Zeilen — aber gegen das **längste echte Wort des Briefings** getestet |
| Primär-CTA (Z. 226) | „3 words max, ideally 1-2" | **max 2 Wörter und max 18 Zeichen** |
| Fließtext-Maß (Z. 167) | `max-w-[65ch]` | `max-w-[62ch]` — deutsche Zeilen laufen bei gleicher ch-Zahl optisch länger |

**Die Zeilenzahl ist die bindende Grenze, nicht die Wortzahl.** Wenn eine Regel beides nennt, zählt
im Deutschen die Zeile. Wortzahlen sind ein englischer Näherungswert für Zeilen und im Deutschen
schlicht falsch.

**Pflichttest vor Freigabe:** Jedes Text-Element mit den echten deutschen Wörtern des Briefings bei
320 px, 390 px und Desktop prüfen. Nicht mit Platzhaltern. „Barrierefreiheitserklärung" (27 Zeichen)
und „Datenschutzbeauftragter" (23 Zeichen) sind der Härtetest.

---

## 2. Umlaute brauchen Kopfraum — die Lücke, die taste nicht kennt

`taste.md` Z. 166 setzt als Display-Vorgabe `leading-none`. Z. 183 kennt genau einen Fall, in dem das
klippt: kursive Unterlängen (`y g j p q`).

**Im Deutschen gibt es einen zweiten Fall, den die Doktrin nicht abdeckt:** Großbuchstaben mit
diakritischen Zeichen — **Ä Ö Ü** — ragen nach oben aus der Versalhöhe heraus. Bei `leading-none`
werden die Punkte abgeschnitten. Das trifft jede Headline mit „Über", „Änderung", „Öffnungszeiten",
und es trifft besonders `uppercase`-Schreibweise.

**Regel:** Enthält eine Display-Zeile ein großgeschriebenes Ä, Ö oder Ü, gilt `leading-[1.05]` als
Untergrenze statt `leading-none`. Bei `uppercase` zusätzlich `pt-1` Reserve am umschließenden Element.
Jede Headline mit Versal-Umlaut vor Freigabe einzeln ansehen.

---

## 3. Buchstabenabstand — Kollision sauber auflösen

`taste.md` Z. 166 gibt `tracking-tighter` vor. Das sind **−0,05em** und unterschreitet
`doctrine/impeccable.md`s belegte Untergrenze „tracking floor −0.04em".

**Auflösung:** Deutscher Standard ist `tracking-[-0.04em]`. Das erfüllt beide Doktrinen und liegt
optisch dicht an tastes Absicht. Damit entfällt die Detektor-Regel `extreme-negative-tracking` aus der
Ignore-Liste — die Kollision wird behoben statt stummgeschaltet.

Zusätzlich: Enger Buchstabenabstand verschlechtert die Lesbarkeit langer Komposita überproportional.
Ab 18 Zeichen Wortlänge im Display `tracking-normal`.

---

## 4. Umbruch bei Komposita

Pflicht auf jedem Textcontainer:

```css
hyphens: auto;
```

Das setzt `<html lang="de">` voraus — ohne die Sprachauszeichnung trennt der Browser nicht.
Beides ist nicht optional.

**Aber `hyphens: auto` allein trägt nicht.** Gemessen am 28.07.2026 in Edge 150.0.4078.99
(Chromium) unter Windows, bei korrekt gesetztem `lang="de-DE"` und berechnetem `hyphens: auto`:

> Gegenprobe mit einem frischen Element, 200 px breit, 36 px Schrift:
> „Barrierefreiheitserklärung" blieb **418 px** breit — der Browser trennte **überhaupt nicht**.
> Mit `overflow-wrap: break-word` brach dasselbe Wort sofort auf 200 px.
> Ohne Netz sprengte das eine Wort die Seite auf 405 statt 320 px.

Chromium braucht für jede Sprache eine Trenn-Datenbank. Ist sie nicht vorhanden, scheitert
`hyphens: auto` **still** — kein Fehler, keine Warnung, nur ein zerstörtes Layout auf dem Handy.
Ein deutsches Projekt darf sich darauf also nicht verlassen.

Pflicht ist daher **beides**:

- `hyphens: auto` — trennt sinnvoll, wo die Datenbank da ist.
- `overflow-wrap: break-word` als Netz — greift nur bei Wörtern, die sonst **gar nicht** passen.
- Bei Wörtern, die trotzdem hässlich brechen, `&shy;` an der sinnvollen Trennstelle setzen:
  `Barriere&shy;freiheits&shy;erklärung`. Das ist die einzige Fassung, die auch schön aussieht.
- `overflow-wrap: anywhere` bleibt **verboten** — es zerlegt auch Wörter, die noch gepasst hätten,
  und verfälscht die Mindestbreite von Rastern. `break-word` tut das nicht; die beiden sind nicht
  dasselbe.

Zusätzlich ein Punkt, der hier schon einmal **falsch** stand und den die Messung umgedreht hat:

- **Schrift-Subsets: `latin` UND `latin-ext`, beide.** Nicht „`latin-ext` statt `latin`".
  Gemessen am 28.07.2026 an der ausgelieferten Seite:

  | Zeichen | liegt im Subset |
  |---|---|
  | Ä Ö Ü ä ö ü ß (U+00C4–U+00DF) | **`latin`** |
  | die deutschen Anführungszeichen „ “ (U+201E, U+201C) | **`latin`** |
  | das große ẞ (U+1E9E), Š Ł ő fremder Namen | **`latin-ext`** |

  `next/font` lädt genau die aufgeführten Subsets **vorab**. Steht nur `latin-ext` da, wird
  ausgerechnet die Datei mit den normalen Buchstaben nicht vorgeladen, kommt als zweiter
  Ladevorgang nach, und der Text wird zweimal gezeichnet: gemessen FCP 1059 statt 758 ms,
  LCP 2714 statt 2562 ms.

Geprüft wird das von `template/scripts/check-deutsch.mjs` bei 320, 390 und 1440 px.

---

## 5. Typografie im Deutschen

- **Gedankenstrich erlaubt.** `taste.md` verbietet den Em-Dash. Diese Regel ist auf Englisch geeicht.
  Im Deutschen ist der Halbgeviertstrich (–, en dash) mit Leerzeichen der normale Gedankenstrich und
  orthografisch korrekt. Die Detektor-Regel `em-dash-overuse` gehört bei deutscher Copy in die
  Ignore-Liste.
- **Anführungszeichen:** „unten-oben" (U+201E, U+201C). Nie "gerade" und nie englisch “oben-oben”.
- **Zahlen:** Dezimalkomma, Tausenderpunkt, geschütztes Leerzeichen vor Einheiten (`12 000 €`, `2,5 s`).
- **Copy-Hoheit liegt bei `deutsche-copy-review`**, nicht bei der Doktrin. Bei Widerspruch zwischen
  einer Design-Doktrin und dem Copy-Review über Formulierung gewinnt das Copy-Review.

---

## 6. Vor dem Bau zu klären

Ein- oder mehrsprachig? Die Antwort ändert die Architektur (Routing, `hreflang`, Metadaten) und ist
nachträglich teuer. Wenn nicht im Briefing beantwortet: **nachfragen, nicht annehmen.**
