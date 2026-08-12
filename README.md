# Website Builder

Eine Werkstatt für **deutschsprachige Marketing-Websites und Landingpages**, gebaut für die
Arbeit mit [Claude Code](https://claude.com/claude-code). Kein npm-Paket, kein Generator —
ein Ordner mit einem Gerüst, zwei Design-Doktrinen und Qualitäts-Toren, die messen statt zu
behaupten.

Der Kern in einem Satz: **Kein „fertig" ohne `QA.md` mit Messwerten.**

> **Für Landingpages, Portfolios und Marketing-Seiten.** Nicht für Dashboards, Datentabellen
> oder mehrstufige Produkt-Oberflächen — dafür ist die Doktrin hier die falsche.

## Was hier drin ist

| Ordner | Inhalt |
|---|---|
| `template/` | Next.js 16 · React 19 · Tailwind v4 · shadcn/ui · TypeScript. Wird pro Auftrag nach `sites/kunde-name/` kopiert. Enthält sechs Prüfskripte. |
| `doctrine/` | Zwei Design-Doktrinen — plus zwei eigene Dateien, die sie **überstimmen**: Deutsch-Kalibrierung und Ladezeit-Budget. |
| `.claude/skills/` | Zehn Skills. `website` führt den Bau in sieben Stufen, `router` lädt die Doktrin, `deutsche-copy-review` prüft jeden Text vor dem Einbau. Dazu der vollständige `impeccable`-Skill — auf „nur auf Zuruf" gestellt, damit er die Doktrin-Wahl nicht vorwegnimmt. |
| `.claude/hooks/` | Zwei Python-Hooks, die zwei Regeln **deterministisch** durchsetzen — statt sie dem Modell als Vorsatz zu überlassen. |
| `decisions/` | Architekturentscheidungen mit Begründung und Rückweg. |

## Warum das anders ist als „Claude, bau mir eine Landingpage"

Drei Mechaniken, die den Unterschied machen:

**1. Genau eine Design-Doktrin je Sitzung — erzwungen, nicht erbeten.**
Zwei Ästhetik-Systeme gleichzeitig im Kontext ergeben Matsch: die Typografie des einen, die
Farben des anderen, und das Ergebnis hat keine Handschrift. Die Doktrinen liegen deshalb als
**Dateien** statt als Skills (Skills triggern von selbst), und `.claude/hooks/doctrine_lock.py`
blockt das Lesen der zweiten. Ein Modell hält sich nicht zuverlässig an „ignoriere Datei X",
wenn X im Kontext liegt.

**2. Deutsch ist kalibriert, nicht übersetzt.**
Die englischsprachigen Design-Doktrinen enthalten null Treffer zu Deutsch oder i18n; ihre
tragenden Regeln sind an englischer Wortlänge geeicht. Deutsche Wörter sind rund 30 % länger,
Komposita sprengen die Zeile. `doctrine/de-kalibrierung.md` setzt Zeilengrenzen statt
Wortgrenzen und überstimmt die Doktrin bei Widerspruch. Ohne diese Datei brechen genau die
Regeln, die die Doktrin am stärksten machen.

**3. Die Tore messen wirklich.**
`npm run check:all` prüft Typen, Lint, Build, Barrierefreiheit (axe), deutschen Härtetest,
Kontrast von Bedienelement-Rändern, Ladezeit (Lighthouse CI) und JavaScript-Budget. Zwei davon
gibt es, weil grüne Standard-Tore etwas durchgelassen haben:

- **`check:kontrast`** — axe prüft **keinen** Kontrast von Bedienelement-Umrandungen. Ein
  Feldrand mit 1,62:1 lief durch alle grünen Tore, während WCAG 1.4.11 3:1 verlangt.
- **`check:budget`** — bricht ab, wenn die Next-Version nicht mehr die ist, mit der der
  JavaScript-Boden gemessen wurde. Ein Budget aus einer alten Messung ist wieder eine runde Zahl.

## Loslegen

```bash
git clone https://github.com/olisconsulting-cloud/website-builder.git
cd website-builder

# 1. Das Gerüst einmal prüfen — was hier rot meldet, meldet später bei jeder Seite rot
cd template && npm install && npm run check:all
```

Dann in Claude Code den Ordner öffnen und den Ablauf starten:

```
/website
```

Der Ablauf stellt **höchstens fünf Rückfragen**, setzt den Rest als sichtbare Annahme und führt
über sieben Stufen — Briefing → Design-Richtung → Copy → Bau → Qualitäts-Tor → Design-Abnahme →
Ausliefern. Drei davon sind Tore: ohne freigegebenes `DESIGN.md` kein Bau, ohne `QA.md` mit
Zahlen kein „fertig", ohne ausdrückliches Ja kein Deploy.

### Voraussetzungen

- Node.js 20+ und Claude Code
- Beim ersten Start fragt Claude Code einmal nach den drei MCP-Servern aus `.mcp.json`
  (`shadcn`, `context7`, `chrome-devtools`) — bestätigen, sonst fehlen Komponenten-Registry,
  aktuelle Doku und Browser-Messung.
- Für die Prüfskripte: `npx playwright install chromium`

### Hinweis für macOS und Linux

Diese Werkstatt ist auf Windows entstanden. An zwei Stellen stehen deshalb PowerShell-Befehle
im Text — beim Freiräumen von Port 3111 in `.claude/skills/website/SKILL.md`. Die Prüfskripte
selbst sind plattformneutral; nur die Suche nach Playwrights Chromium in `check-perf.mjs` nimmt
einen Windows-Pfad und braucht auf anderen Systemen eine Zeile Anpassung.

## Der Rest ist Doktrin

Was diese Werkstatt inhaltlich will, steht in [CONTEXT.md](CONTEXT.md) — Excellence-Anchor,
Mess-Anker und der **Detail-Beweis**:

> Jemandem die Seite drei Sekunden lang zeigen und wieder wegnehmen. Danach kann er beides:
> sagen, was die Firma macht — und ein Gestaltungsdetail benennen, das ihm so noch nicht
> begegnet ist.

Arbeitsregeln fürs Modell: [AGENTS.md](AGENTS.md). Quellen und Rechtsgrundlagen (BFSG, DSGVO,
UWG): [REFERENCES.md](REFERENCES.md).

## Lizenz

Der eigene Anteil steht unter [MIT](LICENSE). Die beiden Design-Doktrinen in `doctrine/` und
sechs der zehn Skills stammen aus fremden Repos und behalten ihre Lizenz — Herkunft, Copyright
und Lizenztexte in [THIRD-PARTY-LICENSES.md](THIRD-PARTY-LICENSES.md).
