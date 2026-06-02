import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('server-only', () => ({}));

const VALID_API_KEY = 'test-key-32chars-xxxxxxxxxxxxxxxx'; // 32 chars, not a placeholder
const VALID_ORG_ID = '507f1f77bcf86cd799439011'; // 24-char hex ObjectId

const REQUIRED = {
  SUMA_IMPACTO_BASE_URL: 'https://suma.example',
  SUMA_IMPACTO_EXPERIENCES_API_KEY: VALID_API_KEY,
  SUMA_IMPACTO_DEMOINN_ORG_ID: VALID_ORG_ID,
};

function stubRequired() {
  Object.entries(REQUIRED).forEach(([k, v]) => vi.stubEnv(k, v));
}

describe('getSumaImpactoEnv — SUMA_IMPACTO_EXPERIENCES_API_KEY', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  function stubWithKey(key: string) {
    vi.stubEnv('SUMA_IMPACTO_BASE_URL', 'https://suma.example');
    vi.stubEnv('SUMA_IMPACTO_EXPERIENCES_API_KEY', key);
    vi.stubEnv('SUMA_IMPACTO_DEMOINN_ORG_ID', VALID_ORG_ID);
  }

  it('accepts a valid key of exactly 32 characters', async () => {
    stubWithKey(VALID_API_KEY); // exactly 32 chars
    const { getSumaImpactoEnv } = await import('./env');
    expect(() => getSumaImpactoEnv()).not.toThrow();
  });

  it('accepts a valid key longer than 32 characters', async () => {
    stubWithKey('a'.repeat(64));
    const { getSumaImpactoEnv } = await import('./env');
    expect(() => getSumaImpactoEnv()).not.toThrow();
  });

  it('throws when API key is empty', async () => {
    stubWithKey('');
    const { getSumaImpactoEnv } = await import('./env');
    expect(() => getSumaImpactoEnv()).toThrow();
  });

  it('throws when API key has 31 characters', async () => {
    stubWithKey('a'.repeat(31));
    const { getSumaImpactoEnv } = await import('./env');
    expect(() => getSumaImpactoEnv()).toThrow();
  });

  it('throws when API key is the .env.example placeholder (36 chars, passes min but is blocked)', async () => {
    stubWithKey('replace-with-secure-32-plus-char-key');
    const { getSumaImpactoEnv } = await import('./env');
    expect(() => getSumaImpactoEnv()).toThrow();
  });

  it('throws when API key is "change-me"', async () => {
    stubWithKey('change-me');
    const { getSumaImpactoEnv } = await import('./env');
    expect(() => getSumaImpactoEnv()).toThrow();
  });

  it('throws when API key is "your-api-key"', async () => {
    stubWithKey('your-api-key');
    const { getSumaImpactoEnv } = await import('./env');
    expect(() => getSumaImpactoEnv()).toThrow();
  });

  it('throws when API key is "dev_demoinn_api_key_123"', async () => {
    stubWithKey('dev_demoinn_api_key_123');
    const { getSumaImpactoEnv } = await import('./env');
    expect(() => getSumaImpactoEnv()).toThrow();
  });
});

describe('getSumaImpactoEnv — SUMA_IMPACTO_DEMOINN_ORG_ID', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  function stubWithOrgId(orgId: string) {
    vi.stubEnv('SUMA_IMPACTO_BASE_URL', 'https://suma.example');
    vi.stubEnv('SUMA_IMPACTO_EXPERIENCES_API_KEY', VALID_API_KEY);
    vi.stubEnv('SUMA_IMPACTO_DEMOINN_ORG_ID', orgId);
  }

  it('accepts a valid 24-character hex ObjectId (lowercase)', async () => {
    stubWithOrgId('507f1f77bcf86cd799439011');
    const { getSumaImpactoEnv } = await import('./env');
    expect(() => getSumaImpactoEnv()).not.toThrow();
    const env = getSumaImpactoEnv();
    expect(env.orgId).toBe('507f1f77bcf86cd799439011');
  });

  it('accepts a valid 24-character hex ObjectId (uppercase)', async () => {
    stubWithOrgId('507F1F77BCF86CD799439011');
    const { getSumaImpactoEnv } = await import('./env');
    expect(() => getSumaImpactoEnv()).not.toThrow();
  });

  it('throws when orgId is empty', async () => {
    stubWithOrgId('');
    const { getSumaImpactoEnv } = await import('./env');
    expect(() => getSumaImpactoEnv()).toThrow();
  });

  it('throws when orgId is too short', async () => {
    stubWithOrgId('507f1f77bcf86cd');
    const { getSumaImpactoEnv } = await import('./env');
    expect(() => getSumaImpactoEnv()).toThrow();
  });

  it('throws when orgId is too long (25 chars)', async () => {
    stubWithOrgId('507f1f77bcf86cd799439011a');
    const { getSumaImpactoEnv } = await import('./env');
    expect(() => getSumaImpactoEnv()).toThrow();
  });

  it('throws when orgId contains non-hex characters', async () => {
    stubWithOrgId('507f1f77bcf86cd79943901g'); // 'g' is not hex
    const { getSumaImpactoEnv } = await import('./env');
    expect(() => getSumaImpactoEnv()).toThrow();
  });

  it('throws when orgId is "all"', async () => {
    stubWithOrgId('all');
    const { getSumaImpactoEnv } = await import('./env');
    expect(() => getSumaImpactoEnv()).toThrow();
  });

  it('throws when orgId is the .env.example placeholder', async () => {
    stubWithOrgId('replace-with-24-char-mongo-object-id');
    const { getSumaImpactoEnv } = await import('./env');
    expect(() => getSumaImpactoEnv()).toThrow();
  });
});

describe('getSumaImpactoEnv — SUMA_IMPACTO_API_TIMEOUT_MS', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('defaults to 8000 when env var is not set', async () => {
    stubRequired();
    const { getSumaImpactoEnv } = await import('./env');
    expect(getSumaImpactoEnv().timeoutMs).toBe(8000);
  });

  it('defaults to 8000 when env var is empty string', async () => {
    stubRequired();
    vi.stubEnv('SUMA_IMPACTO_API_TIMEOUT_MS', '');
    const { getSumaImpactoEnv } = await import('./env');
    expect(getSumaImpactoEnv().timeoutMs).toBe(8000);
  });

  it('uses the configured value when valid', async () => {
    stubRequired();
    vi.stubEnv('SUMA_IMPACTO_API_TIMEOUT_MS', '5000');
    const { getSumaImpactoEnv } = await import('./env');
    expect(getSumaImpactoEnv().timeoutMs).toBe(5000);
  });

  it('accepts the minimum value (1000)', async () => {
    stubRequired();
    vi.stubEnv('SUMA_IMPACTO_API_TIMEOUT_MS', '1000');
    const { getSumaImpactoEnv } = await import('./env');
    expect(getSumaImpactoEnv().timeoutMs).toBe(1000);
  });

  it('accepts the maximum value (30000)', async () => {
    stubRequired();
    vi.stubEnv('SUMA_IMPACTO_API_TIMEOUT_MS', '30000');
    const { getSumaImpactoEnv } = await import('./env');
    expect(getSumaImpactoEnv().timeoutMs).toBe(30000);
  });

  it('throws when value is below minimum (999)', async () => {
    stubRequired();
    vi.stubEnv('SUMA_IMPACTO_API_TIMEOUT_MS', '999');
    const { getSumaImpactoEnv } = await import('./env');
    expect(() => getSumaImpactoEnv()).toThrow();
  });

  it('throws when value exceeds maximum (30001)', async () => {
    stubRequired();
    vi.stubEnv('SUMA_IMPACTO_API_TIMEOUT_MS', '30001');
    const { getSumaImpactoEnv } = await import('./env');
    expect(() => getSumaImpactoEnv()).toThrow();
  });

  it('throws when value is not numeric', async () => {
    stubRequired();
    vi.stubEnv('SUMA_IMPACTO_API_TIMEOUT_MS', 'fast');
    const { getSumaImpactoEnv } = await import('./env');
    expect(() => getSumaImpactoEnv()).toThrow();
  });
});

describe('getSumaImpactoEnv — SUMA_IMPACTO_API_CACHE_TTL_SECONDS', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('defaults to 1800 when env var is not set', async () => {
    stubRequired();
    const { getSumaImpactoEnv } = await import('./env');
    expect(getSumaImpactoEnv().cacheTtlSeconds).toBe(1800);
  });

  it('defaults to 1800 when env var is empty string', async () => {
    stubRequired();
    vi.stubEnv('SUMA_IMPACTO_API_CACHE_TTL_SECONDS', '');
    const { getSumaImpactoEnv } = await import('./env');
    expect(getSumaImpactoEnv().cacheTtlSeconds).toBe(1800);
  });

  it('uses the configured value when valid', async () => {
    stubRequired();
    vi.stubEnv('SUMA_IMPACTO_API_CACHE_TTL_SECONDS', '900');
    const { getSumaImpactoEnv } = await import('./env');
    expect(getSumaImpactoEnv().cacheTtlSeconds).toBe(900);
  });

  it('accepts the minimum value (60)', async () => {
    stubRequired();
    vi.stubEnv('SUMA_IMPACTO_API_CACHE_TTL_SECONDS', '60');
    const { getSumaImpactoEnv } = await import('./env');
    expect(getSumaImpactoEnv().cacheTtlSeconds).toBe(60);
  });

  it('accepts the maximum value (3600)', async () => {
    stubRequired();
    vi.stubEnv('SUMA_IMPACTO_API_CACHE_TTL_SECONDS', '3600');
    const { getSumaImpactoEnv } = await import('./env');
    expect(getSumaImpactoEnv().cacheTtlSeconds).toBe(3600);
  });

  it('throws when value is below minimum (59)', async () => {
    stubRequired();
    vi.stubEnv('SUMA_IMPACTO_API_CACHE_TTL_SECONDS', '59');
    const { getSumaImpactoEnv } = await import('./env');
    expect(() => getSumaImpactoEnv()).toThrow();
  });

  it('throws when value exceeds maximum (3601)', async () => {
    stubRequired();
    vi.stubEnv('SUMA_IMPACTO_API_CACHE_TTL_SECONDS', '3601');
    const { getSumaImpactoEnv } = await import('./env');
    expect(() => getSumaImpactoEnv()).toThrow();
  });

  it('throws when value is not numeric', async () => {
    stubRequired();
    vi.stubEnv('SUMA_IMPACTO_API_CACHE_TTL_SECONDS', 'slow');
    const { getSumaImpactoEnv } = await import('./env');
    expect(() => getSumaImpactoEnv()).toThrow();
  });
});
