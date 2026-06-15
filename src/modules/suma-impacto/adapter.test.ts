import { describe, expect, it } from 'vitest';

import {
  adaptSumaExperiencesToCards,
  mapSumaCostToLabel,
  mapSumaModalityToLabel,
  prepareSumaExperienceCardsForDisplay,
  resolveExperienceImageUrl,
  sortExperienceCardsByStartDate,
  stripHtmlForCardDescription,
} from './adapter';
import type { SumaImpactoLiteItem } from './schema';

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

describe('mapSumaModalityToLabel', () => {
  it('in_person → Presencial', () => {
    expect(mapSumaModalityToLabel('in_person')).toBe('Presencial');
  });

  it('presencial → Presencial', () => {
    expect(mapSumaModalityToLabel('presencial')).toBe('Presencial');
  });

  it('online → En línea', () => {
    expect(mapSumaModalityToLabel('online')).toBe('En línea');
  });

  it('en_linea → En línea', () => {
    expect(mapSumaModalityToLabel('en_linea')).toBe('En línea');
  });

  it('hybrid → Híbrido', () => {
    expect(mapSumaModalityToLabel('hybrid')).toBe('Híbrido');
  });

  it('hibrido → Híbrido', () => {
    expect(mapSumaModalityToLabel('hibrido')).toBe('Híbrido');
  });

  it('híbrido (con tilde) → Híbrido', () => {
    expect(mapSumaModalityToLabel('híbrido')).toBe('Híbrido');
  });

  it('ONLINE (uppercase) → En línea', () => {
    expect(mapSumaModalityToLabel('ONLINE')).toBe('En línea');
  });

  it('IN_PERSON (uppercase) → Presencial', () => {
    expect(mapSumaModalityToLabel('IN_PERSON')).toBe('Presencial');
  });

  it('Online (mixed case) → En línea', () => {
    expect(mapSumaModalityToLabel('Online')).toBe('En línea');
  });

  it('valor desconocido legible → raw trimmed (no expone nada técnico peor)', () => {
    expect(mapSumaModalityToLabel('Semipresencial')).toBe('Semipresencial');
  });

  it('null → null', () => {
    expect(mapSumaModalityToLabel(null)).toBeNull();
  });

  it('undefined → null', () => {
    expect(mapSumaModalityToLabel(undefined)).toBeNull();
  });

  it('string vacío → null', () => {
    expect(mapSumaModalityToLabel('')).toBeNull();
    expect(mapSumaModalityToLabel('   ')).toBeNull();
  });

  it('número → null', () => {
    expect(mapSumaModalityToLabel(42)).toBeNull();
  });
});

describe('adaptSumaExperiencesToCards', () => {
  const base: SumaImpactoLiteItem = {
    id: 'exp-1',
    name: 'Taller X',
    description: '<p>Desc <em>rich</em></p>',
    redirectUrl: 'https://suma.example/o/experiences?e=abc',
    publicUrl: 'https://suma.example/public/x',
    types: ['Taller', 'Otro'],
    tags: [],
    imageUrl: 'https://img.example/i.jpg',
    location: 'CDMX',
    organization: 'Suma Impacto',
    cost: 'FREE',
  };

  it('mapea name a title', () => {
    const [card] = adaptSumaExperiencesToCards([base]);
    expect(card.title).toBe('Taller X');
  });

  it('usa publicUrl || redirectUrl como href', () => {
    const [card] = adaptSumaExperiencesToCards([base]);
    expect(card.href).toBe(base.publicUrl);
    const noPublic = adaptSumaExperiencesToCards([
      { ...base, publicUrl: undefined } as unknown as SumaImpactoLiteItem,
    ]);
    expect(noPublic[0].href).toBe(base.redirectUrl);
  });

  it('limpia HTML de description', () => {
    const [card] = adaptSumaExperiencesToCards([base]);
    expect(card.description).toBe('Desc rich');
  });

  it('descripción de exactamente 10 palabras no agrega ...', () => {
    const desc = 'una dos tres cuatro cinco seis siete ocho nueve diez';
    const [card] = adaptSumaExperiencesToCards([{ ...base, description: desc }]);
    expect(card.description).toBe(desc);
    expect(card.description).not.toContain('...');
  });

  it('descripción de más de 10 palabras trunca a 10 con ...', () => {
    const desc = 'una dos tres cuatro cinco seis siete ocho nueve diez once';
    const [card] = adaptSumaExperiencesToCards([{ ...base, description: desc }]);
    expect(card.description).toBe('una dos tres cuatro cinco seis siete ocho nueve diez...');
  });

  it('descripción con HTML y más de 10 palabras: limpia y trunca', () => {
    const desc = '<p>una dos tres cuatro cinco seis siete ocho nueve diez <strong>once</strong></p>';
    const [card] = adaptSumaExperiencesToCards([{ ...base, description: desc }]);
    expect(card.description).toBe('una dos tres cuatro cinco seis siete ocho nueve diez...');
  });

  it('descripción vacía retorna string vacío', () => {
    const [card] = adaptSumaExperiencesToCards([{ ...base, description: '' }]);
    expect(card.description).toBe('');
  });

  it('descripción undefined retorna string vacío', () => {
    const [card] = adaptSumaExperiencesToCards([{ ...base, description: undefined }]);
    expect(card.description).toBe('');
  });

  it('espacios múltiples se normalizan antes de contar palabras', () => {
    const desc = 'una  dos   tres cuatro cinco seis siete ocho nueve diez once';
    const [card] = adaptSumaExperiencesToCards([{ ...base, description: desc }]);
    expect(card.description).toBe('una dos tres cuatro cinco seis siete ocho nueve diez...');
  });

  it('no corta palabras a la mitad (respeta límite en espacio)', () => {
    const desc = 'uno dos tres cuatro cinco seis siete ocho nueve complejísima once';
    const [card] = adaptSumaExperiencesToCards([{ ...base, description: desc }]);
    expect(card.description).toBe('uno dos tres cuatro cinco seis siete ocho nueve complejísima...');
  });

  it('filtra items sin name', () => {
    expect(adaptSumaExperiencesToCards([{ ...base, name: undefined }])).toHaveLength(0);
    expect(adaptSumaExperiencesToCards([{ ...base, name: '   ' }])).toHaveLength(0);
  });

  it('filtra items sin redirectUrl ni publicUrl', () => {
    expect(
      adaptSumaExperiencesToCards([
        { ...base, redirectUrl: undefined, publicUrl: undefined } as unknown as SumaImpactoLiteItem,
      ])
    ).toHaveLength(0);
    expect(
      adaptSumaExperiencesToCards([
        { ...base, redirectUrl: null, publicUrl: undefined } as unknown as SumaImpactoLiteItem,
      ])
    ).toHaveLength(0);
  });

  it('no filtra items con redirectUrl: null cuando publicUrl es válido', () => {
    expect(
      adaptSumaExperiencesToCards([{ ...base, redirectUrl: null }])
    ).toHaveLength(1);
  });

  it('usa publicUrl como ctaHref cuando redirectUrl es null', () => {
    const [card] = adaptSumaExperiencesToCards([{ ...base, redirectUrl: null }]);
    expect(card.ctaHref).toBe(base.publicUrl);
  });

  it('usa redirectUrl como ctaHref cuando está presente aunque haya publicUrl', () => {
    const [card] = adaptSumaExperiencesToCards([base]);
    expect(card.ctaHref).toBe(base.redirectUrl);
  });

  it('maneja imageUrl null o vacío', () => {
    const [a] = adaptSumaExperiencesToCards([{ ...base, imageUrl: null }]);
    expect(a.imageUrl).toBeNull();
    const [b] = adaptSumaExperiencesToCards([{ ...base, imageUrl: '  ' }]);
    expect(b.imageUrl).toBeNull();
  });

  it('location física tiene prioridad sobre modality', () => {
    const [card] = adaptSumaExperiencesToCards([{ ...base, location: 'GDL', modality: 'in_person' }]);
    expect(card.location).toBe('GDL');
  });

  it('modality raw in_person → Presencial cuando location vacío', () => {
    const [card] = adaptSumaExperiencesToCards([{ ...base, location: null, modality: 'in_person' }]);
    expect(card.location).toBe('Presencial');
  });

  it('modality raw online → En línea cuando location vacío', () => {
    const [card] = adaptSumaExperiencesToCards([{ ...base, location: null, modality: 'online' }]);
    expect(card.location).toBe('En línea');
  });

  it('modality raw hybrid → Híbrido cuando location vacío', () => {
    const [card] = adaptSumaExperiencesToCards([{ ...base, location: null, modality: 'hybrid' }]);
    expect(card.location).toBe('Híbrido');
  });

  it('modality ONLINE (uppercase) → En línea', () => {
    const [card] = adaptSumaExperiencesToCards([{ ...base, location: null, modality: 'ONLINE' }]);
    expect(card.location).toBe('En línea');
  });

  it('modality híbrido (con tilde) → Híbrido', () => {
    const [card] = adaptSumaExperiencesToCards([{ ...base, location: null, modality: 'híbrido' }]);
    expect(card.location).toBe('Híbrido');
  });

  it('location y modality vacíos → fallback Por confirmar', () => {
    const [card] = adaptSumaExperiencesToCards([{ ...base, location: null, modality: null }]);
    expect(card.location).toBe('Por confirmar');
  });

  it('usa id o redirectUrl como id estable', () => {
    const [withId] = adaptSumaExperiencesToCards([base]);
    expect(withId.id).toBe('exp-1');
    const [noId] = adaptSumaExperiencesToCards([{ ...base, id: undefined }]);
    expect(noId.id).toBe(base.redirectUrl);
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
    const [card] = adaptSumaExperiencesToCards([
      { ...base, cost: 'SCHOLARSHIP' } as unknown as SumaImpactoLiteItem,
    ]);
    expect(card.costLabel).toBeUndefined();
  });

  // Casos reales del response de Suma (redirectUrl: null, publicUrl válido)
  it('acepta item con redirectUrl: null, publicUrl válido y cost PAID (caso real Suma)', () => {
    const item: SumaImpactoLiteItem = {
      ...base,
      name: 'taller con costo',
      redirectUrl: null,
      publicUrl: 'https://suma.example/demoinn/experiences?e=abc',
      cost: 'PAID',
      tags: [],
    };
    const [card] = adaptSumaExperiencesToCards([item]);
    expect(card.title).toBe('taller con costo');
    expect(card.ctaHref).toBe('https://suma.example/demoinn/experiences?e=abc');
    expect(card.costLabel).toBe('De pago');
  });

  it('acepta item con redirectUrl: null, publicUrl válido y cost FREE (caso real Suma)', () => {
    const item: SumaImpactoLiteItem = {
      ...base,
      name: 'taller gratis',
      redirectUrl: null,
      publicUrl: 'https://suma.example/demoinn/experiences?e=xyz',
      cost: 'FREE',
      tags: [],
    };
    const [card] = adaptSumaExperiencesToCards([item]);
    expect(card.title).toBe('taller gratis');
    expect(card.ctaHref).toBe('https://suma.example/demoinn/experiences?e=xyz');
    expect(card.costLabel).toBe('Gratuito');
  });
});

describe('resolveExperienceImageUrl', () => {
  it('retorna null para vacío o null', () => {
    expect(resolveExperienceImageUrl(null)).toBeNull();
    expect(resolveExperienceImageUrl('')).toBeNull();
    expect(resolveExperienceImageUrl('   ')).toBeNull();
  });

  it('conserva URL absoluta https', () => {
    expect(resolveExperienceImageUrl('https://res.cloudinary.com/demo/photo.jpg')).toBe(
      'https://res.cloudinary.com/demo/photo.jpg'
    );
  });

  it('resuelve ruta relativa de Suma contra baseUrl', () => {
    expect(
      resolveExperienceImageUrl('/uploads/taller.jpg', 'https://suma.example')
    ).toBe('https://suma.example/uploads/taller.jpg');
  });

  it('resuelve path sin slash inicial contra baseUrl', () => {
    expect(
      resolveExperienceImageUrl('uploads/taller.jpg', 'https://suma.example')
    ).toBe('https://suma.example/uploads/taller.jpg');
  });

  it('no reescribe assets locales /images/', () => {
    expect(resolveExperienceImageUrl('/images/local.jpg', 'https://suma.example')).toBe(
      '/images/local.jpg'
    );
  });
});

describe('sortExperienceCardsByStartDate', () => {
  const mk = (id: string, startDate?: string | null) => ({
    id,
    title: id,
    description: '',
    imageUrl: null,
    startDate,
    href: 'https://suma.example/x',
    ctaHref: 'https://suma.example/x',
  });

  it('ordena por startDate ascendente (próximas primero)', () => {
    const sorted = sortExperienceCardsByStartDate([
      mk('c', '2026-09-01'),
      mk('a', '2026-07-01'),
      mk('b', '2026-08-01'),
    ]);
    expect(sorted.map((c) => c.id)).toEqual(['a', 'b', 'c']);
  });

  it('manda items sin fecha al final', () => {
    const sorted = sortExperienceCardsByStartDate([
      mk('sin-fecha'),
      mk('primero', '2026-07-01'),
      mk('sin-fecha-2', null),
    ]);
    expect(sorted.map((c) => c.id)).toEqual(['primero', 'sin-fecha', 'sin-fecha-2']);
  });
});

describe('prepareSumaExperienceCardsForDisplay', () => {
  it('resuelve imagen y ordena en un solo paso', () => {
    const items: SumaImpactoLiteItem[] = [
      {
        id: '2',
        name: 'Después',
        publicUrl: 'https://suma.example/demoinn/experiences?e=2',
        startDate: '2026-09-01',
        imageUrl: '/uploads/late.jpg',
        tags: [],
      },
      {
        id: '1',
        name: 'Antes',
        publicUrl: 'https://suma.example/demoinn/experiences?e=1',
        startDate: '2026-07-01',
        imageUrl: 'https://res.cloudinary.com/demo/early.jpg',
        tags: [],
      },
    ];

    const cards = prepareSumaExperienceCardsForDisplay(items, {
      sumaBaseUrl: 'https://suma.example',
    });

    expect(cards.map((c) => c.id)).toEqual(['1', '2']);
    expect(cards[0].imageUrl).toBe('https://res.cloudinary.com/demo/early.jpg');
    expect(cards[1].imageUrl).toBe('https://suma.example/uploads/late.jpg');
  });
});
