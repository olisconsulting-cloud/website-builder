import { z } from "zod";
import { EMAIL_MUSTER, GRENZEN, TEXTE, type KontaktDaten } from "@/lib/kontakt-regeln";

/**
 * Die verbindliche Prüfung. Läuft NUR auf dem Server.
 *
 * Diese Datei darf keine Client-Komponente importieren — sonst wandert Zod
 * (gemessen ~60 KB) in das Bündel, das jeder Besucher lädt. Der Browser prüft
 * mit denselben Grenzen aus `kontakt-regeln.ts`, aber ohne Bibliothek.
 *
 * Dass es zwei Prüfungen gibt, ist kein Versehen: Die im Browser ist
 * Bequemlichkeit und mit zwei Zeilen zu umgehen. Verbindlich ist nur die hier.
 */
export const kontaktSchema = z.object({
  name: z
    .string()
    .trim()
    .min(GRENZEN.nameMin, { message: TEXTE.nameFehlt })
    .max(GRENZEN.nameMax, { message: TEXTE.nameZuLang }),

  email: z
    .string()
    .trim()
    .min(1, { message: TEXTE.emailFehlt })
    .regex(EMAIL_MUSTER, { message: TEXTE.emailUnvollstaendig }),

  telefon: z
    .string()
    .trim()
    .max(GRENZEN.telefonMax, { message: TEXTE.telefonZuLang })
    .optional()
    .or(z.literal("")),

  nachricht: z
    .string()
    .trim()
    .min(GRENZEN.nachrichtMin, { message: TEXTE.nachrichtZuKurz })
    .max(GRENZEN.nachrichtMax, { message: TEXTE.nachrichtZuLang }),

  /**
   * Einwilligung nach Art. 6 Abs. 1 lit. a DSGVO. Muss aktiv gesetzt werden —
   * eine vorausgewählte Box ist keine Einwilligung (EuGH C-673/17, Planet49).
   */
  einwilligung: z.boolean().refine((gesetzt) => gesetzt === true, {
    message: TEXTE.einwilligungFehlt,
  }),
});

/** Gegenprobe zur Bauzeit: Schema und gemeinsamer Typ dürfen nicht auseinanderlaufen. */
const _typpruefung: KontaktDaten = {} as z.infer<typeof kontaktSchema>;
void _typpruefung;
