/**
 * Kontrast von Bedienelementen — die Lücke, die axe strukturell nicht sieht.
 *
 * axe prüft **Textkontrast** (WCAG 1.4.3), aber nicht den Kontrast der
 * **Umrandung eines Bedienelements** (WCAG 1.4.11, 3:1). Am 28.07.2026 hielt
 * der Rand der Schreibfelder einer fertig gebauten Seite 1,62:1 und lief durch
 * jedes grüne Tor. Gefunden hat es erst eine eigene Messung.
 *
 * Diese Fassung misst **strukturell, nicht über Klassennamen.** Die
 * Vorgänger-Version dieses Skripts griff nach `.feld` und `.rand-zeile` — beim
 * Kopieren auf die nächste Seite wäre sie abgestürzt oder, schlimmer, stumm
 * durchgelaufen. Hier wird gesucht, was JEDE Seite hat: Knöpfe, Eingabefelder,
 * Links, Fließtext. Was das Element heißt, spielt keine Rolle.
 *
 * Zwei Grundsätze, beide teuer gelernt:
 *
 * 1. **Leere Trefferliste ist ROT, nicht grün.** Findet der Lauf auf keiner
 *    Seite ein Bedienelement, ist die Prüfung fehlgeschlagen — nicht bestanden.
 *    Ein Tor, das nichts misst und „ok" sagt, ist schlimmer als keines.
 * 2. **Jeder Wert trägt seine Anforderung.** Kein JSON-Ausdruck, den ein
 *    Mensch deuten muss. Unterschreiten beendet den Lauf mit Fehler.
 *
 * Seiten festlegen über `PRUEF_SEITEN` (kommagetrennt), sonst nur `/`.
 * Eine Seite, deren Bedienelemente auf Unterseiten liegen, MUSS sie eintragen.
 *
 * Voraussetzung: Es läuft bereits ein Server (`npm run check:kontrast` startet ihn).
 */
import { chromium } from "playwright-core";

const BASIS = process.env.PRUEF_URL ?? "http://localhost:3111";
/**
 * Git Bash uebersetzt ein nacktes `/` in einen Windows-Pfad: `PRUEF_SEITEN="/"`
 * kommt als `C:/Program Files/Git/` an, und der Lauf stirbt an einer ungueltigen
 * Adresse. Wer das nicht kennt, sucht den Fehler im Skript.
 */
const SEITEN = (process.env.PRUEF_SEITEN ?? "/")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean)
  .map((s) => {
    if (/^[A-Za-z]:[\\/]/.test(s) || !s.startsWith("/")) {
      console.warn(`  Hinweis: „${s}" ist kein Seitenpfad — Git Bash hat ihn übersetzt. Ersetzt durch „/".`);
      return "/";
    }
    return s;
  });

/** Anforderungen aus WCAG 2.1 AA. */
const MIN_TEXT = 4.5;
const MIN_ELEMENT = 3;

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

/**
 * Die Rechenmaschine läuft IM Browser: nur dort sind `oklch()`, `color-mix()`
 * und geerbte Farben zu fertigen Werten aufgelöst.
 */
const IM_BROWSER = `
  const flaeche = document.createElement("canvas");
  flaeche.width = flaeche.height = 1;
  const stift = flaeche.getContext("2d", { willReadFrequently: true });

  function kanaele(farbe) {
    stift.clearRect(0, 0, 1, 1);
    stift.fillStyle = "#000";
    stift.fillStyle = farbe;
    stift.fillRect(0, 0, 1, 1);
    return stift.getImageData(0, 0, 1, 1).data;
  }
  /**
   * Halbdurchsichtig ueber deckend legen. OHNE das rechnet \`oklch(1 0 0 / 10%)\`
   * — 10 % Weiss, im Dunkel-Modus der Standardrand von shadcn — als volles
   * Weiss und meldet 19:1, wo in Wahrheit kaum Kontrast ist.
   */
  function flach(farbe, grund) {
    const v = kanaele(farbe);
    const a = v[3] / 255;
    if (a >= 0.999) return [v[0], v[1], v[2]];
    const g = kanaele(grund);
    return [0, 1, 2].map((i) => Math.round(v[i] * a + g[i] * (1 - a)));
  }
  function luminanzRGB([r, g, b]) {
    const k = (v) => { const s = v / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; };
    return 0.2126 * k(r) + 0.7152 * k(g) + 0.0722 * k(b);
  }
  function kontrast(vorne, hinten) {
    if (!vorne || !hinten) return null;
    const grund = flach(hinten, "rgb(255,255,255)");
    const a = luminanzRGB(flach(vorne, "rgb(" + grund.join(",") + ")"));
    const b = luminanzRGB(grund);
    const [hell, dunkel] = a > b ? [a, b] : [b, a];
    return Math.round(((hell + 0.05) / (dunkel + 0.05)) * 100) / 100;
  }
  /** Durchsichtig zählt nicht — die tatsächlich sichtbare Fläche dahinter zählt. */
  function grundHinter(el) {
    for (let k = el; k; k = k.parentElement) {
      const f = getComputedStyle(k).backgroundColor;
      if (kanaele(f)[3] > 0) return f;
    }
    return getComputedStyle(document.body).backgroundColor;
  }
  function sichtbar(el) {
    const s = getComputedStyle(el);
    if (s.display === "none" || s.visibility === "hidden" || Number(s.opacity) === 0) return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  }
  /** Der schmalste sichtbare Rand entscheidet — ein 0-px-Rand ist keiner. */
  function randfarbe(el) {
    const s = getComputedStyle(el);
    const seiten = ["Top", "Right", "Bottom", "Left"];
    for (const seite of seiten) {
      if (parseFloat(s["border" + seite + "Width"]) > 0 && s["border" + seite + "Style"] !== "none") {
        return s["border" + seite + "Color"];
      }
    }
    return null;
  }
  function beschriftung(el) {
    const t = (el.getAttribute("aria-label") || el.textContent || el.name || el.type || el.tagName).trim();
    return t.replace(/\\s+/g, " ").slice(0, 30) || el.tagName;
  }
`;

const browser = await browserStarten();
let befunde = 0;
let gemessen = 0;

/** Ein Messwert mit seiner Anforderung. `min: null` heißt: bewusst ausgenommen. */
function pruefen(name, wert, min, grund) {
  if (wert === null || wert === undefined) {
    befunde += 1;
    console.log(`  FEHL ${name.padEnd(52)} nicht messbar — Farbe unbestimmt?`);
    return;
  }
  gemessen += 1;
  if (min === null) {
    console.log(`  ---- ${name.padEnd(52)} ${String(wert).padStart(6)}  (ausgenommen: ${grund})`);
    return;
  }
  const haelt = wert >= min;
  if (!haelt) befunde += 1;
  console.log(`  ${haelt ? "ok  " : "FEHL"} ${name.padEnd(52)} ${String(wert).padStart(6)}  (min ${min})`);
}

let bedienelementeGesamt = 0;

try {
  for (const pfad of SEITEN) {
    const seite = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await seite.goto(`${BASIS}${pfad}`, { waitUntil: "networkidle" });

    const messwerte = await seite.evaluate(`(() => {
      ${IM_BROWSER}
      const ergebnis = { text: [], elemente: [] };

      // --- Fließtext und gedämpfter Text -----------------------------------
      const textproben = new Map();
      for (const el of document.querySelectorAll("p, li, label, figcaption, h1, h2")) {
        if (!sichtbar(el) || !el.textContent.trim()) continue;
        const s = getComputedStyle(el);
        // Eine Farbe je Größenklasse genügt — gleiche Farbe, gleicher Kontrast.
        const schluessel = s.color + "|" + Math.round(parseFloat(s.fontSize));
        if (textproben.has(schluessel)) continue;
        textproben.set(schluessel, true);
        const gross = parseFloat(s.fontSize) >= 24 ||
          (parseFloat(s.fontSize) >= 18.66 && Number(s.fontWeight) >= 700);
        ergebnis.text.push({
          name: el.tagName.toLowerCase() + " · " + beschriftung(el),
          wert: kontrast(s.color, grundHinter(el)),
          // WCAG 1.4.3: große Schrift schuldet 3:1, normale 4.5:1.
          min: gross ? 3 : 4.5,
        });
      }

      // --- Bedienelemente ---------------------------------------------------
      const steuerung = document.querySelectorAll(
        "button, a[href], input:not([type=hidden]), textarea, select, [role=button]",
      );
      for (const el of steuerung) {
        if (!sichtbar(el) || el.disabled) continue;
        const s = getComputedStyle(el);
        const hinter = grundHinter(el.parentElement ?? document.body);
        const eigen = kanaele(s.backgroundColor)[3] > 0 ? s.backgroundColor : hinter;
        const name = el.tagName.toLowerCase() + " · " + beschriftung(el);

        ergebnis.elemente.push({ art: "Schrift", name, wert: kontrast(s.color, eigen), pflicht: true });

        // WCAG 1.4.11 verlangt 3:1 nur fuer das, was ein Element ueberhaupt
        // ERKENNBAR macht. Ein Schreibfeld ist ohne seinen Rand unsichtbar —
        // Pflicht. Ein Knopf mit lesbarer Aufschrift ist es nicht: sein Rand ist
        // Schmuck, und ein Tor, das dafuer rot wird, wird abgeschaltet.
        const traegtText = Boolean((el.textContent || "").trim());
        // Ein Link, der statt Text ein Bild, ein Symbol oder eine eigene
        // gefaerbte Flaeche enthaelt, ist DARAN erkennbar — nicht an seinem
        // Rand. Ohne diese Ausnahme meldet das Tor jede Bildkachel rot.
        const hatGrafik =
          Boolean(el.querySelector("img, svg, canvas, picture, video")) ||
          [...el.children].some((k) => kanaele(getComputedStyle(k).backgroundColor)[3] > 0);
        const nurDurchRand =
          /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName) || (!traegtText && !hatGrafik);
        const grund = nurDurchRand
          ? null
          : traegtText
            ? "durch die Aufschrift erkennbar, Rand ist Schmuck"
            : "durch seinen Bildinhalt erkennbar, Fläche ist Schmuck";

        const rand = randfarbe(el);
        if (rand) {
          ergebnis.elemente.push({ art: "Rand", name, wert: kontrast(rand, hinter), pflicht: nurDurchRand, grund });
        }
        // Eine eigene Fläche ist nur dann ein Unterscheidungsmerkmal, wenn man
        // sie vom Grund trennen kann. Ohne eigene Fläche gibt es nichts zu messen.
        if (eigen !== hinter) {
          ergebnis.elemente.push({ art: "Fläche", name, wert: kontrast(eigen, hinter), pflicht: nurDurchRand, grund });
        }
        // Ein Rand von 0 px UND keine eigene Fläche heißt: Das Element ist
        // allein durch Text erkennbar — zulässig, aber es bleibt der Fokusring.
      }
      ergebnis.anzahlSteuerung = ergebnis.elemente.length;
      return ergebnis;
    })()`);

    // --- Fokusring: nur messbar, wenn das Element wirklich Fokus hat --------
    const fokus = [];
    const fokussierbar = await seite.$$("button, a[href], input:not([type=hidden]), textarea, select");
    for (const el of fokussierbar.slice(0, 12)) {
      await el.focus().catch(() => {});
      const wert = await seite.evaluate(
        `(() => {
          ${IM_BROWSER}
          const el = document.activeElement;
          if (!el || el === document.body) return null;
          const s = getComputedStyle(el);
          const hinter = grundHinter(el.parentElement || document.body);
          // \`outline-style: auto\` heisst: die Seite gestaltet den Fokus NICHT,
          // der Browser malt seinen eigenen Ring. Chromium legt dafuer zwei
          // Farben uebereinander (hell aussen, dunkel innen), damit er auf
          // jedem Untergrund steht. Wer davon eine Farbe misst, meldet einen
          // Verstoss, den es nicht gibt — der Wert wird ausgewiesen, nicht
          // gewertet. Wer den Ring selbst gestaltet, wird gemessen.
          if (s.outlineStyle === "auto") {
            return {
              name: beschriftung(el),
              wert: kontrast(s.outlineColor, hinter),
              ausnahme: "Standard-Ring des Browsers, zweifarbig",
            };
          }
          const breite = parseFloat(s.outlineWidth);
          if (breite && s.outlineStyle !== "none") {
            return { name: beschriftung(el), wert: kontrast(s.outlineColor, hinter) };
          }
          // Tailwind zeichnet \`ring-*\` als box-shadow, nicht als outline. Wer nur
          // \`outline\` liest, meldet einen fehlenden Ring, der sichtbar da ist.
          if (s.boxShadow && s.boxShadow !== "none") {
            // Tailwind legt mehrere Schatten uebereinander, und die ersten drei
            // sind durchsichtige Platzhalter. Wer die erste Farbe nimmt, misst
            // \`rgba(0,0,0,0)\` und bekommt Kontrast 1 — einen Ring, der da ist.
            const farben = s.boxShadow.match(/(rgba?\\([^)]*\\)|okla?[bch]\\([^)]*\\)|#[0-9a-fA-F]{3,8})/g) || [];
            for (const farbe of farben) {
              if (kanaele(farbe)[3] === 0) continue;
              return { name: beschriftung(el), wert: kontrast(farbe, hinter), art: "Ring" };
            }
          }
          return { name: beschriftung(el), wert: 0, kein: true };
        })()`,
      );
      if (wert) fokus.push(wert);
    }

    console.log(`\n=== ${pfad} ===`);
    for (const t of messwerte.text) pruefen("Text: " + t.name, t.wert, t.min);
    for (const e of messwerte.elemente) {
      pruefen(e.art + ": " + e.name, e.wert, e.pflicht ? MIN_ELEMENT : null, e.grund);
    }
    for (const f of fokus) {
      if (f.kein) {
        befunde += 1;
        console.log(`  FEHL ${("Fokusring: " + f.name).padEnd(52)}   —   kein sichtbarer Ring (WCAG 2.4.7)`);
      } else {
        pruefen("Fokusring: " + f.name, f.wert, f.ausnahme ? null : MIN_ELEMENT, f.ausnahme);
      }
    }
    if (messwerte.anzahlSteuerung === 0) {
      console.log("  ---- keine Bedienelemente auf dieser Seite");
    }
    bedienelementeGesamt += messwerte.anzahlSteuerung;
    await seite.close();
  }
} finally {
  await browser.close();
}

// Eine leere Trefferliste ist ROT. Hätte der Lauf nichts zu prüfen gefunden,
// wäre „0 Befunde" eine Lüge über eine nicht stattgefundene Messung.
if (bedienelementeGesamt === 0) {
  console.error(
    `\ncheck:kontrast fehlgeschlagen — auf ${SEITEN.join(", ")} wurde kein einziges ` +
      "Bedienelement gefunden. Seitenliste über PRUEF_SEITEN setzen.",
  );
  process.exit(1);
}

console.log(`\n${gemessen} Werte gemessen (Text ${MIN_TEXT}:1, Bedienelement ${MIN_ELEMENT}:1) · ${befunde} Befunde.`);
if (befunde > 0) {
  console.error("check:kontrast fehlgeschlagen — ein Wert unterschreitet seine Anforderung.");
  process.exit(1);
}
