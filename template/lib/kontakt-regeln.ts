/**
 * Grenzwerte und Fehlertexte des Kontaktformulars — die EINE Quelle.
 *
 * Bewusst ohne Zod: Diese Datei wird auch vom Browser geladen. Zod wiegt
 * gemessen rund 60 KB und gehört dorthin, wo die verbindliche Prüfung
 * stattfindet — auf den Server. Der Browser braucht nur die Zahlen und die
 * Sätze, und die stehen hier.
 *
 * `lib/kontakt-schema.ts` baut daraus das Zod-Schema für den Server,
 * `components/kontakt-formular.tsx` baut daraus die Sofortprüfung im Browser.
 * Wer eine Grenze ändert, ändert sie hier — und beide Seiten ziehen nach.
 */

export const GRENZEN = {
  nameMin: 2,
  nameMax: 80,
  telefonMax: 40,
  nachrichtMin: 10,
  nachrichtMax: 2000,
} as const;

/**
 * Fehlertexte in der zweiten Person. Sie sagen, was zu tun ist, nicht was
 * falsch war — „Bitte trag deinen Namen ein“ statt „Feld ungültig“.
 */
export const TEXTE = {
  nameFehlt: "Bitte trag deinen Namen ein.",
  nameZuLang: `Höchstens ${GRENZEN.nameMax} Zeichen.`,
  emailFehlt: "Ohne E-Mail können wir nicht antworten.",
  emailUnvollstaendig: "Diese Adresse sieht nicht vollständig aus.",
  telefonZuLang: `Höchstens ${GRENZEN.telefonMax} Zeichen.`,
  nachrichtZuKurz: "Ein paar Worte mehr helfen uns weiter.",
  nachrichtZuLang: `Höchstens ${GRENZEN.nachrichtMax} Zeichen.`,
  einwilligungFehlt: "Ohne deine Einwilligung dürfen wir die Daten nicht verarbeiten.",
} as const;

/**
 * Absichtlich lax. Eine Adresse endgültig zu prüfen geht nur, indem man ihr
 * schreibt — jede strengere Regel sperrt irgendwann gültige Adressen aus.
 */
export const EMAIL_MUSTER = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Honigtopf-Feld. Für Menschen unsichtbar und aus der Tabreihenfolge genommen,
 * für einfache Bots ein Pflichtfeld, das sie ausfüllen. Der Feldname sieht
 * absichtlich echt aus.
 */
export const HONIGTOPF_FELD = "website";

/**
 * Ein Häkchen kommt als FormData nicht als `true` an, sondern als `"on"` —
 * oder gar nicht. Die Umwandlung steht hier, damit Browser und Server
 * dieselbe Vorstellung von „angehakt“ haben.
 */
export function alsHaken(wert: FormDataEntryValue | null): boolean {
  return wert === "on" || wert === "true";
}

/**
 * Antwortzustand der Server Action.
 *
 * Steht hier und NICHT in `app/actions/kontakt.ts`: Eine Datei mit
 * `"use server"` darf ausschließlich asynchrone Funktionen exportieren. Ein
 * exportiertes Objekt daneben lässt den Aufruf zur Laufzeit mit 500 scheitern —
 * und `next build` meldet das nicht. Teuer gelernt, siehe QA.md.
 */
export type KontaktZustand = {
  status: "leer" | "ok" | "fehler";
  meldung?: string;
  /** Feldname -> Fehlertext. Wird neben dem jeweiligen Feld ausgegeben. */
  felder?: Record<string, string>;
};

export const LEERER_ZUSTAND: KontaktZustand = { status: "leer" };

/** Die Form der Daten. Zod leitet sein Schema hiervon ab, nicht umgekehrt. */
export type KontaktDaten = {
  name: string;
  email: string;
  telefon?: string;
  nachricht: string;
  einwilligung: boolean;
};
