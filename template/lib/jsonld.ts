import type { BreadcrumbList, FAQPage, Organization, WithContext } from "schema-dts";
import { site } from "@/lib/site";

/**
 * Strukturierte Daten für Suchmaschinen.
 *
 * Warum das hier steht und nicht in einer Design-Doktrin: Keine der geprüften
 * Design-Quellen kennt Auffindbarkeit. Eine schöne Seite, die niemand findet,
 * ist bei einer Marketing-Seite kein halber Erfolg, sondern keiner.
 *
 * Regel: Ausgezeichnet wird nur, was auf der Seite auch sichtbar steht.
 * Erfundene Bewertungen oder Preise sind ein Verstoß gegen Googles
 * Richtlinien und fliegen früher oder später raus.
 */

export function organisation(): WithContext<Organization> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.firmierung,
    url: site.url,
    description: site.beschreibung,
    email: site.kontakt.email,
    telephone: site.kontakt.telefon,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.kontakt.strasse,
      postalCode: site.kontakt.plz,
      addressLocality: site.kontakt.ort,
      addressCountry: site.kontakt.land,
    },
  };
}

export function brotkrumen(
  pfade: ReadonlyArray<{ name: string; pfad: string }>,
): WithContext<BreadcrumbList> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: pfade.map((eintrag, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: eintrag.name,
      item: `${site.url}${eintrag.pfad}`,
    })),
  };
}

export function fragenUndAntworten(
  eintraege: ReadonlyArray<{ frage: string; antwort: string }>,
): WithContext<FAQPage> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: eintraege.map((eintrag) => ({
      "@type": "Question",
      name: eintrag.frage,
      acceptedAnswer: { "@type": "Answer", text: eintrag.antwort },
    })),
  };
}
