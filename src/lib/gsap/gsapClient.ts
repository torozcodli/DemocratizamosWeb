'use client';

type GsapModule = typeof import('gsap');
let gsapCache: GsapModule | null = null;

/**
 * Lazy-loads gsap and gsap/ScrollTrigger, registers ScrollTrigger, and returns gsap.
 * Cached so we don't reimport on repeated calls.
 * Uses .default when present (ESM/Next.js dynamic import).
 */
export async function getGsap(): Promise<GsapModule> {
  if (gsapCache) {
    return gsapCache;
  }
  const [gsapMod, stMod] = await Promise.all([
    import('gsap'),
    import('gsap/ScrollTrigger'),
  ]);
  const gsap = (gsapMod as { default?: GsapModule }).default ?? gsapMod;
  const ScrollTrigger = (stMod as { default?: unknown }).default ?? stMod;
  if (typeof gsap?.registerPlugin === 'function') {
    gsap.registerPlugin(ScrollTrigger);
  }
  gsapCache = gsap as GsapModule;
  return gsapCache;
}

/** Call after layout changes so ScrollTrigger recalculates. Use gsap from getGsap(); (gsap as any).ScrollTrigger?.refresh() if needed. */
export async function refreshScrollTrigger(): Promise<void> {
  const gsap = await getGsap();
  const st = (gsap as unknown as { ScrollTrigger?: { refresh: () => void } }).ScrollTrigger;
  st?.refresh();
}
