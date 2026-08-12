#!/usr/bin/env python
"""PreToolUse-Guard fuer Read: genau EINE Design-Doktrin je Session.

Befund aus der Werkzeug-Bewertung: Ein Modell haelt sich nicht zuverlaessig an
"ignoriere Datei X", wenn X im Kontext liegt. Die Doktrinen liegen deshalb als
Projektdateien statt als Skills - damit feuert nichts von selbst. Dieser Hook
schliesst die letzte Luecke: Er verhindert, dass die ZWEITE Doktrin ueberhaupt
gelesen werden kann.

Mechanik: Beim ersten Read einer Doktrin-Datei wird der Name in einer
Sperrdatei je Session festgehalten (.claude/.doctrine-lock/<session>.txt).
Jeder weitere Read derselben Doktrin laeuft durch. Der Read der anderen
Doktrin wird geblockt.

Variantenvergleich laeuft laut doctrine-Mechanik ohnehin in einer FRISCHEN
Session - der Block ist also kein Hindernis, sondern genau die Grenze.

Bewusstes Aufheben: die Sperrdatei loeschen (Befehl steht in der Meldung).

Grenze des Mechanismus: greift auf Read. Wer eine Doktrin ueber Grep oder
Bash in den Kontext holt, umgeht ihn - das ist dann eine bewusste Handlung,
kein Versehen.

Exit 0 = durchlassen, Exit 2 = blocken (stderr geht an Claude).
"""
import json
import os
import re
import sys
from pathlib import Path, PurePosixPath

# Dateiname -> Doktrin-Kennwort, wie es in sites/<projekt>/DOCTRINE.md steht.
DOCTRINES = {"taste.md": "taste", "impeccable.md": "impeccable"}

LOCK_DIRNAME = ".doctrine-lock"


def lock_path(cwd: str, session_id: str) -> Path:
    safe = re.sub(r"[^A-Za-z0-9_-]", "_", session_id)[:64] or "unbekannt"
    return Path(cwd) / ".claude" / LOCK_DIRNAME / f"{safe}.txt"


def main() -> int:
    try:
        payload = json.load(sys.stdin)
    except Exception:
        return 0  # Kaputte Eingabe darf nicht die Arbeit blockieren.

    if payload.get("tool_name") != "Read":
        return 0

    tool_input = payload.get("tool_input") or {}
    raw_path = str(tool_input.get("file_path") or "")
    if not raw_path:
        return 0

    path = PurePosixPath(raw_path.replace("\\", "/"))

    # Fall 1: der Skill-Ordner. Seit der volle impeccable-Skill mitgeliefert wird,
    # liegen SKILL.md und die 34 Playbooks unter .claude/skills/impeccable/. Sie
    # tragen denselben Inhalt wie die Doktrin, nur aufgeteilt - ohne diesen Zweig
    # holte ein Read von reference/layout.md die zweite Doktrin an der Sperre
    # vorbei in den Kontext. Der Ordner wird deshalb behandelt wie die Doktrin
    # selbst. Nur Text sperren: die scripts/*.mjs sind Werkzeuge, keine Meinung.
    parts = path.parts
    if "impeccable" in parts and "skills" in parts and path.suffix == ".md":
        wanted = "impeccable"

    # Fall 2: die Doktrin-Dateien in doctrine/. de-kalibrierung.md und budget.md
    # sind Ueberstimmungs-Dateien und werden nie gesperrt.
    else:
        wanted = DOCTRINES.get(path.name)
        if wanted is None or "doctrine" not in parts:
            return 0

    cwd = payload.get("cwd") or os.getcwd()
    lock = lock_path(cwd, str(payload.get("session_id") or ""))

    try:
        current = lock.read_text(encoding="utf-8").strip()
    except Exception:
        current = ""

    if current == wanted:
        return 0

    if current:
        sys.stderr.write(
            "BLOCKIERT durch .claude/hooks/doctrine_lock.py\n\n"
            f"  Diese Session ist auf die Doktrin `{current}` festgelegt.\n"
            f"  `{raw_path}` waere die zweite - das ergibt Matsch, nicht\n"
            "  doppelte Qualitaet (Craft-Principle 1: Eine Stimme fuehrt).\n\n"
            "Variantenvergleich gehoert in eine FRISCHE Session:\n"
            f"  sites/<projekt>/variants/{wanted}/ mit eigener DOCTRINE.md.\n\n"
            "Bewusst aufheben (nur wenn du weisst, warum):\n"
            f"  rm \"{lock}\"\n"
        )
        return 2

    try:
        lock.parent.mkdir(parents=True, exist_ok=True)
        lock.write_text(wanted, encoding="utf-8")
    except Exception:
        return 0  # Sperre nicht schreibbar -> lieber durchlassen als blockieren.

    return 0


if __name__ == "__main__":
    sys.exit(main())
