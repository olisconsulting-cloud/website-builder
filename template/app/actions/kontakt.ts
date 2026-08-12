"use server";

import { alsHaken, HONIGTOPF_FELD, type KontaktZustand } from "@/lib/kontakt-regeln";
import { kontaktSchema } from "@/lib/kontakt-schema";

// Diese Datei exportiert ABSICHTLICH nur eine einzige asynchrone Funktion.
// Zustandstyp und Startwert stehen in `lib/kontakt-regeln.ts` — eine
// `"use server"`-Datei darf nichts anderes exportieren, sonst antwortet der
// Server bei jedem Absenden mit 500. Der Bau meldet diesen Fehler NICHT.

/**
 * Nimmt eine Kontaktanfrage entgegen.
 *
 * Die Prüfung im Browser ist Bequemlichkeit. Verbindlich ist ausschließlich
 * das, was hier passiert — clientseitige Prüfung lässt sich mit zwei Zeilen
 * umgehen.
 */
export async function sendeKontakt(
  _bisher: KontaktZustand,
  formular: FormData,
): Promise<KontaktZustand> {
  // Honigtopf: Ein Mensch sieht das Feld nicht und füllt es nie aus. Ist es
  // gefüllt, war es ein Bot. Wir melden trotzdem Erfolg — eine ehrliche
  // Fehlermeldung wäre für die Gegenseite eine Lernhilfe.
  if (String(formular.get(HONIGTOPF_FELD) ?? "").length > 0) {
    return { status: "ok", meldung: "Danke, deine Nachricht ist angekommen." };
  }

  const geprueft = kontaktSchema.safeParse({
    name: formular.get("name"),
    email: formular.get("email"),
    telefon: formular.get("telefon") ?? "",
    nachricht: formular.get("nachricht"),
    einwilligung: alsHaken(formular.get("einwilligung")),
  });

  if (!geprueft.success) {
    const felder: Record<string, string> = {};
    for (const problem of geprueft.error.issues) {
      const feld = String(problem.path[0] ?? "");
      if (feld && !felder[feld]) felder[feld] = problem.message;
    }
    return {
      status: "fehler",
      meldung: "Bitte sieh dir die markierten Felder noch einmal an.",
      felder,
    };
  }

  try {
    await zustellen(geprueft.data);
  } catch (fehler) {
    console.error("[kontakt] Zustellung fehlgeschlagen:", fehler);
    return {
      status: "fehler",
      meldung:
        "Das hat gerade nicht geklappt. Schreib uns bitte direkt per E-Mail — die Adresse steht im Impressum.",
    };
  }

  return {
    status: "ok",
    meldung: "Danke, deine Nachricht ist angekommen. Wir melden uns.",
  };
}

/**
 * Die Strecke hinter dem Formular — pro Projekt zu füllen.
 *
 * Bewusst unfertig und bewusst laut: In Produktion ohne konfigurierten
 * Empfänger zu starten hieße, Anfragen still zu verlieren. Das ist der
 * teuerste denkbare Fehler auf einer Marketing-Seite, deshalb bricht die
 * Funktion hier ab statt so zu tun, als sei alles gut.
 */
async function zustellen(daten: {
  name: string;
  email: string;
  telefon?: string;
  nachricht: string;
}): Promise<void> {
  const empfaenger = process.env.KONTAKT_EMPFAENGER;

  if (!empfaenger) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "KONTAKT_EMPFAENGER ist nicht gesetzt — die Anfrage hätte niemanden erreicht.",
      );
    }
    console.info("[kontakt] Entwicklungsmodus, keine Zustellung:", daten);
    return;
  }

  // TODO pro Projekt: E-Mail-Versand oder CRM-Anbindung einsetzen.
  // Zugangsdaten ausschließlich über process.env, nie im Code.
  console.info(`[kontakt] Anfrage für ${empfaenger}:`, daten);
}
