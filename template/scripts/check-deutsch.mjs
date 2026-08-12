/**
 * Deutsch-Härtetest.
 *
 * Prüft die drei Stellen, an denen deutsche Sprache ein Layout bricht, das mit
 * englischen Platzhaltern noch gehalten hat (`doctrine/de-kalibrierung.md`):
 *
 *   1. **Seitlicher Überlauf.** Deutsche Komposita sind rund 30 % länger.
 *      Ein Wort wie „Grundstücksverkehrsgenehmigung" schiebt bei 320 px eine
 *      ganze Seite nach rechts.
 *   2. **Versal-Umlaute.** Ä, Ö und Ü ragen über die Versalhöhe hinaus. Bei
 *      `leading-none` schneidet der Zeilenkasten die Punkte ab — sichtbar bei
 *      „ÜBER UNS" und „Öffnungszeiten".
 *   3. **Gesprengte Kästen.** Ein zu langes Wort in einem Knopf oder einer
 *      Karte läuft aus seinem Kasten heraus, statt umzubrechen.
 *
 * Automatisch messbar ist davon 1 und 3 sicher, 2 nur näherungsweise: Wir
 * prüfen, ob über der ersten Textzeile Reserve bleibt. Ob die Punkte wirklich
 * stehen, entscheidet am Ende das Auge — dafür legt das Skript Screenshots ab.
 *
 * 320 px ist Absicht: Das ist die schmalste Breite, die real vorkommt.
 * Was dort hält, hält überall.
 */
import { chromium } from "playwright-core";

const BASIS = process.env.PRUEF_URL ?? "http://localhost:3111";
const BILDER = process.env.BILD_ORDNER ?? null;

const SEITEN = ["/", "/barrierefreiheit"];

const BREITEN = [
  { name: "320", w: 320, h: 800, mobil: true },
  { name: "390", w: 390, h: 844, mobil: true },
  { name: "1440", w: 1440, h: 900, mobil: false },
];

async function browserStarten() {
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
let fehler = 0;

try {
  for (const b of BREITEN) {
    const kontext = await browser.newContext({
      viewport: { width: b.w, height: b.h },
      isMobile: b.mobil,
      hasTouch: b.mobil,
      deviceScaleFactor: 2,
      locale: "de-DE",
    });

    for (const pfad of SEITEN) {
      const seite = await kontext.newPage();
      await seite.goto(BASIS + pfad, { waitUntil: "networkidle" });

      const befund = await seite.evaluate(() => {
        const d = document.documentElement;

        const umlaute = [];
        for (const el of document.querySelectorAll("h1, h2, h3")) {
          const text = (el.textContent ?? "").trim();
          if (!/[ÄÖÜ]/.test(text)) continue;
          const stil = getComputedStyle(el);
          const kasten = el.getBoundingClientRect();
          const bereich = document.createRange();
          bereich.selectNodeContents(el);
          const zeile = bereich.getBoundingClientRect();
          umlaute.push({
            text: text.slice(0, 34),
            groesse: stil.fontSize,
            zeilenhoehe: stil.lineHeight,
            reserve: Math.round((zeile.top - kasten.top) * 10) / 10,
            gross: text === text.toUpperCase(),
          });
        }

        /** Für das Auge unsichtbare Helfer — Sprunglinks, Honigtopf — zählen nicht. */
        const unsichtbar = (el) => {
          const s = getComputedStyle(el);
          if (s.display === "none" || s.visibility === "hidden") return true;
          if (s.clip === "rect(0px, 0px, 0px, 0px)") return true;
          if (s.clipPath === "inset(50%)") return true;
          const k = el.getBoundingClientRect();
          if (k.width <= 1 || k.height <= 1) return true;
          // aus dem Bild geschoben (sr-only-Muster, Honigtopf)
          return k.right < 0 || k.left > d.clientWidth;
        };

        const gesprengt = [];
        for (const el of document.querySelectorAll("h1,h2,h3,p,li,a,button,dd,dt")) {
          if (el.scrollWidth > el.clientWidth + 1 && !unsichtbar(el)) {
            gesprengt.push({
              tag: el.tagName,
              text: (el.textContent ?? "").trim().slice(0, 40),
              ueber: el.scrollWidth - el.clientWidth,
            });
          }
        }

        /** Wer ragt über den rechten Bildrand? Nennt den Verursacher, nicht nur die Summe. */
        const zuBreit = [];
        if (d.scrollWidth > d.clientWidth) {
          for (const el of document.querySelectorAll("body *")) {
            if (unsichtbar(el)) continue;
            const k = el.getBoundingClientRect();
            if (k.right > d.clientWidth + 1) {
              zuBreit.push({
                tag: el.tagName,
                klasse: String(el.className ?? "").slice(0, 40),
                text: (el.textContent ?? "").trim().slice(0, 34),
                rechts: Math.round(k.right),
              });
            }
          }
        }

        return {
          scroll: d.scrollWidth,
          sichtbar: d.clientWidth,
          umlaute,
          gesprengt,
          zuBreit: zuBreit.slice(0, 4),
        };
      });

      const laeuftUeber = befund.scroll > befund.sichtbar;
      if (laeuftUeber) fehler += 1;
      fehler += befund.gesprengt.length;
      const engeUmlaute = befund.umlaute.filter((u) => u.reserve < 0);
      fehler += engeUmlaute.length;

      const marke = !laeuftUeber && !befund.gesprengt.length && !engeUmlaute.length ? "OK  " : "FAIL";
      console.log(
        `${marke} ${b.name.padStart(4)} px  ${pfad.padEnd(20)} ` +
          `Breite ${befund.scroll}/${befund.sichtbar}, ` +
          `${befund.umlaute.length} Versal-Umlaute, ${befund.gesprengt.length} gesprengte Kästen`,
      );

      for (const u of befund.umlaute) {
        console.log(
          `       ${u.reserve < 0 ? "FEHL" : "ok"} „${u.text}“ ${u.groesse}/${u.zeilenhoehe}` +
            ` Reserve ${u.reserve}px${u.gross ? " GROSSSCHRIFT" : ""}`,
        );
      }
      for (const g of befund.gesprengt) {
        console.log(`       FEHL ${g.tag} +${g.ueber}px: ${g.text}`);
      }
      for (const z of befund.zuBreit ?? []) {
        console.log(`       ragt raus bis ${z.rechts}px  ${z.tag}.${z.klasse} — ${z.text}`);
      }

      if (BILDER) {
        const name = pfad === "/" ? "start" : pfad.replaceAll("/", "");
        await seite.screenshot({ path: `${BILDER}/de-${name}-${b.name}.png`, fullPage: true });
      }

      await seite.close();
    }

    await kontext.close();
  }
} finally {
  await browser.close();
}

console.log(`\n${fehler} Befunde.`);
if (fehler > 0) {
  console.error("check:deutsch fehlgeschlagen — deutsche Sprache bricht das Layout.");
  process.exit(1);
}
