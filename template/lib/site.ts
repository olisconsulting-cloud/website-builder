/**
 * Einzige Quelle für die Stammdaten einer Seite.
 *
 * Beim Kopieren nach `sites/kunde-name/` wird DIESE Datei angepasst — nicht
 * die Komponenten. Metadaten, Sitemap, JSON-LD, Impressum und Formular ziehen
 * alle von hier. Wer eine Firmenangabe zweimal im Code findet, hat einen Bug
 * gefunden.
 */

export const site = {
  /** Kurzname für Titel, Logo-Text, Copyright. */
  name: "Musterfirma",
  /** Vollständige Firmierung für Impressum und JSON-LD. */
  firmierung: "Musterfirma GmbH",
  /**
   * Kanonische Adresse ohne abschließenden Schrägstrich. In Produktion über
   * NEXT_PUBLIC_SITE_URL setzen — Sitemap, Canonical und Open Graph brauchen
   * eine absolute URL.
   */
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  /** Sprache der Seite. Steuert <html lang> und hreflang. */
  sprache: "de-DE",
  /** Ein Satz, was die Firma macht. Wird zur Meta-Description. Max 155 Zeichen. */
  beschreibung:
    "Platzhalter: Was diese Firma tut, in einem Satz — konkret, ohne Werbefloskel.",

  kontakt: {
    email: "kontakt@example.de",
    telefon: "+49 30 000000",
    strasse: "Musterstraße 1",
    plz: "10115",
    ort: "Berlin",
    land: "DE",
  },

  /** Impressumspflicht nach § 5 DDG. Leere Felder fallen in der Ausgabe weg. */
  rechtliches: {
    vertretung: "Vorname Nachname",
    registergericht: "Amtsgericht Musterstadt",
    registernummer: "HRB 000000",
    umsatzsteuerId: "DE000000000",
    /** Nur bei kammerpflichtigen Berufen ausfüllen. */
    aufsichtsbehoerde: "",
    datenschutzbeauftragter: "",
  },

  /**
   * Barrierefreiheitserklärung nach BFSG. Stand-Datum bei jeder Prüfung
   * nachziehen — ein altes Datum ist schlechter als keines.
   */
  barrierefreiheit: {
    stand: "2026-07-28",
    /** "vollstaendig" | "teilweise" — ehrlich ausfüllen, nicht optimistisch. */
    konformitaet: "teilweise" as "vollstaendig" | "teilweise",
    meldeadresse: "barrierefreiheit@example.de",
  },
} as const;

export type Site = typeof site;
