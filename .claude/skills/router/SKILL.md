---
name: router
description: Legt vor jedem Bau-, Design- oder Review-Schritt an einer Seite in sites/ fest, welche Design-Doktrin gilt, und lädt sie in der richtigen Reihenfolge. Nutze diesen Skill, bevor Layout, Typografie, Farbe, Abstände oder Bewegung einer Seite entstehen oder geprüft werden.
---

# Doktrin-Router

Der einzige Design-Skill in diesem Projekt, der von selbst starten darf. Er tut genau eines:
Er stellt her, dass **genau eine** Design-Doktrin gilt — und dass die beiden Überstimmungs-Dateien
vorher gelesen sind, nicht nachher.

Er entwirft nichts, schreibt keinen Code und bewertet kein Ergebnis. Er stellt den Lesepfad her.

## Wann dieser Skill läuft — und wann nicht

**Läuft**, bevor an einer Seite in `sites/` Optik entsteht oder geprüft wird: Layout, Typografie,
Farbe, Abstände, Bewegung, Bildsprache, Design-Abnahme.

**Läuft nicht** bei Briefing, Copy, SEO-Metadaten, Formular-Logik, Rechtstexten, Deploy oder
Planung. Diese Arbeit braucht keine Doktrin.

Der Grund ist Kontext, nicht Ordnung: `doctrine/taste.md` sind 87 KB (~22k Token). Wer sie in einer
Copy-Session lädt, bezahlt den vollen Preis für nichts und drückt die Trefferquote aller anderen
Regeln. **Im Zweifel nicht laden.** Nachladen ist billig, ein vollgelaufenes Fenster nicht.

## Lesepfad — die Reihenfolge ist die Mechanik

1. **`sites/<projekt>/DOCTRINE.md` lesen.** Enthält genau ein Wort: `taste` oder `impeccable`.
   - Datei fehlt → **eine** Rückfrage stellen (Vorschlag: `taste`, führt in der Bewertung auf 10 von
     13 Achsen), Antwort als eine Zeile in die Datei schreiben, weiter.
   - Datei enthält etwas anderes als eines der beiden Wörter → abbrechen und die Datei anzeigen.
     Nicht raten, nicht auf einen Standard zurückfallen.
2. **`doctrine/de-kalibrierung.md` lesen.** Deutsche Sprachkalibrierung.
3. **`doctrine/budget.md` lesen.** Ladezeit-Grenzen und Bildregeln.
4. **Genau eine Doktrin lesen** — `doctrine/taste.md` **oder** `doctrine/impeccable.md`, je nach
   Schritt 1. Nie beide.
5. **Eine Kopfzeile ausgeben**, damit die Festlegung sichtbar ist und nicht implizit bleibt:
   `Doktrin: taste · Kalibrierung DE + Budget aktiv · Projekt: sites/<projekt>`

Schritt 2 und 3 stehen **vor** Schritt 4, weil zuerst Gelesenes den Rahmen setzt, in den das
Spätere fällt. Umgekehrt liest man die Ausnahmen als Korrektur an einem schon gefassten Bild —
das hält schlechter.

## Vorrang bei Widerspruch

`de-kalibrierung.md` und `budget.md` **überstimmen jede Doktrin.** Kein Aushandeln, keine
Abwägung im Einzelfall.

Die drei Stellen, an denen das im Alltag greift:

| Doktrin sagt | Es gilt stattdessen | Quelle |
|---|---|---|
| `leading-none` im Display | `leading-[1.05]`, sobald ein Versal-Ä/Ö/Ü in der Zeile steht | de-kalibrierung §2 |
| `tracking-tighter` (−0,05em) | `tracking-[-0.04em]` | de-kalibrierung §3 |
| ein Bild pro Sektion | höchstens 5 Vollbreite-Bilder je Seite | budget, Abschnitt Bilder |

Weicht der Bau von der Doktrin ab, steht das mit Begründung in `sites/<projekt>/DESIGN.md` —
eine Zeile genügt. Stille Abweichung ist Schlamperei, benannte ist eine Entscheidung.

## Zweite Doktrin: abbrechen, nicht mischen

Taucht im Verlauf die andere Doktrin auf — weil jemand danach fragt oder ein Vergleich naheliegt —
wird **abgebrochen, nicht gemischt.** Zwei Geschmäcker im selben Fenster ergeben Matsch, nicht
doppelte Qualität.

Der Vergleich hat einen eigenen Ort: `sites/<projekt>/variants/<doktrin>/`, gleiches Briefing,
**frische Session**, danach nebeneinander rendern mit dem Skill `prototype`.

Das setzt `.claude/hooks/doctrine_lock.py` deterministisch durch: Der Read der zweiten Doktrin
wird geblockt, nicht nur abgeraten. Wenn der Hook blockt, ist das kein Fehler — es ist die Grenze.

## `ui-ux-pro-max` ist Datenlieferant, nicht Ratgeber

Nie als Skill triggern (46 KB, zweite Meinung im Fenster). Nur als Bash-Abfrage, wenn eine
konkrete Frage offen ist:

```bash
python ~/.claude/skills/ui-ux-pro-max/scripts/search.py "<frage>" --stack shadcn --max-results 2
```

Nützliche Domänen: `typography`, `color`, `landing`, `ux`. Was zurückkommt, ist **Material**, das
gegen die aktive Doktrin geprüft wird — kein Gegen-Urteil. Bei Widerspruch gewinnt die Doktrin.

`scripts/design_system.py` nicht benutzen: erzeugt `outline: none` ohne `:focus-visible`-Ersatz
und eine Tailwind-v3-Config.

## Was der Router nicht tut

- Keine Doktrin laden, wenn nur Text, Struktur oder Technik dran ist.
- Beide Doktrinen nebeneinander halten, um „das Beste aus beiden" zu nehmen.
- Eine Doktrin raten, wenn `DOCTRINE.md` unklar ist.
- `doctrine/taste.md` oder `doctrine/impeccable.md` verändern. Das sind unveränderte Fremdquellen;
  Abweichungen gehören in `de-kalibrierung.md` oder `budget.md`.
