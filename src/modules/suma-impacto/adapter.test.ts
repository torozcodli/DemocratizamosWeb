import { describe, expect, it } from 'vitest';

import { adaptSumaExperiencesToCards, stripHtmlForCardDescription } from './adapter';
import type { SumaImpactoLiteExperience } from './types';

describe('stripHtmlForCardDescription', () => {
  it('elimina etiquetas HTML', () => {
    expect(stripHtmlForCardDescription('<p>Hola <strong>mundo</strong></p>')).toBe('Hola mundo');
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
});
