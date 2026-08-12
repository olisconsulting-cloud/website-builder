import { cn } from "@/lib/utils";

/**
 * Abschnitts-Bausteine: Struktur und Zugänglichkeit, KEINE Optik.
 *
 * Diese Datei bestimmt, wo etwas steht und wie es ausgezeichnet ist — nie,
 * wie es aussieht. Farben, Schriftgrade, Rahmen und Schatten gehören in die
 * Marken-Ebene von `app/globals.css` und in die einzelne Seite.
 *
 * Der Grund steht in decisions/000-craft-principles.md, Säule 5: Alles, was
 * zwei Seiten gleich aussehen lässt, gehört nicht ins Gerüst.
 */

/** Die Spalte, in der die Seite lebt. Breite kommt aus `--container-inhalt`. */
export function Spalte({
  className,
  ...rest
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("mx-auto w-full max-w-inhalt px-6 sm:px-8", className)}
      {...rest}
    />
  );
}

type AbschnittProps = React.ComponentProps<"section"> & {
  /**
   * Pflicht, sobald der Abschnitt eine eigene Überschrift hat: verbindet
   * <section> mit ihr, damit Screenreader die Gliederung vorlesen können.
   * Ohne diese Verbindung ist ein <section> für sie ein namenloser Kasten.
   */
  ueberschriftId?: string;
  /** Engerer vertikaler Rhythmus, z. B. für Zwischenblöcke. */
  eng?: boolean;
};

export function Abschnitt({
  ueberschriftId,
  eng = false,
  className,
  children,
  ...rest
}: AbschnittProps) {
  return (
    <section
      aria-labelledby={ueberschriftId}
      className={cn(eng ? "py-abschnitt-eng" : "py-abschnitt", className)}
      {...rest}
    >
      <Spalte>{children}</Spalte>
    </section>
  );
}

/**
 * Rangfolge in Größen übersetzt. Die Werte selbst stehen als Token in
 * `app/globals.css` und werden pro Marke getauscht — die Zuordnung
 * „h1 ist die größte Stufe" bleibt.
 */
const DISPLAY_GROESSE = {
  h1: "text-display-1",
  h2: "text-display-2",
  h3: "text-display-3",
} as const;

type AbschnittKopfProps = {
  /** Kleine Zeile über der Überschrift. Optional — kein Pflicht-Ornament. */
  augenbraue?: string;
  ueberschrift: string;
  ueberschriftId: string;
  /** Als was die Überschrift ausgezeichnet wird. Genau ein h1 pro Seite. */
  als?: "h1" | "h2" | "h3";
  /** Ein Satz darunter. Auf Deutsch höchstens 150 Zeichen (de-kalibrierung §1). */
  vorspann?: string;
  className?: string;
};

export function AbschnittKopf({
  augenbraue,
  ueberschrift,
  ueberschriftId,
  als: Ueberschrift = "h2",
  vorspann,
  className,
}: AbschnittKopfProps) {
  return (
    <header className={cn("flex flex-col gap-3", className)}>
      {augenbraue ? (
        <p className="text-sm text-muted-foreground">{augenbraue}</p>
      ) : null}
      {/* `display-de` trägt Buchstabenabstand, Zeilenhöhe und die Reserve für
          Versal-Umlaute. Die Größe kommt aus der Rangfolge, nicht aus dem
          Gefühl — ohne Größenstufe rendert eine h1 in Browser-Standard 16 px
          und der Umlaut ragt aus seiner Zeile. */}
      <Ueberschrift
        id={ueberschriftId}
        className={cn("display-de text-balance", DISPLAY_GROESSE[Ueberschrift])}
      >
        {ueberschrift}
      </Ueberschrift>
      {vorspann ? <p className="lesetext">{vorspann}</p> : null}
    </header>
  );
}
