import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('server-only', () => ({}));

const TEST_API_KEY = 'test-key-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'; // 40 chars

vi.mock('./env', () => ({
  getSumaImpactoEnv: vi.fn(() => ({
    baseUrl: 'https://suma-api.example',
    experiencesApiKey: TEST_API_KEY,
    orgId: '507f1f77bcf86cd799439011',
    source: 'demoinn',
    timeoutMs: 8000,
    cacheTtlSeconds: 1800,
  })),
}));

import { getSumaImpactoExperiences } from './client';

function makeMockResponse(body: unknown, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    text: () => Promise.resolve(JSON.stringify(body)),
  } as unknown as Response;
}

describe('getSumaImpactoExperiences — headers', () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('sends x-api-key header with the configured API key', async () => {
    fetchMock.mockResolvedValueOnce(makeMockResponse({ success: true, total: 0, data: [] }));
    await getSumaImpactoExperiences();
    const [, options] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect((options.headers as Record<string, string>)['x-api-key']).toBe(TEST_API_KEY);
  });

  it('sends Accept: application/json header', async () => {
    fetchMock.mockResolvedValueOnce(makeMockResponse({ success: true, total: 0, data: [] }));
    await getSumaImpactoExperiences();
    const [, options] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect((options.headers as Record<string, string>)['Accept']).toBe('application/json');
  });
});

describe('getSumaImpactoExperiences — URL', () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('includes source=demoinn as query param', async () => {
    fetchMock.mockResolvedValueOnce(makeMockResponse({ success: true, total: 0, data: [] }));
    await getSumaImpactoExperiences();
    const [url] = fetchMock.mock.calls[0] as [string];
    expect(url).toContain('source=demoinn');
  });

  it('does not include api_key in the URL', async () => {
    fetchMock.mockResolvedValueOnce(makeMockResponse({ success: true, total: 0, data: [] }));
    await getSumaImpactoExperiences();
    const [url] = fetchMock.mock.calls[0] as [string];
    expect(url).not.toContain('api_key');
  });

  it('does not include the API key value in the URL', async () => {
    fetchMock.mockResolvedValueOnce(makeMockResponse({ success: true, total: 0, data: [] }));
    await getSumaImpactoExperiences();
    const [url] = fetchMock.mock.calls[0] as [string];
    expect(url).not.toContain(TEST_API_KEY);
  });
});

describe('getSumaImpactoExperiences — timeout and signal', () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('passes an AbortSignal to fetch', async () => {
    fetchMock.mockResolvedValueOnce(makeMockResponse({ success: true, total: 0, data: [] }));
    await getSumaImpactoExperiences();
    const [, options] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(options?.signal).toBeDefined();
    expect(options?.signal).toBeInstanceOf(AbortSignal);
  });

  it('returns safe fallback when request is aborted (AbortError)', async () => {
    const abortError = Object.assign(new Error('The operation was aborted'), {
      name: 'AbortError',
    });
    fetchMock.mockRejectedValueOnce(abortError);
    const result = await getSumaImpactoExperiences();
    expect(result.success).toBe(false);
    expect(result.data).toHaveLength(0);
    expect(result.total).toBe(0);
  });

  it('uses cacheTtlSeconds as next.revalidate', async () => {
    fetchMock.mockResolvedValueOnce(makeMockResponse({ success: true, total: 0, data: [] }));
    await getSumaImpactoExperiences();
    const [, options] = fetchMock.mock.calls[0] as [string, RequestInit & { next?: { revalidate?: number } }];
    expect(options?.next?.revalidate).toBe(1800);
  });
});

describe('getSumaImpactoExperiences — timer cleanup', () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('clears the timeout timer on successful response', async () => {
    fetchMock.mockResolvedValueOnce(makeMockResponse({ success: true, total: 0, data: [] }));
    await getSumaImpactoExperiences();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('clears the timeout timer on network error', async () => {
    fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));
    await getSumaImpactoExperiences();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('clears the timeout timer on AbortError', async () => {
    const abortError = Object.assign(new Error('aborted'), { name: 'AbortError' });
    fetchMock.mockRejectedValueOnce(abortError);
    await getSumaImpactoExperiences();
    expect(vi.getTimerCount()).toBe(0);
  });
});

describe('getSumaImpactoExperiences — response handling', () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns data on valid 200 response', async () => {
    const item = { id: 'exp-1', name: 'Taller Demo', reserveUrl: 'https://suma.example/r' };
    fetchMock.mockResolvedValueOnce(
      makeMockResponse({ success: true, total: 1, data: [item] })
    );
    const result = await getSumaImpactoExperiences();
    expect(result.success).toBe(true);
    expect(result.total).toBe(1);
    expect(result.data).toHaveLength(1);
  });

  it('returns safe fallback on 401 response', async () => {
    fetchMock.mockResolvedValueOnce(makeMockResponse({ error: 'Unauthorized' }, 401));
    const result = await getSumaImpactoExperiences();
    expect(result.success).toBe(false);
    expect(result.data).toHaveLength(0);
    expect(result.total).toBe(0);
  });

  it('returns safe fallback on 500 response', async () => {
    fetchMock.mockResolvedValueOnce(makeMockResponse({ error: 'Internal Server Error' }, 500));
    const result = await getSumaImpactoExperiences();
    expect(result.success).toBe(false);
    expect(result.data).toHaveLength(0);
  });

  it('returns safe fallback on network error', async () => {
    fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));
    const result = await getSumaImpactoExperiences();
    expect(result.success).toBe(false);
    expect(result.data).toHaveLength(0);
    expect(result.total).toBe(0);
  });
});

describe('getSumaImpactoExperiences — schema validation (Política A)', () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns data when response passes schema', async () => {
    const item = { id: 'exp-1', name: 'Taller', reserveUrl: 'https://suma.example/r' };
    fetchMock.mockResolvedValueOnce(
      makeMockResponse({ success: true, total: 1, data: [item] })
    );
    const result = await getSumaImpactoExperiences();
    expect(result.success).toBe(true);
    expect(result.data).toHaveLength(1);
  });

  it('returns fallback when success is false', async () => {
    fetchMock.mockResolvedValueOnce(
      makeMockResponse({ success: false, total: 0, data: [] })
    );
    const result = await getSumaImpactoExperiences();
    expect(result.success).toBe(false);
    expect(result.data).toHaveLength(0);
  });

  it('returns fallback when data is not an array (schema failure)', async () => {
    fetchMock.mockResolvedValueOnce(
      makeMockResponse({ success: true, total: 1, data: { items: [] } })
    );
    const result = await getSumaImpactoExperiences();
    expect(result.success).toBe(false);
    expect(result.data).toHaveLength(0);
  });

  it('returns fallback when an item has types as string (Política A strict)', async () => {
    const malformedItem = { name: 'Taller', types: 'not-an-array' };
    fetchMock.mockResolvedValueOnce(
      makeMockResponse({ success: true, total: 1, data: [malformedItem] })
    );
    const result = await getSumaImpactoExperiences();
    expect(result.success).toBe(false);
    expect(result.data).toHaveLength(0);
  });

  it('returns fallback when total is negative', async () => {
    fetchMock.mockResolvedValueOnce(
      makeMockResponse({ success: true, total: -1, data: [] })
    );
    const result = await getSumaImpactoExperiences();
    expect(result.success).toBe(false);
  });

  it('does not expose secrets in logs on schema failure', async () => {
    vi.stubEnv('NODE_ENV', 'development');
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    fetchMock.mockResolvedValueOnce(
      makeMockResponse({ success: false, total: 0, data: [] })
    );
    await getSumaImpactoExperiences();

    const logged = consoleSpy.mock.calls.flat().map(String).join(' ');
    expect(logged).not.toContain(TEST_API_KEY);

    consoleSpy.mockRestore();
    vi.unstubAllEnvs();
  });
});

describe('getSumaImpactoExperiences — logging levels', () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    vi.stubEnv('NODE_ENV', 'development');
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it('uses console.warn for timeout (controlled degradation)', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const abortError = Object.assign(new Error('aborted'), { name: 'AbortError' });
    fetchMock.mockRejectedValueOnce(abortError);
    await getSumaImpactoExperiences();

    expect(warnSpy).toHaveBeenCalled();
    expect(errorSpy).not.toHaveBeenCalled();
    warnSpy.mockRestore();
    errorSpy.mockRestore();
  });

  it('uses console.warn for network error (controlled degradation)', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));
    await getSumaImpactoExperiences();

    expect(warnSpy).toHaveBeenCalled();
    expect(errorSpy).not.toHaveBeenCalled();
    warnSpy.mockRestore();
    errorSpy.mockRestore();
  });

  it('uses console.warn for non-OK HTTP response (controlled degradation)', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    fetchMock.mockResolvedValueOnce(makeMockResponse({ error: 'Unauthorized' }, 401));
    await getSumaImpactoExperiences();

    expect(warnSpy).toHaveBeenCalled();
    expect(errorSpy).not.toHaveBeenCalled();
    warnSpy.mockRestore();
    errorSpy.mockRestore();
  });

  it('uses console.error for schema validation failure (contract anomaly)', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    fetchMock.mockResolvedValueOnce(
      makeMockResponse({ success: false, total: 0, data: [] })
    );
    await getSumaImpactoExperiences();

    expect(errorSpy).toHaveBeenCalled();
    expect(warnSpy).not.toHaveBeenCalled();
    warnSpy.mockRestore();
    errorSpy.mockRestore();
  });
});

describe('getSumaImpactoExperiences — logging safety', () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('does not log the API key in warn or error channels', async () => {
    vi.stubEnv('NODE_ENV', 'development');

    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

    await getSumaImpactoExperiences();

    const allLogs = [...warnSpy.mock.calls, ...errorSpy.mock.calls].flat().map(String).join(' ');
    expect(allLogs).not.toContain(TEST_API_KEY);

    warnSpy.mockRestore();
    errorSpy.mockRestore();
    vi.unstubAllEnvs();
  });
});
