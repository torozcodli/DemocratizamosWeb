import type { DemocratizamosExperienceCard, SumaImpactoLiteExperience } from './types';

const LOCATION_FALLBACK = 'Por confirmar';

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
 * Mapea DTO lite de Suma Impacto a shape de card interna.
 * Sin I/O: no fetch, no env, no reglas de publicación de Suma.
 */
export function adaptSumaExperiencesToCards(
  items: SumaImpactoLiteExperience[]
): DemocratizamosExperienceCard[] {
  return items
    .filter((item) => {
      const name = item.name?.trim();
      const reserve = item.reserveUrl?.trim();
      return Boolean(name && reserve);
    })
    .map((item) => {
      const title = item.name!.trim();
      const ctaHref = item.reserveUrl!.trim();
      const description = stripHtmlForCardDescription(
        item.description != null ? String(item.description) : ''
      );

      const imageUrl =
        item.imageUrl != null && String(item.imageUrl).trim() !== ''
          ? String(item.imageUrl).trim()
          : null;

      const loc = item.location;
      const mod = item.modality;
      const location =
        (typeof loc === 'string' && loc.trim() !== '' ? loc.trim() : null) ??
        (typeof mod === 'string' && mod.trim() !== '' ? mod.trim() : null) ??
        LOCATION_FALLBACK;

      const publicTrim = item.publicUrl?.trim();
      const href = publicTrim && publicTrim.length > 0 ? publicTrim : ctaHref;

      const types = item.types;
      const category =
        Array.isArray(types) && types.length > 0 && String(types[0]).trim() !== ''
          ? String(types[0]).trim()
          : undefined;

      const id = item.id?.trim() && item.id.trim().length > 0 ? item.id.trim() : ctaHref;

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
        href,
        ctaHref,
      };
    });
}
