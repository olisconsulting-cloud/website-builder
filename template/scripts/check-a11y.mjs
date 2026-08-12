/**
 * Barrierefreiheits-Prüfung mit axe-core über Playwright.
 *
 * Das ist ein eigenes Messgerät neben `npx impeccable detect`: Der Detektor
 * prüft Geschmack, axe prüft Konformität. Maßstab ist WCAG 2.1 AA — in
 * Deutschland seit dem 28.06.2025 über das BFSG rechtlich verbindlich.
 *
 * Ehrliche Grenze: Automatische Prüfung findet etwa ein Drittel der
 * Verstöße. Grün heißt „keine maschinell auffindbaren Fehler“, nicht
 * „barrierefrei“. Bedienung mit der Tastatur und ein Durchgang mit
 * Screenreader bleiben Handarbeit.
 *
 * Voraussetzung: Es läuft bereits ein Server (`npm run check:a11y` startet ihn).
 */
import { chromium } from "playwright-core";
import { AxeBuilder } from "@axe-core/playwright";

/**
 * Eigener Port für die Prüfläufe, nicht 3000.
 *
 * Grund, teuer gelernt: Läuft irgendwo noch ein Entwicklungs-Server auf 3000,
 * springt `start-server-and-test` NICHT an — die Adresse antwortet ja — und
 * die Prüfung misst klaglos einen ALTEN Stand. Ein Tor, das den falschen
 * Stand misst, ist schlimmer als keines: Es meldet grün und man glaubt es.
 */
const BASIS = process.env.PRUEF_URL ?? "http://localhost:3111";

const SEITEN = ["/", "/impressum", "/datenschutz", "/barrierefreiheit"];

/**
 * Zwei Breiten, weil sich Verstöße unterscheiden: Auf dem Handy fallen zu
 * kleine Tippziele und Kontrastprobleme in eingeklappten Menüs auf, die am
 * Desktop gar nicht sichtbar sind.
 *
 * `isMobile` und `hasTouch` sind nicht schmückend — erst sie setzen
 * `pointer: coarse`. Ein bloß schmal gezogenes Fenster prüft die Touch-Optik
 * NICHT.
 */
const BREITEN = [
  { name: "Handy 390", viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true },
  { name: "Desktop 1440", viewport: { width: 1440, height: 900 }, isMobile: false, hasTouch: false },
];

/** Nur das, was Menschen tatsächlich aussperrt, blockiert den Durchlauf. */
const BLOCKIERT = new Set(["critical", "serious"]);

async function browserStarten() {
  // Chrome ist auf diesem Rechner nicht installiert und braucht Administrator-
  // Rechte. Edge ist auf jedem Windows da und rendert dieselbe Engine.
  for (const channel of ["msedge", "chrome"]) {
    try {
      return await chromium.launch({ channel });
    } catch {
      // nächsten Kanal versuchen
    }
  }
  return chromium.launch();
}

const browser = await browserStarten();
let verstoesse = 0;
let geprueft = 0;

try {
  for (const breite of BREITEN) {
    const kontext = await browser.newContext({
      viewport: breite.viewport,
      isMobile: breite.isMobile,
      hasTouch: breite.hasTouch,
      locale: "de-DE",
    });

    for (const pfad of SEITEN) {
      const seite = await kontext.newPage();
      await seite.goto(`${BASIS}${pfad}`, { waitUntil: "networkidle" });

      const ergebnis = await new AxeBuilder({ page: seite })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();

      geprueft += 1;

      const relevant = ergebnis.violations.filter((v) => BLOCKIERT.has(v.impact ?? ""));
      const rest = ergebnis.violations.length - relevant.length;

      const marke = relevant.length === 0 ? "OK  " : "FAIL";
      console.log(
        `${marke} ${breite.name.padEnd(13)} ${pfad.padEnd(20)} ` +
          `${relevant.length} blockierend, ${rest} nachrangig`,
      );

      for (const v of relevant) {
        verstoesse += 1;
        console.log(`       ${v.id} (${v.impact}) — ${v.help}`);
        for (const knoten of v.nodes.slice(0, 3)) {
          console.log(`         ${knoten.target.join(" ")}`);
        }
      }

      await seite.close();
    }

    await kontext.close();
  }
} finally {
  await browser.close();
}

console.log(`\n${geprueft} Seitenaufrufe geprüft, ${verstoesse} blockierende Verstöße.`);

if (verstoesse > 0) {
  console.error("\ncheck:a11y fehlgeschlagen. Kein „fertig“ mit blockierenden Verstößen.");
  process.exit(1);
}
