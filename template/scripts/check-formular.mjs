/**
 * Die Strecke hinter dem Formular, Ende zu Ende.
 *
 * Keine der geprüften Design-Quellen kennt diesen Schritt — und er ist der
 * teuerste: Eine Seite, die schön aussieht und Anfragen still verliert, ist
 * schlimmer als gar keine Seite.
 *
 * Vier Fälle, jeder mit eigenem Fehlerbild:
 *
 *   1. Gültig **mit** JavaScript — der Normalfall.
 *   2. Gültig **ohne** JavaScript — belegt, dass das Formular als echtes
 *      `<form action>` läuft und nicht an einem Skript hängt.
 *   3. Honigtopf gefüllt — der Server muss Erfolg MELDEN und trotzdem NICHT
 *      zustellen. Im Server-Log darf für diesen Fall keine Zustellung stehen.
 *   4. Ungültige E-Mail — muss abgefangen werden, ohne HTTP-Fehler.
 *
 * NICHT Teil von `check:all`: Der Lauf braucht einen laufenden Server MIT
 * gesetztem `KONTAKT_EMPFAENGER`. Er gehört vor jede Freigabe, von Hand:
 *
 *   KONTAKT_EMPFAENGER=... npm run start:pruef
 *   node scripts/check-formular.mjs
 *
 * Und danach im Postfach nachsehen. Ein grüner Lauf beweist, dass die Anfrage
 * den Server erreicht — nicht, dass die Mail ankommt.
 */
import { chromium } from "playwright-core";

const BASIS = process.env.PRUEF_URL ?? "http://localhost:3111";
const browser = await chromium.launch({ channel: "msedge" });

async function fall(name, { ohneJs = false, honigtopf = false, ungueltig = false } = {}) {
  const kontext = await browser.newContext({
    viewport: { width: 430, height: 900 },
    locale: "de-DE",
    javaScriptEnabled: !ohneJs,
  });
  const seite = await kontext.newPage();
  const nicht200 = [];
  seite.on("response", (r) => {
    if (r.status() >= 400) nicht200.push(`${r.status()} ${r.url().replace(BASIS, "")}`);
  });

  await seite.goto(BASIS + "/", { waitUntil: ohneJs ? "domcontentloaded" : "networkidle" });

  if (honigtopf) {
    await seite.evaluate(() => {
      const hp = document.querySelector('input[name="website"]');
      if (hp) hp.value = "https://spam.example";
    });
  }

  await seite.getByLabel("Name").fill("Änne Müller-Groß");
  await seite.getByLabel("E-Mail").fill(ungueltig ? "keine-adresse" : "aenne@beispiel.de");
  await seite
    .getByLabel("Nachricht")
    .fill("Wir bräuchten eine Barrierefreiheitserklärung für unsere Website.");
  await seite.locator("input[type=checkbox][name=einwilligung]").check({ force: true });
  await seite.waitForTimeout(300);
  await seite.getByRole("button", { name: "Anfrage senden" }).click();
  await seite.waitForTimeout(2500);

  const erfolg = await seite
    .locator('[role="status"]')
    .first()
    .innerText()
    .catch(() => null);
  const rot = (await seite.locator("p.text-destructive").allInnerTexts()).filter(Boolean);

  console.log(
    `${name.padEnd(28)} Erfolg: ${erfolg ? "JA" : "nein"}` +
      ` | rote Meldungen: ${rot.length ? rot.join(" / ").slice(0, 60) : "keine"}` +
      ` | HTTP-Fehler: ${nicht200.length ? nicht200.join(", ") : "keine"}`,
  );
  await kontext.close();
}

await fall("gueltig, mit JavaScript");
await fall("gueltig, OHNE JavaScript", { ohneJs: true });
await fall("Honigtopf gefuellt", { honigtopf: true });
await fall("ungueltige E-Mail", { ungueltig: true });

await browser.close();
