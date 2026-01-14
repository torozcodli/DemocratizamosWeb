/**
 * Helper functions for admin authorization
 */

export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;

  // Check if email is in ADMIN_EMAILS list
  const adminEmails = process.env.ADMIN_EMAILS?.split(',').map((e) => e.trim()) || [];
  if (adminEmails.includes(email)) {
    return true;
  }

  // Check if email domain matches ADMIN_DOMAIN
  const adminDomain = process.env.ADMIN_DOMAIN;
  if (adminDomain && email.endsWith(`@${adminDomain}`)) {
    return true;
  }

  return false;
}
