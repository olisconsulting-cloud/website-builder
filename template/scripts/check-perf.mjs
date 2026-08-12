/**
 * Ladezeit-Tor: Lighthouse CI gegen die Grenzen aus `doctrine/budget.md`.
 *
 * Zwei Dinge löst dieses Skript, die eine reine npm-Zeile nicht löst:
 *
 * 1. Lighthouse braucht einen Chromium-Browser. Auf diesem Rechner ist Chrome
 *    nicht installiert (Installation braucht Administrator-Rechte), Edge aber
 *    schon — dieselbe Engine. Der Pfad wird unten gesucht und als CHROME_PATH
 *    gesetzt.
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
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].filter(Boolean);

const browser = KANDIDATEN.find((pfad) => existsSync(pfad));

if (!browser) {
  console.error(
    "Kein Chromium-Browser gefunden. Lighthouse kann ohne nicht messen.\n" +
      "Setz CHROME_PATH auf eine chrome.exe oder msedge.exe.",
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
