const EXPERIENCE_TZ = 'America/Mexico_City';

function parseSafeDate(iso: string): Date | null {
  const isDateOnly = /^\d{4}-\d{2}-\d{2}$/.test(iso);
  const d = new Date(isDateOnly ? `${iso}T12:00:00.000Z` : iso);
  return Number.isNaN(d.getTime()) ? null : d;
}

function hasTimeComponent(iso: string): boolean {
  return iso.includes('T');
}

/**
 * Formatea fecha y horario de una experiencia para mostrar en cards.
 * Usa timezone America/Mexico_City para consistencia entre servidor y cliente.
 * Formato 24h. Retorna null si no hay startDate válido.
 *
 * Casos:
 *   sin startDate                             → null
 *   "2026-08-01"          (sin hora)          → "1 de agosto de 2026"
 *   "2026-08-01T16:00Z"   (solo start)        → "1 de agosto de 2026 · 10:00"
 *   start + end mismo día                     → "1 de agosto de 2026 · 10:00 – 18:00"
 *   start + end días distintos                → "1 de agosto de 2026, 10:00 – 2 de agosto de 2026, 18:00"
 */
export function formatExperienceDateTime(
  startDate: string | null | undefined,
  endDate: string | null | undefined,
  locale: string
): string | null {
  if (!startDate) return null;
  const start = parseSafeDate(startDate);
  if (!start) return null;

  const fmtDate = (d: Date) =>
    new Intl.DateTimeFormat(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: EXPERIENCE_TZ,
    }).format(d);

  const fmtTime = (d: Date) =>
    new Intl.DateTimeFormat(locale, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: EXPERIENCE_TZ,
    }).format(d);

  const startDateStr = fmtDate(start);
  const startHasTime = hasTimeComponent(startDate);

  if (!startHasTime) {
    if (!endDate) return startDateStr;
    const end = parseSafeDate(endDate);
    if (!end) return startDateStr;
    const endDateStr = fmtDate(end);
    return startDateStr === endDateStr ? startDateStr : `${startDateStr} – ${endDateStr}`;
  }

  const startTimeStr = fmtTime(start);

  if (!endDate) return `${startDateStr} · ${startTimeStr}`;
  const end = parseSafeDate(endDate);
  if (!end) return `${startDateStr} · ${startTimeStr}`;

  const endDateStr = fmtDate(end);
  const endHasTime = hasTimeComponent(endDate);

  if (startDateStr === endDateStr) {
    if (!endHasTime) return `${startDateStr} · ${startTimeStr}`;
    return `${startDateStr} · ${startTimeStr} – ${fmtTime(end)}`;
  }

  const endPart = endHasTime
    ? `${endDateStr}, ${fmtTime(end)}`
    : endDateStr;
  return `${startDateStr}, ${startTimeStr} – ${endPart}`;
}
