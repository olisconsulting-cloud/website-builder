/**
 * Prüft den Teil des JavaScript-Budgets, den wir selbst verantworten.
 *
 * `check:perf` prüft den GESAMTWERT (190 KB). Darin stecken rund 151 KB
 * Rahmen — React und die Next-Laufzeit —, die niemand beeinflussen kann.
 * Ein Tor auf den Gesamtwert allein verrät also nicht, ob unser eigener Code
 * fett geworden ist oder ob nur das Framework gewachsen ist.
 *
 * Dieses Skript rechnet die Differenz und prüft zwei Dinge:
 *
 *   1. **Ist der gespeicherte Boden noch gültig?** Passt die Version in
 *      `budget-boden.json` nicht zu `package.json`, bricht der Lauf ab und
 *      verlangt eine Nachmessung. Ein veralteter Boden würde sonst still
 *      weiterwirken und das Budget schleichend aufweichen — genau der Fehler,
 *      gegen den die ganze Datei gebaut ist.
 *   2. **Liegt Gesamtwert minus Boden unter der Grenze?**
 *
 * Voraussetzung: `npm run check:perf` ist vorher gelaufen. Ist der Bericht
 * älter als der Bau, bricht das Skript ab — ein Tor, das einen alten Messwert
 * bewertet, meldet grün und man glaubt es.
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

const BERICHTE = ".lighthouseci";
const BODEN_DATEI = "budget-boden.json";

function abbruch(nachricht, hinweis) {
  console.error(`\ncheck:budget fehlgeschlagen\n\n  ${nachricht}\n`);
  if (hinweis) console.error(`${hinweis}\n`);
  process.exit(1);
}

if (!existsSync(BODEN_DATEI)) {
  abbruch(
    `${BODEN_DATEI} fehlt.`,
    "  Ohne gemessenen Rahmen-Boden lässt sich der eigene Anteil nicht ausrechnen.",
  );
}

const paket = JSON.parse(readFileSync("package.json", "utf8"));
const boden = JSON.parse(readFileSync(BODEN_DATEI, "utf8"));

// --- 1. Boden noch gültig? -------------------------------------------------
const istNext = paket.dependencies?.next ?? "?";
const istReact = paket.dependencies?.react ?? "?";

if (istNext !== boden.next || istReact !== boden.react) {
  abbruch(
    `Der Rahmen-Boden wurde mit Next ${boden.next} / React ${boden.react} gemessen, ` +
      `installiert ist Next ${istNext} / React ${istReact}.`,
    `  Der Boden muss neu gemessen werden — die Anleitung steht in ${BODEN_DATEI}\n` +
      "  unter `wieGemessen`. Danach `bodenBytes`, `next`, `react` und `gemessen`\n" +
      "  dort nachziehen und die Gesamtgrenze in lighthouserc.json prüfen.",
  );
}

// --- 2. Bericht vorhanden und frisch? -------------------------------------
if (!existsSync(BERICHTE)) {
  abbruch(`${BERICHTE}/ fehlt.`, "  Erst `npm run check:perf` laufen lassen.");
}

const dateien = readdirSync(BERICHTE)
  .filter((f) => f.startsWith("lhr-") && f.endsWith(".json"))
  .sort();

if (dateien.length === 0) {
  abbruch("Kein Lighthouse-Bericht gefunden.", "  Erst `npm run check:perf` laufen lassen.");
}

const bericht = path.join(BERICHTE, dateien.at(-1));
const bauKennung = path.join(".next", "BUILD_ID");

if (existsSync(bauKennung) && statSync(bericht).mtimeMs < statSync(bauKennung).mtimeMs) {
  abbruch(
    `Der Bericht ${bericht} ist älter als der letzte Bau.`,
    "  Er beschreibt einen überholten Stand. `npm run check:perf` erneut laufen lassen.",
  );
}

// --- 3. Rechnen ------------------------------------------------------------
const lhr = JSON.parse(readFileSync(bericht, "utf8"));
const posten = lhr.audits?.["resource-summary"]?.details?.items ?? [];
const skripte = posten.find((i) => i.resourceType === "script" || i.label === "Script");

if (!skripte) {
  abbruch(
    "Der Bericht enthält keine Skript-Summe (`resource-summary`).",
    "  Prüfen, ob Lighthouse CI das Audit noch liefert.",
  );
}

const gesamt = skripte.transferSize ?? 0;
const eigen = gesamt - boden.bodenBytes;
const grenze = boden.eigenerCodeMaxBytes;
const kb = (b) => `${(b / 1024).toFixed(1)} KB`;

console.log(`Bericht      ${bericht}`);
console.log(`Next/React   ${istNext} / ${istReact}  (Boden gemessen ${boden.gemessen})`);
console.log("");
console.log(`  JavaScript gesamt   ${kb(gesamt).padStart(9)}`);
console.log(`  Rahmen-Boden        ${kb(boden.bodenBytes).padStart(9)}  (nicht beeinflussbar)`);
console.log(`  ------------------------------`);
console.log(`  eigener Code        ${kb(eigen).padStart(9)}  von höchstens ${kb(grenze)}`);

if (eigen > grenze) {
  abbruch(
    `Eigener Client-Code ist ${kb(eigen - grenze)} über der Grenze.`,
    "  Suchen, was neu im Browser-Bündel gelandet ist: eine Bibliothek in einer\n" +
      '  "use client"-Datei, ein Sammelpaket-Import, ein Icon-Set.',
  );
}

console.log(`\nhält — ${kb(grenze - eigen)} Reserve.`);
