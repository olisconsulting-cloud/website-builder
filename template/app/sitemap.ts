import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

/**
 * Kommt eine Unterseite dazu, gehört sie hier hinein. Eine Sitemap, die drei
 * von acht Seiten kennt, ist schlechter als keine — sie sagt der Suchmaschine,
 * die anderen fünf seien unwichtig.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const stand = new Date();

  return [
    { url: `${site.url}/`, lastModified: stand, changeFrequency: "monthly", priority: 1 },
    { url: `${site.url}/impressum`, lastModified: stand, changeFrequency: "yearly", priority: 0.2 },
    { url: `${site.url}/datenschutz`, lastModified: stand, changeFrequency: "yearly", priority: 0.2 },
    { url: `${site.url}/barrierefreiheit`, lastModified: stand, changeFrequency: "yearly", priority: 0.2 },
  ];
}
