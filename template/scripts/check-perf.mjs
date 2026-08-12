/**
 * Ladezeit-Tor: Lighthouse CI gegen die Grenzen aus `doctrine/budget.md`.
 *
 * Zwei Dinge löst dieses Skript, die eine reine npm-Zeile nicht löst:
 *
 * 1. Lighthouse braucht einen Chromium-Browser, und wo der liegt, ist je System
 *    verschieden. Die Liste unten deckt Windows, macOS und Linux ab und setzt
 *    den Fund als CHROME_PATH. Edge zählt mit: dieselbe Engine, und auf einem
 *    Windows-Rechner ohne Administrator-Rechte oft der einzige vorhandene.
 *    Findet die Liste nichts, ist CHROME_PATH der Ausweg — sie steht an
 *    erster Stelle und schlägt jeden Fund.
 * 2. Lighthouse CI läuft über `npx` mit fester Version statt als
 *    Projekt-Abhängigkeit. Grund: `template/` wird pro Kunde KOPIERT. Eine
 *    ~100-MB-Abhängigkeit in jeder Kopie zahlt man einmal je Seite, obwohl das
 *    Werkzeug nur vor der Freigabe läuft. Die feste Version hält das Ergebnis
 *    trotzdem vergleichbar.
 */
import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";

const LHCI_VERSION = "0.15.1";

const KANDIDATEN = [
  process.env.CHROME_PATH,
  // Windows
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
  // macOS
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
  // Linux
  "/usr/bin/google-chrome",
  "/usr/bin/google-chrome-stable",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
  "/snap/bin/chromium",
].filter(Boolean);

const browser = KANDIDATEN.find((pfad) => existsSync(pfad));

if (!browser) {
  console.error(
    "Kein Chromium-Browser gefunden. Lighthouse kann ohne nicht messen.\n\n" +
      "Gesucht wurde an diesen Stellen:\n" +
      KANDIDATEN.map((p) => `  ${p}`).join("\n") +
      "\n\nAusweg: CHROME_PATH auf eine Chrome-, Chromium- oder Edge-Programmdatei\n" +
      "setzen. Playwrights eigenes Chromium liegt nach `npx playwright install\n" +
      "chromium` je nach System unter ~/.cache/ms-playwright/ bzw.\n" +
      "%LOCALAPPDATA%\\ms-playwright\\ und ist als Wert geeignet.",
  );
  process.exit(1);
}

console.log(`Messbrowser: ${browser}\n`);

// `shell: true` auf Windows ist Pflicht, nicht Bequemlichkeit: Node blockiert
// seit 18.20 das direkte Starten von .cmd-Wrappern (und npx ist einer).
const lauf = spawnSync("npx", ["--yes", `@lhci/cli@${LHCI_VERSION}`, "autorun"], {
  stdio: "inherit",
  shell: process.platform === "win32",
  env: { ...process.env, CHROME_PATH: browser },
});

process.exit(lauf.status ?? 1);
