import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = site.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Vorschaubild für geteilte Links (WhatsApp, LinkedIn, Slack).
 *
 * Bewusst schmucklos: Das hier ist ein Rückfall, damit ein geteilter Link nie
 * nackt aussieht — kein Gestaltungsvorschlag. Pro Projekt gehört hier die
 * Marke hin, oder die Datei wird durch ein statisches `opengraph-image.png`
 * ersetzt.
 *
 * Erzeugt zur Bauzeit auf unserem Server. Keine externe Anfrage, keine Schrift
 * von fremden Servern.
 */
export default function OgBild() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          gap: 20,
          padding: 80,
          background: "#0b0b0c",
          color: "#fafafa",
        }}
      >
        <div style={{ fontSize: 64, letterSpacing: "-0.03em", lineHeight: 1.05 }}>
          {site.name}
        </div>
        <div style={{ fontSize: 30, color: "#a1a1aa", lineHeight: 1.3 }}>
          {site.beschreibung}
        </div>
      </div>
    ),
    size,
  );
}
