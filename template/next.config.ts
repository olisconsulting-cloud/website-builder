import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // AVIF zuerst, WebP als Rückfall (doctrine/budget.md, Abschnitt Bilder).
    formats: ["image/avif", "image/webp"],
    // `remotePatterns` bleibt bewusst leer: Bilder liegen lokal. Wer hier
    // einen fremden Host einträgt, holt sich Drittanbieter-Aufrufe und damit
    // ein Einwilligungsthema zurück in die Seite.
    remotePatterns: [],
  },

  // Reagiert der Server mit dieser Kopfzeile nicht, raten Browser den Typ
  // selbst — und liegen manchmal falsch.
  async headers() {
    return [
      {
        source: "/:pfad*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
    ];
  },
};

export default nextConfig;
