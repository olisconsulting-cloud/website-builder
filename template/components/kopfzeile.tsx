import Link from "next/link";
import { Spalte } from "@/components/abschnitt";
import { site } from "@/lib/site";

/**
 * Struktur einer Kopfzeile — Landmarke, Navigation, Sprungziele.
 * Aussehen kommt pro Projekt dazu. Hier steht nur, was jede Seite braucht.
 */
export function Kopfzeile() {
  return (
    <header>
      {/* `flex-wrap` ist hier kein Detail: Bei 320 px passen Wortmarke und
          Navigation nicht nebeneinander, und ohne Umbruch schiebt die
          Navigation die ganze Seite nach rechts (gemessen: 332 statt 320 px).
          Deutsche Menüpunkte sind länger als englische — „Leistungen" gegen
          „Services". */}
      <Spalte className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 py-5">
        <Link href="/" className="font-medium tracking-display">
          {site.name}
        </Link>

        <nav aria-label="Hauptnavigation">
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            <li>
              <Link href="#leistungen">Leistungen</Link>
            </li>
            <li>
              <Link href="#ueber-uns">Über uns</Link>
            </li>
            <li>
              <Link href="#kontakt">Kontakt</Link>
            </li>
          </ul>
        </nav>
      </Spalte>
    </header>
  );
}
