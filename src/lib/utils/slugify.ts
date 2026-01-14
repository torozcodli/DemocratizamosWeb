/**
 * Convierte un string a slug (URL-friendly)
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
}

/**
 * Genera un slug único agregando un sufijo numérico si es necesario
 */
export async function generateUniqueSlug(
  baseSlug: string,
  checkExists: (slug: string) => Promise<boolean>,
  maxAttempts = 10
): Promise<string> {
  let slug = baseSlug;
  let attempt = 0;

  while (await checkExists(slug) && attempt < maxAttempts) {
    attempt++;
    slug = `${baseSlug}-${attempt + 1}`;
  }

  if (attempt >= maxAttempts) {
    throw new Error('No se pudo generar un slug único después de múltiples intentos');
  }

  return slug;
}
