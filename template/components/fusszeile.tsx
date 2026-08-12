import Link from "next/link";
import { Spalte } from "@/components/abschnitt";
import { site } from "@/lib/site";

/**
 * Die drei Rechts-Links sind in Deutschland keine Kür:
 * Impressum (§ 5 DDG), Datenschutzerklärung (Art. 13 DSGVO) und seit dem
 * 28.06.2025 die Barrierefreiheitserklärung (BFSG). Sie müssen von jeder
 * Seite aus mit einem Klick erreichbar sein.
 */
export function Fusszeile() {
  const jahr = new Date().getFullYear();

  return (
    <footer className="py-abschnitt-eng">
      <Spalte className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          © {jahr} {site.firmierung}
        </p>

        <nav aria-label="Rechtliches">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {/* `prefetch={false}`: Next lädt sichtbare Links sonst im
                Hintergrund vor. Bei drei Rechtsseiten, die kaum jemand
                aufruft, sind das drei Anfragen, die dem Aufmacher Bandbreite
                wegnehmen — gemessen im Netzwerk-Mitschnitt. */}
            <li>
              <Link href="/impressum" prefetch={false}>
                Impressum
              </Link>
            </li>
            <li>
              <Link href="/datenschutz" prefetch={false}>
                Datenschutz
              </Link>
            </li>
            <li>
              <Link href="/barrierefreiheit" prefetch={false}>
                Barrierefreiheit
              </Link>
            </li>
          </ul>
        </nav>
      </Spalte>
    </footer>
  );
}
