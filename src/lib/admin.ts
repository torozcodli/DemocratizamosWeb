/**
 * Helper functions for admin authorization
 * 
 * Security: Uses whitelist-based approach for maximum security.
 * ADMIN_DOMAIN is only used if explicitly enabled via ADMIN_DOMAIN_ENABLED=true
 * and should be combined with additional allowlist for production use.
 */

export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;

  // Primary check: ADMIN_EMAILS whitelist (most secure)
  const adminEmails = process.env.ADMIN_EMAILS?.split(',').map((e) => e.trim()) || [];
  if (adminEmails.includes(email)) {
    return true;
  }

  // Secondary check: ADMIN_DOMAIN (only if explicitly enabled)
  // WARNING: This grants admin access to ALL users with this domain
  // Only enable in staging/dev or combine with additional allowlist
  const adminDomain = process.env.ADMIN_DOMAIN;
  const domainEnabled = process.env.ADMIN_DOMAIN_ENABLED === 'true';
  
  if (adminDomain && domainEnabled && email.endsWith(`@${adminDomain}`)) {
    // Optional: Additional domain allowlist for extra security
    // If ADMIN_DOMAIN_ALLOWLIST is set, user must also be in that list
    const domainAllowlist = process.env.ADMIN_DOMAIN_ALLOWLIST?.split(',').map((e) => e.trim()) || [];
    if (domainAllowlist.length > 0) {
      return domainAllowlist.includes(email);
    }
    return true;
  }

  return false;
}
