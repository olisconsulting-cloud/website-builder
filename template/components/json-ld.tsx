/**
 * Gibt einen JSON-LD-Block aus.
 *
 * `JSON.stringify` wird hier bewusst nicht zusätzlich entschärft: Die Daten
 * stammen aus `lib/site.ts` und aus dem eigenen Inhalt, nicht aus
 * Nutzereingaben. Sobald hier jemals Fremdtext hineinfließt — Bewertungen,
 * Kommentare, irgendetwas aus einer Datenbank — muss `<` maskiert werden.
 * Sonst ist das eine Skript-Lücke.
 */
export function JsonLd({ daten }: { daten: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(daten) }}
    />
  );
}
