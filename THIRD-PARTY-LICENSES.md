# Fremde Bestandteile

Dieses Repository enthält Material aus drei fremden Repositorys. Alle drei stehen unter
freien Lizenzen (MIT bzw. Apache 2.0), die das Mitliefern erlauben, solange Copyright-Vermerk
und Lizenztext mitgehen. Genau das leistet diese Datei.

**Der eigene Anteil steht unter MIT** — siehe [LICENSE](LICENSE). Diese MIT-Lizenz deckt genau
den eigenen Anteil ab, nicht die unten aufgeführten Bestandteile: die behalten ihre eigene.

---

## 1. `doctrine/taste.md`

| | |
|---|---|
| **Herkunft** | [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) — Skill `design-taste-frontend`, v2 |
| **Copyright** | © 2026 Leonxlnx |
| **Lizenz** | MIT — [`licenses/taste-skill-MIT.txt`](licenses/taste-skill-MIT.txt) |
| **Geändert** | Nein. Wortgleich übernommen. |

Liegt hier bewusst als **Projektdatei statt als Skill**: Skills triggern von selbst, und zwei
Design-Doktrinen gleichzeitig im Kontext ergeben Matsch. Als Datei lädt der Router genau eine.

## 2. `doctrine/impeccable.md`

| | |
|---|---|
| **Herkunft** | [pbakaus/impeccable](https://github.com/pbakaus/impeccable) v3.3.1 |
| **Copyright** | © Paul Bakaus und Mitwirkende |
| **Lizenz** | Apache License 2.0 — [`licenses/impeccable-APACHE-2.0.txt`](licenses/impeccable-APACHE-2.0.txt) |
| **Geändert** | **Ja** — siehe unten. |

**Änderungsvermerk** (Apache 2.0 §4b verlangt ihn):

- Die Datei ist eine **Zusammenfügung zweier Quelldateien** des Originals: `SKILL.md` und
  `reference/craft-floor.md`. Im Original sind das zwei getrennte Dateien.
- Ein Kommentarkopf mit Herkunftsangabe wurde vorangestellt.
- Der Text selbst ist inhaltlich unverändert.

### `doctrine/reference/` — 29 Playbooks, gleiche Quelle

Dieselbe Herkunft und dieselbe Lizenz. Die Doktrin verweist auf sie („load the one playbook that
owns the request"); ohne sie liefe die Anweisung ins Leere. **Wortgleich übernommen**, im
Original unter `.agents/skills/impeccable/reference/`.

Übernommen wurde **genau die Teilmenge, auf die `impeccable.md` verweist** — nicht der ganze
Ordner. Weggelassen: die Playbooks für native Apps (`ios.md`, `android.md`, `*.native.md`) und
die Infrastruktur des Original-Skills (`degraded/`, `agents/*.toml`). Einordnung und Grenzen
stehen in [`doctrine/reference/LIESMICH.md`](doctrine/reference/LIESMICH.md) — diese Datei ist
eigene Arbeit, nicht Teil des Originals.

**Nicht mitgeliefert:** die `scripts/*.mjs` des Original-Skills. Der Detektor daraus
(`npx impeccable detect`) wird zur Laufzeit über npm bezogen — er ist in dieser Werkstatt
Messgerät, nicht Doktrin. Der Rest gehört zu einem Ablauf, den diese Werkstatt nicht benutzt.

## 3. Fünf Skills unter `.claude/skills/`

| | |
|---|---|
| **Herkunft** | [emilkowalski/skills](https://github.com/emilkowalski/skills) |
| **Copyright** | © 2026 Emil Kowalski |
| **Lizenz** | MIT — [`licenses/emilkowalski-skills-MIT.txt`](licenses/emilkowalski-skills-MIT.txt) |
| **Geändert** | Nein. Wortgleich übernommen. |

Betroffen sind:

- `.claude/skills/review-animations/` (inkl. `STANDARDS.md`)
- `.claude/skills/improve-animations/` (inkl. `AUDIT.md`, `PLAN-TEMPLATE.md`)
- `.claude/skills/find-animation-opportunities/`
- `.claude/skills/animation-vocabulary/`
- `.claude/skills/prototype/` (inkl. `PICKER.md`)

Bewusst **weggelassen** wurden drei weitere Skills desselben Repos: `apple-design` (wäre eine
dritte Ästhetik-Doktrin), `emil-design-eng` (enthält einen Pflicht-Werbesatz für den Kurs des
Autors) und `pick-ui-library` (erklärter Interessenkonflikt).

---

## Eigener Anteil — zur Klarstellung

Unter MIT dieses Repositorys, nicht fremd:

- `doctrine/de-kalibrierung.md` und `doctrine/budget.md` — die zwei Dateien, die beide
  Doktrinen überstimmen
- `template/` vollständig, samt der sechs Prüfskripte in `template/scripts/`
- `.claude/skills/website/`, `.claude/skills/router/`, `.claude/skills/grundschicht/`
- `.claude/hooks/guard.py` und `.claude/hooks/doctrine_lock.py`
- `decisions/`, `AGENTS.md`, `CONTEXT.md`, `REFERENCES.md`, `README.md`

## Laufzeit-Abhängigkeiten

Die npm-Pakete in `template/package.json` (Next.js, React, Tailwind, shadcn/ui, Radix, Zod
und weitere) werden **nicht** mitgeliefert, sondern beim `npm install` bezogen. Ihre Lizenzen
gelten unverändert; `npx license-checker` im Ordner `template/` listet sie auf.
