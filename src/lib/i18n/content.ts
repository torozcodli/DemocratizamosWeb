export type Locale = 'es' | 'en';

export type Localized<T> = {
  es: T;
  en?: T;
};

const VALID_LOCALES: Locale[] = ['es', 'en'];

/**
 * Valida y normaliza el locale desde query string.
 * Solo acepta 'es' | 'en'; cualquier otro valor se trata como 'es'.
 */
export function normalizeLocale(locale: string | undefined | null): Locale {
  const v = (locale ?? '').trim().toLowerCase();
  return VALID_LOCALES.includes(v as Locale) ? (v as Locale) : 'es';
}

/**
 * Alias para uso en APIs: deja explícito que el query ?locale= solo acepta es|en.
 */
export function getValidLocaleFromQuery(queryParam: string | undefined | null): Locale {
  return normalizeLocale(queryParam);
}

export function pickLocale<T>(
  value: Localized<T> | T | undefined | null,
  locale: string,
  fallback: Locale = 'es'
): T | undefined {
  if (value == null) return undefined;

  if (typeof value !== 'object' || Array.isArray(value)) {
    return value as T;
  }

  const obj = value as Localized<T>;
  const normalized = locale === 'en' ? 'en' : 'es';
  return (obj[normalized] ?? obj[fallback]) as T;
}

/**
 * Considera vacío: null/undefined, string vacío, solo espacios, o HTML sin texto real (tags vacíos).
 * No considerar "" como contenido.
 */
export function hasRealContent(value: unknown): boolean {
  if (value == null) return false;
  const s = typeof value === 'string' ? value : Array.isArray(value) ? (value as string[]).join('\n') : String(value);
  const trimmed = s.trim();
  if (trimmed === '') return false;
  const withoutTags = trimmed.replace(/<[^>]*>/g, '').trim();
  return withoutTags.length > 0;
}

/**
 * Para payload localizado: nunca guardar en: "".
 * Devuelve undefined si el valor está vacío (trim), sino el valor trimmeado.
 */
export function toLocalizedEn(value: string | undefined | null): string | undefined {
  const v = (value ?? '').trim();
  return v === '' ? undefined : v;
}

/**
 * Para payload localizado en español: siempre requerido; normaliza con trim para no guardar " " o HTML vacío.
 * El backend valida min(1) después de trim.
 */
export function toLocalizedEs(value: string | undefined | null): string {
  return (value ?? '').trim();
}
