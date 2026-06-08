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
 * Mapea DTO lite de Suma Impacto a shape de card interna.
 * Sin I/O: no fetch, no env, no reglas de publicación de Suma.
 */
export function adaptSumaExperiencesToCards(
  items: SumaImpactoLiteItem[]
): DemocratizamosExperienceCard[] {
  return items
    .filter((item) => {
      const name = item.name?.trim();
      const redirect = item.redirectUrl?.trim();
      return Boolean(name && redirect);
    })
    .map((item) => {
      const title = item.name!.trim();
      const ctaHref = item.redirectUrl!.trim();
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
