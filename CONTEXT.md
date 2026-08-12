# Kontext — Website Builder

<!-- last_updated: 2026-08-12 -->

## Worum geht es

Eine Werkstatt, mit der eine hochwertige deutschsprachige Marketing-Website oder Landingpage
entsteht — schnell, aber nicht schnell aussehend. Der Ordner selbst ist kein Projekt: Er liefert
Gerüst, Design-Doktrin und Qualitäts-Tore. Gebaut wird pro Auftrag in `sites/kunde-name/`.

## Excellence-Anchor

Der Maßstab für jede Entscheidung hier. Wenn eine Entscheidung ihm widerspricht, ist die
Entscheidung falsch, nicht der Anker.

### Output-Vision

> Der Auftraggeber beschreibt in drei, vier Sätzen, worum es geht — grob, so wie er es einem
> Bekannten am Telefon erzählen würde. Das System stellt die wenigen Fragen zurück, die es
> wirklich braucht, nicht fünfzehn. Er holt einen Kaffee. Wenn er zurückkommt, steht eine Seite
> da, die er ohne eine einzige Änderung zeigen kann — und die erste Reaktion ist nicht „was hat
> das gekostet", sondern „wer hat das gemacht".

Die operative Forderung darin: **die Bringschuld liegt beim System, nicht beim Auftraggeber.**
Er liefert grob, das System fragt gezielt nach — höchstens fünf Fragen, abgeleitet aus dem, was
wirklich fehlt. Alles Übrige wird als sichtbare Annahme gesetzt, nicht erfragt.

### Mess-Anker

**Beim Auslieferungsstand leer — und das ist kein Mangel, sondern die erste Aufgabe.**

Ein Mess-Anker ist eine **eigene, fertig gebaute Seite**, an der die nächste gemessen wird.
Keine fremde Website, kein Moodboard, kein Adjektiv. Wie er entsteht:

1. Ein echtes Briefing nehmen, das gebaut werden soll.
2. Denselben Auftrag **zweimal** bauen — je einmal pro Doktrin (`taste`, `impeccable`), in
   **getrennten Sitzungen**, mit einer gemeinsamen `AUFTRAG.md`, die außer der Doktrin-Zeile
   alles gleich hält. Dafür ist der Skill `prototype` da.
3. Beide nebeneinanderstellen und **eine** wählen. Die Wahl ist der Anker.
4. Hier eintragen, was an ihr der Maßstab ist — nicht „sieht gut aus", sondern prüfbare Sätze.

Vier Fragen, die einen brauchbaren Anker beschreiben. Sie sind der Grund, warum diese
Werkstatt nicht Seiten baut, die wie Geschwister aussehen:

- **Gibt es ein Merkmal, das ein Messwert ist?** Das stärkste Gestaltungsdetail kommt aus den
  Daten des Gegenstands, nicht aus dem Formenschatz. Etwas, das man nur bauen kann, wenn man
  *diesen* Inhalt hat.
- **Fehlt das Kachelraster?** Die Form je Eintrag sollte einem Merkmal in den Daten folgen,
  nicht einer Schablone.
- **Ist die Seite ohne JavaScript vollständig?** Zustand in der URL, Filter als gewöhnliche
  Verweise, wenige klar benannte Client-Inseln.
- **Ist Bewegung ein autorisiertes Moment?** Eines, an die Daten gekoppelt — sonst nichts.

### Detail-Beweis

> Jemandem die Seite drei Sekunden lang zeigen und wieder wegnehmen. Danach kann er beides:
> sagen, **was die Firma macht** — und **ein Gestaltungsdetail benennen, das ihm so noch nicht
> begegnet ist**.

Der Proband darf die Seite vorher nie gesehen haben, und in der Frage wird nicht nachgeholfen.
Die Antwort kommt **wörtlich** in die `AUDIT.md` der Seite, auch wenn sie unangenehm ist.

**Bei der Auswertung aufpassen:** Sagt der Proband „ein Formular", „eine Umfrage" oder
„irgendwas mit Beratung", ist die erste Hälfte gerissen — dann zurück in den Bau, nicht in der
Frage nachhelfen. Besteht die zweite Hälfte nicht, fehlt „das eine Merkmal" aus `DESIGN.md`.

## Mitwirkende

- **Auftraggeber** — entscheidet Design-Richtung und Freigabe. Liefert grob, korrigiert Annahmen.
- **Das Modell** — baut, prüft, fragt nach. Sparringspartner, nicht Ausführungsgehilfe.
- Endkunden sehen nur das Ergebnis, nie die Werkstatt.

## Erfolgskriterien

1. Der Detail-Beweis besteht — nicht nur bei der ersten Seite, sondern wiederholt.
2. `QA.md` liegt bei jeder Seite vor und trägt alle Messwerte aus `doctrine/budget.md` — samt
   gerissener Grenzen und ihrer Ursache.
3. Zwei Seiten aus dieser Werkstatt sind nicht als Geschwister erkennbar.
4. Der Auftraggeber muss nach dem Briefing nichts nacharbeiten, um die Seite zeigen zu können.

## Aktueller Stand

<!-- Living-Doc: Was hier steht, ist der Stand DIESER Werkstatt-Kopie, nicht die Geschichte des
     Ursprungs-Repos. Beim ersten eigenen Projekt überschreiben. Wenn `last_updated` oben mehr
     als 30 Tage her ist: diesen Abschnitt durchgehen. -->

**Auslieferungszustand.** `template/` besteht alle Tore mit Messwerten — die Zahlen stehen in
`template/QA.md` und sind am leeren Gerüst gemessen, nicht an einer echten Seite. `sites/` ist
leer, der Mess-Anker oben ist ungefüllt.

Die nächsten drei Schritte, in dieser Reihenfolge:

1. `template/` einmal installieren und `npm run check:all` laufen lassen. Was hier rot meldet,
   meldet später bei jeder Seite rot.
2. Das erste echte Briefing bauen — Skill `website`, sieben Stufen.
3. Den Mess-Anker füllen, sobald zwei Entwürfe nebeneinanderstehen.

### Vier Messungen, die Annahmen widerlegt haben

Sie stehen hier, weil sie sonst beim nächsten Mal neu bezahlt werden. Alle vier sind gemessen,
nicht überlegt:

- **Ein JavaScript-Budget unter 151 KB ist mit diesem Stack unerreichbar.** Ein leeres Gerüst
  ohne eine einzige Client-Komponente liefert so viel aus. Ein Budget darunter misst nicht die
  eigene Arbeit, sondern die Wahl des Frameworks. Deshalb `doctrine/budget.md`: 190 KB gesamt,
  davon 40 KB eigener Code.
- **`hyphens: auto` wirkt in Edge nicht.** Deutsche Komposita brechen dort ungetrennt. Wer
  Silbentrennung braucht, prüft sie im Zielbrowser, statt sie zu setzen.
- **Das Schrift-Subset `latin-ext` trägt die deutschen Umlaute nicht** — `latin` tut es. Beide
  Subsets behalten, sonst fehlen Ä, Ö, Ü in genau der Schrift, die man ausgewählt hat.
- **Die Schriftdatei ist ein LCP-Faktor, nicht nur die Bandbreite.** Bei `font-display: swap`
  wird der größte Textblock zweimal gezeichnet, und LCP ist der zweite Vorgang. Gemessen an
  identischem Rest: Source Serif 4 (91 KB) → 2784 ms, Lora (57 KB) → 2479 ms. Der
  Netzwerkverlauf war beide Male nach 32 ms fertig — es ist nicht die Leitung.
