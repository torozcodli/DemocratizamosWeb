import { describe, it, expect, vi } from 'vitest';

vi.mock('server-only', () => ({}));

import { sumaImpactoLiteItemSchema, sumaImpactoLiteResponseSchema } from './schema';

const VALID_ITEM = {
  id: 'abc123',
  name: 'Taller de Innovación',
  types: ['Taller', 'Presencial'],
  description: '<p>Aprende a innovar</p>',
  startDate: '2026-07-01T10:00:00Z',
  endDate: '2026-07-01T18:00:00Z',
  closingDate: '2026-06-28T23:59:59Z',
  organization: 'Democratizamos',
  organizationSlug: 'democratizamos',
  location: 'CDMX',
  modality: 'Presencial',
  imageUrl: 'https://img.example/photo.jpg',
  redirectUrl: 'https://suma.example/reserve',
  tags: ['innovacion', 'tecnologia'],
  publicUrl: 'https://suma.example/public/taller',
  shortLinkUrl: 'https://s.example/abc',
  cost: 'FREE',
};

const VALID_RESPONSE = {
  success: true as const,
  total: 1,
  data: [VALID_ITEM],
};

// ─── sumaImpactoLiteItemSchema ─────────────────────────────────────────────

describe('sumaImpactoLiteItemSchema — valid cases', () => {
  it('accepts a fully populated item', () => {
    expect(sumaImpactoLiteItemSchema.safeParse(VALID_ITEM).success).toBe(true);
  });

  it('accepts an item with all optional fields absent', () => {
    expect(sumaImpactoLiteItemSchema.safeParse({}).success).toBe(true);
  });

  it('accepts an item with only name and redirectUrl', () => {
    const result = sumaImpactoLiteItemSchema.safeParse({
      name: 'Mínimo',
      redirectUrl: 'https://suma.example/r',
    });
    expect(result.success).toBe(true);
  });

  it('accepts imageUrl: null', () => {
    const result = sumaImpactoLiteItemSchema.safeParse({ ...VALID_ITEM, imageUrl: null });
    expect(result.success).toBe(true);
  });

  it('accepts location: null', () => {
    const result = sumaImpactoLiteItemSchema.safeParse({ ...VALID_ITEM, location: null });
    expect(result.success).toBe(true);
  });

  it('accepts modality: null', () => {
    const result = sumaImpactoLiteItemSchema.safeParse({ ...VALID_ITEM, modality: null });
    expect(result.success).toBe(true);
  });

  it('accepts shortLinkUrl: null', () => {
    const result = sumaImpactoLiteItemSchema.safeParse({ ...VALID_ITEM, shortLinkUrl: null });
    expect(result.success).toBe(true);
  });

  it('accepts startDate: null', () => {
    const result = sumaImpactoLiteItemSchema.safeParse({ ...VALID_ITEM, startDate: null });
    expect(result.success).toBe(true);
  });

  it('accepts cost: "FREE"', () => {
    const result = sumaImpactoLiteItemSchema.safeParse({ ...VALID_ITEM, cost: 'FREE' });
    expect(result.success).toBe(true);
  });

  it('accepts cost: "PAID"', () => {
    const result = sumaImpactoLiteItemSchema.safeParse({ ...VALID_ITEM, cost: 'PAID' });
    expect(result.success).toBe(true);
  });

  it('accepts cost: "SUBSIDY"', () => {
    const result = sumaImpactoLiteItemSchema.safeParse({ ...VALID_ITEM, cost: 'SUBSIDY' });
    expect(result.success).toBe(true);
  });

  it('accepts cost: null', () => {
    const result = sumaImpactoLiteItemSchema.safeParse({ ...VALID_ITEM, cost: null });
    expect(result.success).toBe(true);
  });

  it('accepts cost: absent', () => {
    const { cost: _cost, ...withoutCost } = VALID_ITEM;
    const result = sumaImpactoLiteItemSchema.safeParse(withoutCost);
    expect(result.success).toBe(true);
  });

  it('accepts cost: any other string (not enum — string schema)', () => {
    const result = sumaImpactoLiteItemSchema.safeParse({ ...VALID_ITEM, cost: '$500 MXN' });
    expect(result.success).toBe(true);
  });

  it('passes through extra fields without failing (passthrough)', () => {
    const result = sumaImpactoLiteItemSchema.safeParse({
      ...VALID_ITEM,
      newFieldFromSuma: 'some-value',
      anotherNewField: 42,
    });
    expect(result.success).toBe(true);
  });
});

describe('sumaImpactoLiteItemSchema — invalid cases', () => {
  it('fails when types is a string instead of array', () => {
    const result = sumaImpactoLiteItemSchema.safeParse({ ...VALID_ITEM, types: 'Taller' });
    expect(result.success).toBe(false);
  });

  it('fails when types contains non-string elements', () => {
    const result = sumaImpactoLiteItemSchema.safeParse({ ...VALID_ITEM, types: [1, 2, 3] });
    expect(result.success).toBe(false);
  });

  it('fails when name is a number instead of string', () => {
    const result = sumaImpactoLiteItemSchema.safeParse({ ...VALID_ITEM, name: 123 });
    expect(result.success).toBe(false);
  });

  it('fails when cost is a number instead of string', () => {
    const result = sumaImpactoLiteItemSchema.safeParse({ ...VALID_ITEM, cost: 500 });
    expect(result.success).toBe(false);
  });
});

// ─── sumaImpactoLiteResponseSchema ────────────────────────────────────────

describe('sumaImpactoLiteResponseSchema — valid cases', () => {
  it('accepts a valid full response', () => {
    expect(sumaImpactoLiteResponseSchema.safeParse(VALID_RESPONSE).success).toBe(true);
  });

  it('accepts a response with empty data array', () => {
    const result = sumaImpactoLiteResponseSchema.safeParse({
      success: true,
      total: 0,
      data: [],
    });
    expect(result.success).toBe(true);
  });

  it('accepts total: 0', () => {
    expect(
      sumaImpactoLiteResponseSchema.safeParse({ success: true, total: 0, data: [] }).success
    ).toBe(true);
  });

  it('returns validated data with correct shape', () => {
    const result = sumaImpactoLiteResponseSchema.safeParse(VALID_RESPONSE);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.total).toBe(1);
      expect(result.data.data).toHaveLength(1);
      expect(result.data.data[0].name).toBe('Taller de Innovación');
    }
  });
});

describe('sumaImpactoLiteResponseSchema — invalid cases', () => {
  it('fails when success is false', () => {
    const result = sumaImpactoLiteResponseSchema.safeParse({
      success: false,
      total: 0,
      data: [],
    });
    expect(result.success).toBe(false);
  });

  it('fails when success is missing', () => {
    const result = sumaImpactoLiteResponseSchema.safeParse({ total: 0, data: [] });
    expect(result.success).toBe(false);
  });

  it('fails when data is not an array', () => {
    const result = sumaImpactoLiteResponseSchema.safeParse({
      success: true,
      total: 1,
      data: { items: [] },
    });
    expect(result.success).toBe(false);
  });

  it('fails when data is missing', () => {
    const result = sumaImpactoLiteResponseSchema.safeParse({ success: true, total: 0 });
    expect(result.success).toBe(false);
  });

  it('fails when total is negative', () => {
    const result = sumaImpactoLiteResponseSchema.safeParse({
      success: true,
      total: -1,
      data: [],
    });
    expect(result.success).toBe(false);
  });

  it('fails when total is a decimal', () => {
    const result = sumaImpactoLiteResponseSchema.safeParse({
      success: true,
      total: 1.5,
      data: [],
    });
    expect(result.success).toBe(false);
  });

  it('fails when total is a string', () => {
    const result = sumaImpactoLiteResponseSchema.safeParse({
      success: true,
      total: '5',
      data: [],
    });
    expect(result.success).toBe(false);
  });

  it('fails (Política A) when an item has types as a string instead of array', () => {
    const result = sumaImpactoLiteResponseSchema.safeParse({
      success: true,
      total: 1,
      data: [{ ...VALID_ITEM, types: 'Taller' }],
    });
    expect(result.success).toBe(false);
  });

  it('fails when the entire body is not an object', () => {
    expect(sumaImpactoLiteResponseSchema.safeParse(null).success).toBe(false);
    expect(sumaImpactoLiteResponseSchema.safeParse('string').success).toBe(false);
    expect(sumaImpactoLiteResponseSchema.safeParse([]).success).toBe(false);
  });
});
