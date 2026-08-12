import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Beschriftung auf Basis eines echten `<label>`.
 *
 * Radix' Label-Baustein leistet genau eine Sache mehr: Er leitet Klicks auch
 * an Bedienelemente weiter, die keine echten Eingabefelder sind. Da in diesem
 * Gerüst ausschließlich native Felder stehen, erledigt `htmlFor` das bereits —
 * und das Sammelpaket `radix-ui` bleibt aus dem Bündel.
 */
function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      data-slot="label"
      className={cn(
        // `inline-flex` statt `flex`: Als Block-Flex zerlegt die Beschriftung
        // mehrzeiligen Fließtext in Flex-Elemente — eine Einwilligungszeile mit
        // eingebettetem Link bricht dann in eine schmale Spalte, und der Punkt
        // am Satzende landet allein. Für Beschriftungen mit Symbol reicht
        // `inline-flex`; wer echten Fließtext braucht, setzt `block` dazu.
        "inline-flex items-center gap-2 text-sm leading-none font-medium select-none",
        "group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50",
        "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Label };
