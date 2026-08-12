# Die Playbooks von `impeccable`

Diese 29 Dateien gehören zu [`../impeccable.md`](../impeccable.md) und sind wortgleich aus
[pbakaus/impeccable](https://github.com/pbakaus/impeccable) v3.3.1 übernommen (Apache 2.0,
Nachweis in [../../THIRD-PARTY-LICENSES.md](../../THIRD-PARTY-LICENSES.md)).

Die Doktrin sagt: *„load the one playbook that owns the request"* — genau **eine** davon, passend
zum Unterbefehl. Ohne sie wäre diese Anweisung ins Leere gelaufen; deshalb liegen sie hier.

## Sie unterliegen der Doktrin-Sperre

`.claude/hooks/doctrine_lock.py` behandelt jede Datei in diesem Ordner wie `impeccable.md`
selbst. Wer in einer `taste`-Sitzung ein Playbook liest, wird geblockt — sonst käme die zweite
Doktrin an der Sperre vorbei in den Kontext. Der Block ist kein Fehler, sondern die Grenze.

## Was hier fehlt, und warum das in Ordnung ist

Die Playbooks nennen an einigen Stellen Skripte des Original-Skills
(`scripts/detect.mjs`, `scripts/live-server.mjs`, `scripts/doctor.mjs` und weitere). Diese
Skripte sind **nicht** mitgeliefert. Zwei Fälle:

- **Der Detektor** ist das einzige davon, was diese Werkstatt benutzt — und er kommt über
  `npx impeccable detect`, also zur Laufzeit aus npm. Nichts zu installieren.
- **Alles andere** (Live-Modus, Doctor, Hook-Verwaltung, Frage-Server) gehört zur Infrastruktur
  des Original-Skills. Diese Werkstatt hat ihren eigenen Ablauf — den Skill `website` mit sieben
  Stufen und die Prüfskripte in `template/scripts/`. Wer den vollen Original-Skill will, holt
  ihn beim Autor; die beiden Systeme nebeneinander zu betreiben ergäbe zwei Abläufe für
  dieselbe Arbeit.

Steht in einem Playbook ein Aufruf, den es hier nicht gibt: überspringen, nicht nachbauen.
