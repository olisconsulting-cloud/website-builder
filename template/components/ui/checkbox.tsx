import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Häkchen auf Basis eines echten `<input type="checkbox">`.
 *
 * Bewusst ohne Radix. Drei Gründe, in dieser Reihenfolge:
 *
 * 1. **Gewicht.** Die Radix-Fassung importiert aus dem Sammelpaket `radix-ui`.
 *    Auf einer Marketing-Seite mit einem einzigen Häkchen steht das in keinem
 *    Verhältnis (gemessen in `QA.md`).
 * 2. **Ohne JavaScript.** Radix rendert einen Knopf und schiebt ein
 *    verstecktes Feld nach, damit das Formular etwas abzuschicken hat. Ein
 *    echtes Eingabefeld braucht diesen Umweg nicht.
 * 3. **Zugänglichkeit.** Tastatur, Screenreader, Windows-Kontrastmodus und
 *    Sprachsteuerung kennen ein natives Häkchen. Jede Nachbildung muss das
 *    erst wieder herstellen.
 *
 * Der Haken ist als Maske gezeichnet und übernimmt damit die Textfarbe —
 * kein Bild, kein zusätzlicher Ladevorgang.
 */
const HAKEN_MASKE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='none' stroke='%23000' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round' d='M3.5 8.5l3 3 6-6'/%3E%3C/svg%3E\")";

function Checkbox({ className, style, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type="checkbox"
      data-slot="checkbox"
      className={cn(
        "peer size-4 shrink-0 appearance-none rounded-[4px] border border-input outline-none transition-colors",
        "checked:border-primary checked:bg-primary checked:text-primary-foreground",
        "checked:before:block checked:before:size-full checked:before:bg-current checked:before:content-['']",
        "checked:before:[mask-image:var(--haken)] checked:before:[mask-repeat:no-repeat] checked:before:[mask-size:100%_100%]",
        "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
        className,
      )}
      style={
        {
          "--haken": HAKEN_MASKE,
          ...style,
        } as React.CSSProperties
      }
      {...props}
    />
  );
}

export { Checkbox };
