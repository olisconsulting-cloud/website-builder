---
name: website
description: Baut eine komplette deutschsprachige Marketing-Website oder Landingpage in sieben Stufen — von der groben Beschreibung des Auftraggebers bis zur ausgelieferten Seite.
disable-model-invocation: true
---

# Ablauf: eine Seite bauen

Sieben Stufen. Jede endet mit einer prüfbaren Datei in `sites/kunde-name/`. Drei davon sind
**Tore**, keine Formalitäten: Ohne freigegebenes `DESIGN.md` wird nicht gebaut, ohne `QA.md`
mit Zahlen gilt nichts als fertig, und ohne ausdrueckliche Freigabe geht nichts live.

Die Bringschuld liegt beim System. Der Auftraggeber liefert grob — das Verdichten passiert
hier, nicht in seinem Kopf.

| # | Stufe | Ergebnis |
|---|---|---|
| 1 | Briefing | `BRIEFING.md` |
| 2 | Design-Richtung | `DESIGN.md` — Tor |
| 3 | Copy | `COPY.md` |
| 4 | Bauen | lauffähige Seite |
| 5 | Qualitäts-Tor | `QA.md` — Tor |
| 6 | Design-Abnahme | `AUDIT.md` |
| 7 | Ausliefern | Live-Adresse — Tor |

---

## Stufe 1 — Briefing: höchstens fünf Fragen

**Kein Fragebogen.** Erst lesen, was der Auftraggeber gesagt hat, dann prüfen, was davon die
Gestaltung wirklich ändert. Nur diese Lücken werden gefragt — höchstens fünf, oft weniger.

Kandidaten, aus denen die Lücken gewählt werden:

- **Für wen?** Wer soll die Seite lesen, und was weiß diese Person schon?
- **Was soll passieren?** Anruf, Formular, Termin, Download — genau eine Haupthandlung.
- **Was unterscheidet die Firma?** Ein Satz, den ein Wettbewerber nicht schreiben könnte.
- **Welche Tonlage?** Wie spricht die Firma mit Kunden — förmlich, direkt, warm, knapp?
- **Wie viel Seite?** Eine Landingpage oder mehrere Unterseiten?

**Eine Frage ist Pflicht, wenn sie nicht schon beantwortet ist: ein- oder mehrsprachig.**
Sie ändert Routing, `hreflang` und Metadaten und ist nachträglich teuer
(`doctrine/de-kalibrierung.md`, letzter Abschnitt).

Alles Übrige wird **angenommen, nicht erfragt**. Jede Annahme steht sichtbar in `BRIEFING.md`
unter „Angenommen, nicht bestätigt". Der Auftraggeber korrigiert, was falsch ist — das ist
billiger, als vorab fünfzehn Fragen zu beantworten.

Zusätzlich klären, ohne zu fragen (aus dem Material ableiten oder als Annahme setzen):
Bildmaterial vorhanden? Logo vorhanden? Bestehende Texte? Domain?

## Stufe 2 — Design-Richtung (Tor)

1. `sites/kunde-name/DOCTRINE.md` anlegen — **ein Wort**: `taste` oder `impeccable`.
2. Den Skill `router` starten. Er lädt die Überstimmungs-Dateien und genau eine Doktrin.
3. `DESIGN.md` als Vertrag schreiben: Farbwelt, Schrift-Paar, Raster, Bewegung — und
   **„das eine Merkmal"**: das Gestaltungsdetail, an dem man diese Seite wiedererkennt.

**Ist die Richtung unklar:** beide Doktrinen als echte Entwürfe bauen und nebeneinanderstellen
(Skill `prototype`) — mehr als zwei gibt es nicht. Der Maßstab, an dem der Gewinner gemessen
wird, ist der Mess-Anker in `CONTEXT.md`; er ist gesetzt und wird nicht neu ausgehandelt.

Ohne Freigabe des Auftraggebers zu `DESIGN.md` beginnt Stufe 4 nicht.

## Stufe 3 — Copy zuerst

Alle Texte fertig schreiben, **bevor** Code entsteht. Layout, das um echten Text herum wächst,
hält; Layout, in das Text nachträglich hineingefüllt wird, bricht — im Deutschen besonders.

Dann durch den Skill `deutsche-copy-review`. **Die Copy-Hoheit liegt dort, nicht bei der
Design-Doktrin.** Widerspricht die Doktrin dem Copy-Review über eine Formulierung, gewinnt das
Copy-Review.

Längen gegen `doctrine/de-kalibrierung.md` §1 prüfen: Hero-Untertext höchstens 150 Zeichen
**und höchstens 3 Zeilen**, Primär-CTA höchstens 2 Wörter und 18 Zeichen.

## Stufe 4 — Bauen

1. `template/` nach `sites/kunde-name/` kopieren — **ohne** `node_modules` und `.next`.
   **`QA.md` wird geleert, nicht mitgenommen.** Eine mitkopierte QA trägt die Zahlen des
   Gerüsts und sieht aus wie eine Messung dieser Seite — genau so ist das schon passiert.
   Übrig bleibt der Kopf der Vorlage, kein einziger Wert.
2. `lib/site.ts` ausfüllen — das ist die einzige Quelle für Firmenangaben.
3. Marken-Ebene in `app/globals.css` setzen: Farben, Maße, Schriftgrade.
4. Schrift in `app/layout.tsx` tauschen. **Beide Subsets behalten** (`latin` und `latin-ext`).
5. Abschnitte in `app/page.tsx` nach `DESIGN.md` bauen. Komponenten aus `shadcn` über den
   MCP-Server holen, nicht abtippen.
6. Skill `grundschicht` durchgehen — was der Vorlage fehlt, wird dort projektspezifisch gefüllt.

**Nicht `components/abschnitt.tsx` verändern**, um eine Optik zu erzwingen. Wer das Gerüst
umbaut, baut die nächste Seite mit um.

## Stufe 5 — Qualitäts-Tor

### A. Erst prüfen, wo gemessen wird

Port 3111 ist eine Falle, und sie ist zweimal zugeschnappt: einmal lag dort der Server einer
**anderen Seite**, einmal ein **älterer Bau derselben Seite**, der richtiges HTML und eine
21 Byte große, leere Stilvorlage lieferte. Beide Male meldete jede Prüfung „OK".

```bash
powershell -Command "Get-NetTCPConnection -LocalPort 3111 -State Listen"
# belegt? Dann beenden — `pkill` gibt es in Git Bash auf diesem Rechner NICHT:
powershell -Command "Stop-Process -Id (Get-NetTCPConnection -LocalPort 3111 -State Listen).OwningProcess -Force"
```

Nach dem eigenen Start **die Wirkung prüfen, nicht das Markup.** Richtiges Markup beweist
nichts — es war in beiden Fällen richtig. Eine Stilregel abfragen, die es nur auf DIESER Seite
gibt (eine Farbe, ein Maß, ein Versatz aus der Marken-Ebene), und ihren gemessenen Wert in
`QA.md` notieren. Kommt Null oder Leer zurück, wird nicht gemessen, sondern gesucht.

### B. Tore, die stoppen

```bash
cd sites/kunde-name
npm install && npm run check:all
KONTAKT_EMPFAENGER=... npm run start:pruef   # in einem zweiten Fenster
npm run check:formular
```

Aus `check:all` stoppen: `check:types`, `lint`, `build`, `check:a11y`, `check:deutsch`.
Dazu von Hand, was kein Skript kann — jeder Punkt ein Stopp:

- Screenshots bei 320, 390, 768 und 1440 px — **angesehen**, nicht nur „kein Fehler".
- Vollständige Bedienung mit der Tastatur, ein Durchgang mit Screenreader, Prüfung bei 200 % Zoom.
- **Kontrast der Bedienelement-Ränder: mindestens 3:1** (WCAG 1.4.11). axe prüft das **nicht** —
  ein Feldrand mit 1,62:1 lief durch alle grünen Tore. Eigene Messung, `npm run check:kontrast`
  (steckt in `check:all`). Liegen Bedienelemente auf Unterseiten: `PRUEF_SEITEN` setzen —
  findet der Lauf kein einziges, bricht er ab, statt „0 Befunde" zu melden.
- Netzwerk-Mitschnitt: **null Anfragen an fremde Hosts.**
- Eine echte Anfrage abschicken und **im Postfach nachsehen**.

### C. Werte, die immer gemessen werden

`check:perf`, `check:budget` und `npx impeccable detect http://localhost:3111` werden **immer
gemessen und immer eingetragen**. Ob sie auch **stoppen**, entscheidet `doctrine/budget.md`:
Im Auslieferungszustand ja. Ein Projekt darf sie per ADR in `decisions/` zu Beobachtungswerten
herabstufen — dann wird weiter gemessen, aber nicht mehr blockiert. Die Bedingungen dafür und
den Rückweg beschreibt `doctrine/budget.md` ganz oben.

Eine gerissene Grenze kommt in beiden Fällen mit ihrer **Ursache** nach `QA.md`, nicht mit einer
Ausrede.

Ergebnis nach `QA.md`, Vorlage ist `template/QA.md`. Kein „fertig" ohne diese Zahlen.

## Stufe 6 — Design-Abnahme

`AUDIT.md`: Ist-Zustand gegen `DESIGN.md`, jede Abweichung benannt und begründet.

Dann der **Detail-Beweis** aus `CONTEXT.md`: Jemandem die Seite drei Sekunden zeigen und wieder
wegnehmen. Er muss danach beides können — sagen, was die Firma macht, **und** ein
Gestaltungsdetail benennen, das ihm so noch nicht begegnet ist. Ergebnis in `AUDIT.md`,
wörtlich, auch wenn es unangenehm ist. In der Frage wird nicht nachgeholfen.

Besteht die zweite Hälfte nicht, fehlt „das eine Merkmal" aus `DESIGN.md`. Dann zurück zu
Stufe 4 — nicht ausliefern und hoffen.

## Stufe 7 — Ausliefern (Tor)

**Deploy ist der einzige Schritt, den niemand zurücknimmt. Er beginnt mit dem ausdrücklichen Ja
des Auftraggebers** — vorgelegt werden `QA.md`, `AUDIT.md` und die Zieladresse. Kein Ja,
kein Start; „er hätte sicher zugestimmt" ist keine Freigabe.

Hosting pro Kunde entscheiden, das Gerüst ist deploy-neutral. Zugangsdaten nur in `.env`.
Deploy-Befehl und Live-Adresse ins `README.md` des Projekts, damit die nächste Sitzung sie
nicht suchen muss.

Nach dem Start noch einmal messen: Die Werte auf dem echten Hosting sind nicht die vom
eigenen Rechner.

---

## Was dieser Ablauf nicht tut

- Stufen überspringen, weil es eilt. Wer Stufe 3 überspringt, baut zweimal.
- Bauen ohne freigegebenes `DESIGN.md`.
- Ausliefern ohne ausdrückliches Ja des Auftraggebers.
- „Fertig" melden ohne `QA.md` mit Zahlen.
- Messen, ohne vorher geprüft zu haben, dass auf 3111 die eigene Seite liegt.
- Mehr als fünf Fragen stellen.
- Zwei Design-Doktrinen mischen — der Vergleich läuft in getrennten Sitzungen.
