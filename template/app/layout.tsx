import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { site } from "@/lib/site";
import { Kopfzeile } from "@/components/kopfzeile";
import { Fusszeile } from "@/components/fusszeile";

/**
 * Eine variable Familie, von Next zur Bauzeit selbst ausgeliefert — kein
 * Laufzeit-Aufruf bei Google (doctrine/budget.md, Abschnitt Schrift).
 *
 * BEIDE Subsets sind Pflicht, und die Reihenfolge ist kein Zufall — gemessen
 * an der ausgelieferten Seite, nicht geschätzt:
 *
 *   `latin`     trägt Ä Ö Ü ä ö ü ß (U+00C4–U+00DF) UND die deutschen
 *               Anführungszeichen „ “ (U+201E, U+201C).
 *   `latin-ext` trägt zusätzlich das große ẞ (U+1E9E) und die Buchstaben
 *               fremder Namen (Š, Ł, ő).
 *
 * next/font lädt genau die hier gelisteten Subsets vorab. Stand nur
 * `latin-ext` da, wurde ausgerechnet die Datei mit den normalen Buchstaben
 * NICHT vorgeladen und kam als zweiter Ladevorgang nach. Gemessen an dieser
 * Seite: FCP 1059 ms → 758 ms, LCP 2714 ms → 2562 ms.
 *
 * `swap` statt `optional`: im Vergleichslauf messbar gleich (2562 gegen
 * 2578 ms), aber `optional` verwirft die Marken-Schrift auf langsamen
 * Verbindungen ganz. Kein Gewinn, ein Verlust.
 *
 * Die Familie selbst ist eine MARKEN-Entscheidung und gehört pro Kunde
 * getauscht — hier steht nur ein tragfähiger Ausgangspunkt.
 */
const schrift = Geist({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.beschreibung}`,
    template: `%s · ${site.name}`,
  },
  description: site.beschreibung,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: site.sprache.replace("-", "_"),
    url: site.url,
    siteName: site.name,
    title: site.name,
    description: site.beschreibung,
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // `lang` ist keine Formalie: ohne sie trennt der Browser deutsche
    // Komposita nicht (hyphens greift nicht), und Screenreader sprechen die
    // Seite mit englischer Aussprache vor.
    <html lang={site.sprache} className={cn("font-sans", schrift.variable)}>
      <body className="min-h-dvh antialiased">
        <a
          href="#inhalt"
          className="sr-only rounded-md bg-background px-4 py-2 text-foreground outline-2 outline-ring focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50"
        >
          Zum Inhalt springen
        </a>
        {/* Weiches Scrollen ist ABSICHTLICH nicht eingeschaltet.
            `doctrine/budget.md` verlangt: erst CSS, eine Bibliothek nur, wenn
            das nachweislich nicht reicht. Für Ankerlinks reicht CSS —
            `scroll-behavior: smooth` steht in globals.css und kostet 0 KB.
            Lenis wiegt gemessen rund 8 KB und drückt diese Seite allein damit
            über das JavaScript-Budget (157 von 150 KB).
            Einschalten, wenn ein Projekt es wirklich braucht:
              <SanftesScrollen />
            Danach `npm run check:perf` fahren und das Ergebnis in QA.md
            eintragen — nicht einschalten und hoffen. */}
        <Kopfzeile />
        <main id="inhalt">{children}</main>
        <Fusszeile />
      </body>
    </html>
  );
}
