import Link from "next/link";
import { Abschnitt, AbschnittKopf } from "@/components/abschnitt";

export default function NichtGefunden() {
  return (
    <Abschnitt ueberschriftId="404-titel">
      <div className="flex flex-col items-start gap-6">
        <AbschnittKopf
          als="h1"
          ueberschriftId="404-titel"
          augenbraue="Fehler 404"
          ueberschrift="Diese Seite gibt es nicht"
          vorspann="Vielleicht ist der Link alt, vielleicht hat sich ein Zeichen verlaufen. Beides lässt sich beheben."
        />
        <Link href="/" className="underline underline-offset-4">
          Zurück zur Startseite
        </Link>
      </div>
    </Abschnitt>
  );
}
