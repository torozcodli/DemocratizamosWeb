import { getExperienceSortTimestamp } from './formatters';
import type { SumaImpactoLiteItem } from './schema';
import type { DemocratizamosExperienceCard } from './types';

const LOCATION_FALLBACK = 'Por confirmar';
const DESCRIPTION_WORD_LIMIT = 10;

function truncateWords(value: string, limit = DESCRIPTION_WORD_LIMIT): string {
  const normalized = value.trim().replace(/\s+/g, ' ');
  if (!normalized) return '';
  const words = normalized.split(' ');
  if (words.length <= limit) return normalized;
  return `${words.slice(0, limit).join(' ')}...`;
}

/**
 * Quita etiquetas HTML y colapsa espacios para mostrar texto plano en cards.
 * No usa DOM ni dangerouslySetInnerHTML.
 */
export function stripHtmlForCardDescription(raw: string): string {
  if (!raw) return '';
  return raw
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Convierte el valor canónico de cost de Suma a un label legible para el usuario.
 * Retorna undefined para valores nulos, vacíos o no reconocidos.
 * No expone el raw enum al usuario final.
 */
export function mapSumaCostToLabel(cost?: string | null): string | undefined {
  if (!cost || cost.trim() === '') return undefined;
  const normalized = cost.trim().toUpperCase();
  if (normalized === 'FREE') return 'Gratuito';
  if (normalized === 'PAID') return 'De pago';
  if (normalized === 'SUBSIDY') return 'Subsidio';
  return undefined;
}

const MODALITY_LABELS: Record<string, string> = {
  in_person: 'Presencial',
  presencial: 'Presencial',
  online: 'En línea',
  en_linea: 'En línea',
  hybrid: 'Híbrido',
  hibrido: 'Híbrido',
};

/**
 * Normaliza el valor de modality de Suma a un label legible para el usuario.
 * Acepta variantes en inglés (in_person, online, hybrid) y español (presencial, híbrido).
 * Para valores no reconocidos retorna el raw trimmed — puede ser un string legible de Suma.
 * Retorna null para valores nulos, vacíos o no-string.
 */
export function mapSumaModalityToLabel(raw: unknown): string | null {
  if (typeof raw !== 'string') return null;
  const trimmed = raw.trim();
  if (trimmed === '') return null;

  const key = trimmed
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[\s-]+/g, '_');

  return MODALITY_LABELS[key] ?? trimmed;
}

/**
 * Resuelve imageUrl de Suma a URL absoluta usable en el browser.
 * Rutas relativas de Suma se resuelven contra sumaBaseUrl.
 * Assets locales de Democratizados (/images/...) no se reescriben.
 */
export function resolveExperienceImageUrl(
  imageUrl: string | null | undefined,
  sumaBaseUrl?: string
): string | null {
  if (imageUrl == null) return null;
  const trimmed = String(imageUrl).trim();
  if (trimmed === '') return null;

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  if (trimmed.startsWith('//')) return `https:${trimmed}`;
  if (trimmed.startsWith('/images/')) return trimmed;

  if (sumaBaseUrl) {
    try {
      const base = sumaBaseUrl.endsWith('/') ? sumaBaseUrl : `${sumaBaseUrl}/`;
      return new URL(trimmed.startsWith('/') ? trimmed.slice(1) : trimmed, base).toString();
    } catch {
      return trimmed.startsWith('/') ? trimmed : null;
    }
  }

  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
}

/** Ordena por startDate ascendente (próximas primero). Sin fecha al final. */
export function sortExperienceCardsByStartDate(
  cards: DemocratizamosExperienceCard[]
): DemocratizamosExperienceCard[] {
  return [...cards].sort(
    (a, b) => getExperienceSortTimestamp(a.startDate) - getExperienceSortTimestamp(b.startDate)
  );
}

/** Adapta, resuelve imágenes contra Suma y ordena para display en /programas. */
export function prepareSumaExperienceCardsForDisplay(
  items: SumaImpactoLiteItem[],
  options: { sumaBaseUrl: string }
): DemocratizamosExperienceCard[] {
  const cards = adaptSumaExperiencesToCards(items).map((card) => ({
    ...card,
    imageUrl: resolveExperienceImageUrl(card.imageUrl, options.sumaBaseUrl),
  }));
  return sortExperienceCardsByStartDate(cards);
}

/**
 * Mapea DTO lite de Suma Impacto a shape de card interna.
 * Sin I/O: no fetch, no env, no reglas de publicación de Suma.
 */
export function adaptSumaExperiencesToCards(
  items: SumaImpactoLiteItem[]
): DemocratizamosExperienceCard[] {
  return items
    .filter((item) => {
      const name = item.name?.trim();
      const cta = item.redirectUrl?.trim() || item.publicUrl?.trim();
      return Boolean(name && cta);
    })
    .map((item) => {
      const title = item.name!.trim();
      const ctaHref = item.redirectUrl?.trim() || item.publicUrl?.trim() || '';
      const description = truncateWords(
        stripHtmlForCardDescription(
          item.description != null ? String(item.description) : ''
        )
      );

      const imageUrl =
        item.imageUrl != null && String(item.imageUrl).trim() !== ''
          ? String(item.imageUrl).trim()
          : null;

      const loc = item.location;
      const location =
        (typeof loc === 'string' && loc.trim() !== '' ? loc.trim() : null) ??
        mapSumaModalityToLabel(item.modality) ??
        LOCATION_FALLBACK;

      const publicTrim = item.publicUrl?.trim();
      const href = publicTrim && publicTrim.length > 0 ? publicTrim : ctaHref;

      const types = item.types;
      const category =
        Array.isArray(types) && types.length > 0 && String(types[0]).trim() !== ''
          ? String(types[0]).trim()
          : undefined;

      const id = item.id?.trim() && item.id.trim().length > 0 ? item.id.trim() : ctaHref;

      const organizationName =
        typeof item.organization === 'string' && item.organization.trim() !== ''
          ? item.organization.trim()
          : undefined;

      const costLabel = mapSumaCostToLabel(item.cost);

      return {
        id,
        title,
        description,
        imageUrl,
        startDate: item.startDate,
        endDate: item.endDate,
        closingDate: item.closingDate,
        category,
        location,
        organizationName,
        costLabel,
        href,
        ctaHref,
      };
    });
}
