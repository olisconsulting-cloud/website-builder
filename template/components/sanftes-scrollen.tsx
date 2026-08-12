"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Weiches Scrollen mit genau EINER Bildschleife.
 *
 * `autoRaf: false` plus eigener `requestAnimationFrame`-Aufruf ist Absicht:
 * Lenis' eingebaute Schleife neben einer zweiten Animations-Schleife ergibt
 * zwei Taktgeber pro Bild, und das ruckelt sichtbar (doctrine/budget.md).
 *
 * Kommt später GSAP dazu, wird das `raf(zeit)` unten NICHT parallel betrieben,
 * sondern an GSAPs Ticker gehängt:
 *
 *   gsap.ticker.add((zeit) => lenis.raf(zeit * 1000));
 *   gsap.ticker.lagSmoothing(0);
 *
 * Dann die eigene rAF-Schleife hier entfernen — sonst sind es wieder zwei.
 *
 * Bei `prefers-reduced-motion` läuft Lenis gar nicht erst an. Übernommenes
 * Scrollen ist für vestibulär empfindliche Menschen keine Feinheit, sondern
 * ein Ausschluss.
 */
export function SanftesScrollen() {
  useEffect(() => {
    const sparsam = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (sparsam.matches) return;

    const lenis = new Lenis({ autoRaf: false });
    let bild = 0;

    const raf = (zeit: number) => {
      lenis.raf(zeit);
      bild = requestAnimationFrame(raf);
    };
    bild = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(bild);
      lenis.destroy();
    };
  }, []);

  return null;
}
