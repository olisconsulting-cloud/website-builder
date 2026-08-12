# ADR-001: Kalibrierung des impeccable-Detektors

**Status:** Accepted
**Datum:** 2026-07-28

## Context

`npx impeccable detect` läuft doktrin-unabhängig als Messgerät. Vor dem ersten Einsatz musste
geklärt werden, welche seiner Regeln mit `doctrine/taste.md` oder `doctrine/budget.md` kollidieren
— und welche schlicht recht haben.

Der Plan hatte fünf Kollisionen **vermutet**: `overused-font`, `hero-eyebrow-chip`,
`italic-serif-display`, `em-dash-overuse`, `marquee`, dazu `extreme-negative-tracking`.

Gemessen wurde am gebauten Gerüst (`template/`, Next 16.2.12, Produktionsbau, Detektor 3.3.1
gegen `http://localhost:3111`). Ergebnis des ersten Laufs — **drei** Befunde, nicht sechs:

| Regel | Befund | Bewertung |
|---|---|---|
| `overused-font` | Geist, 100 % des Textes | **berechtigt** |
| `single-font` | nur eine Familie | kollidiert mit `budget.md` |
| `flat-type-hierarchy` | 14/16/18 px, Verhältnis 1,3 : 1 | **berechtigt** |

Von den vermuteten Kollisionen trat **keine einzige** ein. `em-dash-overuse` feuerte nicht, weil
im Text keine Geviertstriche stehen; `hero-eyebrow-chip`, `italic-serif-display` und `marquee`
setzen Gestaltungsmuster voraus, die das Gerüst bewusst nicht mitbringt.
`extreme-negative-tracking` feuerte nicht, weil `de-kalibrierung.md` §3 die Kollision bereits an
der Wurzel aufgelöst hat (`tracking-[-0.04em]` statt `tracking-tighter`).

`flat-type-hierarchy` wurde daraufhin **behoben statt stummgeschaltet**: Das Gerüst bekam
Größenstufen (`--text-display-1/2/3`, Verhältnis über 1,25). Im zweiten Lauf war der Befund weg.
Derselbe Mangel war unabhängig davon im Deutsch-Härtetest aufgefallen — die `h1` rendete in
Browser-Standard 16 px, wodurch der Versal-Umlaut aus seiner Zeile ragte. Zwei Messgeräte, ein
Befund.

## Decision

**Die Ignore-Liste enthält genau eine Regel: `single-font`.**

Begründung: `doctrine/budget.md` schreibt eine variable Schriftfamilie vor, weil jede weitere
Familie einen render-blockierenden Ladevorgang kostet. Die Überstimmungs-Datei gewinnt gegen den
Detektor. Wird in einem Projekt bewusst ein zweites Schriftpaar eingesetzt, entfällt der Befund
ohnehin von selbst.

**`overused-font` bleibt ausdrücklich aktiv.** Es ist kein Fehlalarm, sondern eine nützliche
Nebenwirkung: Geist ist die Standardschrift des shadcn-Vorlagensatzes und damit ein Platzhalter.
Solange die Regel feuert, hat noch niemand eine Schrift für diesen Kunden **gewählt**. Der
Detektor wird damit zur Frage „Ist hier eigentlich schon gestaltet worden?" — und die soll bei
jedem neuen Projekt gestellt werden.

Verworfene Alternative: die Regel abschalten, weil `taste.md` Geist selbst empfiehlt. Das hätte
den einzigen automatischen Hinweis darauf beseitigt, dass eine Seite noch die Vorlagen-Optik
trägt — genau die Fehlerart, gegen die diese Werkstatt gebaut ist (Craft-Principle 5).

## Consequences

**Leichter:** Der Detektor läuft ohne Rauschen. Zwei Befunde auf einer frischen Kopie des
Gerüsts sind der erwartete Zustand und bedeuten „Marke fehlt noch", nicht „Fehler".

**Schwerer:** Jedes Projekt startet mit zwei roten Meldungen. Wer sie gewohnheitsmäßig übergeht,
verliert ihren Wert. Deshalb gehört in `QA.md` jeder Seite eine Zeile, warum die verbliebenen
Befunde dort in Ordnung sind — oder eben nicht.

**Zu beachten:** Die Liste ist an einem Gerüst ohne Marke gemessen. Sobald die ersten echten
Seiten stehen, kann der Detektor Regeln melden, die hier mangels Gestaltung gar nicht auslösen
konnten (`hero-eyebrow-chip`, `italic-serif-display`, `marquee`). Diese ADR ist dann fortzuschreiben
— **mit einer Messung, nicht mit einer Vermutung.**
