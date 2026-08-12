# `impeccable` in dieser Werkstatt

Dieser Ordner ist der **vollständige** Skill aus
[pbakaus/impeccable](https://github.com/pbakaus/impeccable) — `SKILL.md`, die 34 Playbooks in
`reference/`, die Werkzeuge in `scripts/`, die Subagent-Definitionen in `agents/`. Wortgleich
übernommen, Apache 2.0, Nachweis in
[../../../THIRD-PARTY-LICENSES.md](../../../THIRD-PARTY-LICENSES.md).

Diese Datei hier ist die einzige Ergänzung und gehört nicht zum Original.

## Zwei Regeln, die hier anders sind als beim Autor

**1. Er startet nicht von selbst.** In `.claude/settings.json` steht er auf
`user-invocable-only` — er läuft nur auf ausdrücklichen Aufruf:

```text
/impeccable craft
/impeccable audit
```

Der Grund ist die Kernmechanik dieser Werkstatt: Genau **eine** Design-Doktrin je Sitzung, und
welche das ist, entscheidet `sites/<projekt>/DOCTRINE.md` über den Skill `router`. Ein Skill,
der bei jedem Design-Satz von selbst anspringt, hätte diese Wahl schon getroffen, bevor der
Router sie trifft.

**2. Die Doktrin-Sperre gilt auch hier.** `.claude/hooks/doctrine_lock.py` behandelt jede
`.md`-Datei in diesem Ordner wie `doctrine/impeccable.md` selbst. Wer in einer `taste`-Sitzung
ein Playbook liest, wird geblockt — sonst käme die zweite Doktrin an der Sperre vorbei in den
Kontext. Der Block ist kein Fehler, sondern die Grenze. Die `scripts/` sind ausgenommen: Ein
Werkzeug ist keine Meinung.

## Wo die Werkstatt ihren eigenen Weg geht

`scripts/` enthält den vollen Werkzeugkasten des Autors — Detektor, Live-Modus, Doctor,
Hook-Verwaltung. Was diese Werkstatt davon benutzt:

| Werkzeug | Im Einsatz? |
|---|---|
| **Detektor** | Ja, aber über `npx impeccable detect` aus npm. Der Aufruf steht so im Skill `website` und in `template/QA.md`. |
| **Alles andere** | Nein. Der Ablauf hier ist der Skill `website` mit sieben Stufen, gemessen wird mit `template/scripts/`. |

Das ist kein Urteil über die Werkzeuge, sondern eine Weggabelung: Zwei vollständige Abläufe für
dieselbe Arbeit nebeneinander zu betreiben, führt zu zwei Wahrheiten darüber, wann etwas fertig
ist. Diese Werkstatt hat sich für `QA.md` mit Messwerten entschieden.

**`scripts/hook-admin.mjs` mit Vorsicht:** Es schreibt in `.claude/settings.json` — genau die
Datei, in der die Doktrin-Sperre und der Hotlink-Guard dieser Werkstatt stehen. Es läuft nur auf
ausdrücklichen Aufruf, nie von selbst. Wer es benutzt, sieht danach in die Datei.
