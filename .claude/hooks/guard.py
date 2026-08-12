#!/usr/bin/env python
"""PreToolUse-Guard fuer Write|Edit.

Setzt die zwei Zero-Tolerance-Regeln aus AGENTS.md deterministisch durch, statt
sie dem Modell als Vorsatz zu ueberlassen:

  1. Keine externen Hotlinks in Produktionscode (Bilder, Schriften, Stylesheets).
     Grund: DSGVO (Besucher-IP geht an Dritte) und Ladezeit. doctrine/taste.md
     schreibt selbst picsum.photos und cdn.simpleicons.org vor - genau das faengt
     dieser Hook ab, siehe doctrine/budget.md.

  2. Keine echten Zugangsdaten ausserhalb von .env.

Bewusste Ausnahme moeglich: steht `guard:allow-external` in derselben Zeile,
laesst der Hook sie durch. Fuer Faelle, die hinter einer Einwilligung laufen.

Exit 0 = durchlassen, Exit 2 = blocken (stderr geht an Claude).
"""
import json
import re
import sys
from pathlib import PurePosixPath

# Nur Produktionscode pruefen - Doku und Doktrin duerfen Beispiel-URLs enthalten.
CODE_SUFFIXES = {".tsx", ".jsx", ".ts", ".js", ".mjs", ".html", ".css", ".scss"}
SKIP_DIR_PARTS = {"doctrine", "node_modules", ".next", "decisions", "docs"}

ALLOW_MARKER = "guard:allow-external"

# Hosts, die lokal eingebunden gehoeren. Reihenfolge egal, Treffer = Block.
BAD_HOSTS = [
    ("picsum.photos", "Platzhalterbilder lokal ablegen"),
    ("cdn.simpleicons.org", "npm-Paket `simple-icons` benutzen"),
    ("images.unsplash.com", "Bild herunterladen und ueber next/image ausliefern"),
    ("fonts.googleapis.com", "Schrift self-hosten ueber next/font"),
    ("fonts.gstatic.com", "Schrift self-hosten ueber next/font"),
    ("via.placeholder.com", "Platzhalter lokal erzeugen"),
    ("placehold.co", "Platzhalter lokal erzeugen"),
]

# Asset-Einbindungen. Ein normales <a href="https://..."> wird NICHT geblockt -
# ausgehende Links sind legitim, nur nachgeladene Assets sind das Problem.
ASSET_PATTERNS = [
    (re.compile(r"""\bsrc\s*=\s*["'{]?\s*["']?(https?://[^"'\s`)]+)""", re.I), "src"),
    (re.compile(r"""\burl\(\s*["']?(https?://[^"')\s]+)""", re.I), "css url()"),
    (re.compile(r"""<link\b[^>]*\bhref\s*=\s*["'](https?://[^"']+)""", re.I), "<link>"),
    (re.compile(r"""@import\s+(?:url\()?["'](https?://[^"')]+)""", re.I), "@import"),
]

SECRET_PATTERNS = [
    (re.compile(r"\bsk-[A-Za-z0-9_-]{20,}"), "OpenAI-artiger Schluessel"),
    (re.compile(r"\bsk-ant-[A-Za-z0-9_-]{20,}"), "Anthropic-Schluessel"),
    (re.compile(r"\bghp_[A-Za-z0-9]{30,}"), "GitHub-Token"),
    (re.compile(r"\bAKIA[0-9A-Z]{16}\b"), "AWS-Access-Key"),
    (re.compile(r"-----BEGIN [A-Z ]*PRIVATE KEY-----"), "Privater Schluessel"),
    (re.compile(r"\bmcp-[A-Za-z0-9]{16,}"), "MCP-Token"),
]


def is_env_file(name: str) -> bool:
    return name == ".env" or name.startswith(".env.")


def collect_text(tool_input: dict) -> str:
    """Nur neu geschriebener Text. old_string ist bestehender Code - der wird
    nicht geprueft, sonst blockiert der Hook das Entfernen eines Verstosses."""
    parts = [tool_input.get("content"), tool_input.get("new_string")]
    return "\n".join(p for p in parts if isinstance(p, str))


def main() -> int:
    try:
        payload = json.load(sys.stdin)
    except Exception:
        return 0  # Kaputte Eingabe darf nicht die Arbeit blockieren.

    if payload.get("tool_name") not in ("Write", "Edit", "NotebookEdit"):
        return 0

    tool_input = payload.get("tool_input") or {}
    raw_path = str(tool_input.get("file_path") or "")
    if not raw_path:
        return 0

    path = PurePosixPath(raw_path.replace("\\", "/"))
    name = path.name
    text = collect_text(tool_input)
    if not text:
        return 0

    findings = []

    # Regel 2: Zugangsdaten. Gilt fuer JEDEN Dateityp ausser .env selbst.
    if not is_env_file(name):
        for pattern, label in SECRET_PATTERNS:
            hit = pattern.search(text)
            if hit:
                findings.append(
                    f"{label} in `{name}`. Zugangsdaten gehoeren in `.env` "
                    f"(steht in .gitignore), im Code nur `process.env.NAME`."
                )
                break

    # Regel 1: Externe Hotlinks - nur in Produktionscode.
    in_skipped_dir = any(part in SKIP_DIR_PARTS for part in path.parts)
    if path.suffix.lower() in CODE_SUFFIXES and not in_skipped_dir:
        for line in text.splitlines():
            if ALLOW_MARKER in line:
                continue
            for pattern, where in ASSET_PATTERNS:
                m = pattern.search(line)
                if not m:
                    continue
                url = m.group(1)
                if "localhost" in url or "127.0.0.1" in url:
                    continue
                fix = next((f for host, f in BAD_HOSTS if host in url), None)
                if fix is None:
                    fix = "Asset lokal ablegen und relativ einbinden"
                findings.append(f"Externer Hotlink in {where}: {url} -> {fix}")
                break
            if len(findings) >= 4:
                break

    if not findings:
        return 0

    sys.stderr.write("BLOCKIERT durch .claude/hooks/guard.py\n\n")
    for f in findings:
        sys.stderr.write(f"  - {f}\n")
    sys.stderr.write(
        "\nRegel steht in AGENTS.md (IMPORTANT) und doctrine/budget.md.\n"
        f"Bewusste Ausnahme: `{ALLOW_MARKER}` in dieselbe Zeile schreiben.\n"
    )
    return 2


if __name__ == "__main__":
    sys.exit(main())
