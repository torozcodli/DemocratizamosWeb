import { describe, expect, it } from 'vitest';

import { adaptSumaExperiencesToCards, mapSumaCostToLabel, stripHtmlForCardDescription } from './adapter';
import type { SumaImpactoLiteExperience } from './types';

describe('stripHtmlForCardDescription', () => {
  it('elimina etiquetas HTML', () => {
    expect(stripHtmlForCardDescription('<p>Hola <strong>mundo</strong></p>')).toBe('Hola mundo');
  });
});

describe('mapSumaCostToLabel', () => {
  it('maps FREE to Gratuito', () => {
    expect(mapSumaCostToLabel('FREE')).toBe('Gratuito');
  });

  it('maps PAID to De pago', () => {
    expect(mapSumaCostToLabel('PAID')).toBe('De pago');
  });

  it('maps SUBSIDY to Subsidio', () => {
    expect(mapSumaCostToLabel('SUBSIDY')).toBe('Subsidio');
  });

  it('is case-insensitive (free → Gratuito)', () => {
    expect(mapSumaCostToLabel('free')).toBe('Gratuito');
    expect(mapSumaCostToLabel('paid')).toBe('De pago');
    expect(mapSumaCostToLabel('subsidy')).toBe('Subsidio');
  });

  it('returns undefined for null', () => {
    expect(mapSumaCostToLabel(null)).toBeUndefined();
  });

  it('returns undefined for undefined', () => {
    expect(mapSumaCostToLabel(undefined)).toBeUndefined();
  });

  it('returns undefined for empty string', () => {
    expect(mapSumaCostToLabel('')).toBeUndefined();
    expect(mapSumaCostToLabel('   ')).toBeUndefined();
  });

  it('returns undefined for unknown values (does not expose raw enum)', () => {
    expect(mapSumaCostToLabel('SCHOLARSHIP')).toBeUndefined();
    expect(mapSumaCostToLabel('$500 MXN')).toBeUndefined();
    expect(mapSumaCostToLabel('UNKNOWN')).toBeUndefined();
  });
});

describe('adaptSumaExperiencesToCards', () => {
  const base: SumaImpactoLiteExperience = {
    id: 'exp-1',
    name: 'Taller X',
    description: '<p>Desc <em>rich</em></p>',
    reserveUrl: 'https://suma.example/o/experiences?e=abc',
    publicUrl: 'https://suma.example/public/x',
    types: ['Taller', 'Otro'],
    imageUrl: 'https://img.example/i.jpg',
    location: 'CDMX',
    organization: 'Suma Impacto',
    cost: 'FREE',
  };

  it('mapea name a title', () => {
    const [card] = adaptSumaExperiencesToCards([base]);
    expect(card.title).toBe('Taller X');
  });

  it('usa reserveUrl como ctaHref', () => {
    const [card] = adaptSumaExperiencesToCards([base]);
    expect(card.ctaHref).toBe(base.reserveUrl);
  });

  it('usa publicUrl || reserveUrl como href', () => {
    const [card] = adaptSumaExperiencesToCards([base]);
    expect(card.href).toBe(base.publicUrl);
    const noPublic = adaptSumaExperiencesToCards([{ ...base, publicUrl: undefined }]);
    expect(noPublic[0].href).toBe(base.reserveUrl);
  });

  it('limpia HTML de description', () => {
    const [card] = adaptSumaExperiencesToCards([base]);
    expect(card.description).toBe('Desc rich');
  });

  it('filtra items sin name', () => {
    expect(adaptSumaExperiencesToCards([{ ...base, name: undefined }])).toHaveLength(0);
    expect(adaptSumaExperiencesToCards([{ ...base, name: '   ' }])).toHaveLength(0);
  });

  it('filtra items sin reserveUrl', () => {
    expect(adaptSumaExperiencesToCards([{ ...base, reserveUrl: undefined }])).toHaveLength(0);
  });

  it('maneja imageUrl null o vacío', () => {
    const [a] = adaptSumaExperiencesToCards([{ ...base, imageUrl: null }]);
    expect(a.imageUrl).toBeNull();
    const [b] = adaptSumaExperiencesToCards([{ ...base, imageUrl: '  ' }]);
    expect(b.imageUrl).toBeNull();
  });

  it('usa location || modality y fallback', () => {
    const [withLoc] = adaptSumaExperiencesToCards([{ ...base, location: 'GDL', modality: null }]);
    expect(withLoc.location).toBe('GDL');
    const [withMod] = adaptSumaExperiencesToCards([
      { ...base, location: null, modality: 'Online' },
    ]);
    expect(withMod.location).toBe('Online');
    const [fallback] = adaptSumaExperiencesToCards([
      { ...base, location: null, modality: null },
    ]);
    expect(fallback.location).toBe('Por confirmar');
  });

  it('usa id o reserveUrl como id estable', () => {
    const [withId] = adaptSumaExperiencesToCards([base]);
    expect(withId.id).toBe('exp-1');
    const [noId] = adaptSumaExperiencesToCards([{ ...base, id: undefined }]);
    expect(noId.id).toBe(base.reserveUrl);
  });

  // organizationName
  it('mapea organization a organizationName', () => {
    const [card] = adaptSumaExperiencesToCards([base]);
    expect(card.organizationName).toBe('Suma Impacto');
  });

  it('retorna organizationName undefined cuando organization es undefined', () => {
    const [card] = adaptSumaExperiencesToCards([{ ...base, organization: undefined }]);
    expect(card.organizationName).toBeUndefined();
  });

  it('retorna organizationName undefined cuando organization es string vacío', () => {
    const [card] = adaptSumaExperiencesToCards([{ ...base, organization: '   ' }]);
    expect(card.organizationName).toBeUndefined();
  });

  // costLabel
  it('mapea cost FREE a costLabel Gratuito', () => {
    const [card] = adaptSumaExperiencesToCards([{ ...base, cost: 'FREE' }]);
    expect(card.costLabel).toBe('Gratuito');
  });

  it('mapea cost PAID a costLabel De pago', () => {
    const [card] = adaptSumaExperiencesToCards([{ ...base, cost: 'PAID' }]);
    expect(card.costLabel).toBe('De pago');
  });

  it('mapea cost SUBSIDY a costLabel Subsidio', () => {
    const [card] = adaptSumaExperiencesToCards([{ ...base, cost: 'SUBSIDY' }]);
    expect(card.costLabel).toBe('Subsidio');
  });

  it('retorna costLabel undefined cuando cost es null', () => {
    const [card] = adaptSumaExperiencesToCards([{ ...base, cost: null }]);
    expect(card.costLabel).toBeUndefined();
  });

  it('retorna costLabel undefined cuando cost es undefined', () => {
    const [card] = adaptSumaExperiencesToCards([{ ...base, cost: undefined }]);
    expect(card.costLabel).toBeUndefined();
  });

  it('retorna costLabel undefined para cost desconocido (no expone raw enum)', () => {
    const [card] = adaptSumaExperiencesToCards([{ ...base, cost: 'SCHOLARSHIP' }]);
    expect(card.costLabel).toBeUndefined();
  });
});
