import { describe, expect, it } from 'vitest';

import { formatExperienceDateTime } from './formatters';

// Offset fijo para America/Mexico_City (UTC-6, sin DST desde 2023).
// 2026-08-01T16:00:00.000Z → 10:00 MX
// 2026-08-02T00:00:00.000Z → 18:00 MX (mismo día: 1 ago 2026)
// 2026-08-03T00:00:00.000Z → 18:00 MX del 2 ago 2026 (día distinto)

describe('formatExperienceDateTime', () => {
  describe('sin fechas', () => {
    it('retorna null cuando startDate es null', () => {
      expect(formatExperienceDateTime(null, null, 'es-MX')).toBeNull();
    });

    it('retorna null cuando startDate es undefined', () => {
      expect(formatExperienceDateTime(undefined, undefined, 'es-MX')).toBeNull();
    });

    it('retorna null cuando startDate es string vacío', () => {
      expect(formatExperienceDateTime('', null, 'es-MX')).toBeNull();
    });
  });

  describe('fecha inválida', () => {
    it('retorna null cuando startDate no es fecha válida', () => {
      expect(formatExperienceDateTime('not-a-date', null, 'es-MX')).toBeNull();
    });

    it('retorna null cuando startDate es string arbitrario', () => {
      expect(formatExperienceDateTime('invalid', null, 'es-MX')).toBeNull();
    });
  });

  describe('fecha sin componente de hora (ISO date-only)', () => {
    it('retorna solo la fecha cuando no hay hora en el ISO', () => {
      const result = formatExperienceDateTime('2026-08-01', null, 'es-MX');
      expect(result).not.toBeNull();
      expect(result).toContain('2026');
      expect(result).toContain('agosto');
      expect(result).not.toContain('·');
      expect(result).not.toContain(':');
    });

    it('retorna rango de fechas cuando start y end son distintos días (sin hora)', () => {
      const result = formatExperienceDateTime('2026-08-01', '2026-08-03', 'es-MX');
      expect(result).not.toBeNull();
      expect(result).toContain('–');
      expect(result).toContain('agosto');
    });

    it('retorna solo la fecha cuando start y end son el mismo día (sin hora)', () => {
      const result = formatExperienceDateTime('2026-08-01', '2026-08-01', 'es-MX');
      expect(result).not.toBeNull();
      expect(result).not.toContain('–');
      expect(result).toContain('agosto');
    });

    it('ignora endDate inválido y retorna solo startDate', () => {
      const result = formatExperienceDateTime('2026-08-01', 'bad', 'es-MX');
      expect(result).not.toBeNull();
      expect(result).toContain('agosto');
      expect(result).not.toContain('–');
    });
  });

  describe('startDate con hora, sin endDate', () => {
    it('incluye fecha y hora de inicio separados por ·', () => {
      // 2026-08-01T16:00:00.000Z = 10:00 AM Mexico City
      const result = formatExperienceDateTime('2026-08-01T16:00:00.000Z', null, 'es-MX');
      expect(result).not.toBeNull();
      expect(result).toContain('2026');
      expect(result).toContain('agosto');
      expect(result).toContain('·');
      expect(result).toContain('10:00');
    });

    it('muestra hora correcta en timezone Mexico City (no UTC crudo)', () => {
      // T16:00Z = 10:00 MX, no 16:00
      const result = formatExperienceDateTime('2026-08-01T16:00:00.000Z', null, 'es-MX');
      expect(result).toContain('10:00');
      expect(result).not.toContain('16:00');
    });

    it('ignora endDate nulo y muestra solo start', () => {
      const result = formatExperienceDateTime('2026-08-01T16:00:00.000Z', null, 'es-MX');
      expect(result).not.toContain('–');
    });
  });

  describe('start + end mismo día', () => {
    it('muestra fecha una vez y rango de horas separado por –', () => {
      // T16:00Z = 10:00 MX, T00:00Z del día siguiente = 18:00 MX del día anterior
      const result = formatExperienceDateTime(
        '2026-08-01T16:00:00.000Z',
        '2026-08-02T00:00:00.000Z',
        'es-MX'
      );
      expect(result).not.toBeNull();
      expect(result).toContain('·');
      expect(result).toContain('10:00');
      expect(result).toContain('–');
      expect(result).toContain('18:00');
      expect(result).toContain('agosto');
      expect(result).toContain('2026');
    });

    it('no repite la fecha dos veces cuando start y end son mismo día', () => {
      const result = formatExperienceDateTime(
        '2026-08-01T16:00:00.000Z',
        '2026-08-02T00:00:00.000Z',
        'es-MX'
      ) as string;
      // La fecha "agosto" debe aparecer solo una vez
      const countAugust = (result.match(/agosto/g) ?? []).length;
      expect(countAugust).toBe(1);
    });
  });

  describe('start + end días distintos', () => {
    it('muestra ambas fechas separadas por –', () => {
      // start: 1 ago 10:00 MX, end: 2 ago 18:00 MX
      const result = formatExperienceDateTime(
        '2026-08-01T16:00:00.000Z',
        '2026-08-03T00:00:00.000Z',
        'es-MX'
      );
      expect(result).not.toBeNull();
      expect(result).toContain('–');
      expect(result).toContain('10:00');
      expect(result).toContain('18:00');
    });

    it('no usa · (punto medio) cuando los días son distintos', () => {
      const result = formatExperienceDateTime(
        '2026-08-01T16:00:00.000Z',
        '2026-08-03T00:00:00.000Z',
        'es-MX'
      );
      expect(result).not.toContain('·');
    });
  });

  describe('endDate inválido con startDate con hora', () => {
    it('ignora endDate inválido y muestra solo startDate con hora', () => {
      const result = formatExperienceDateTime('2026-08-01T16:00:00.000Z', 'bad', 'es-MX');
      expect(result).toContain('10:00');
      expect(result).toContain('·');
      expect(result).not.toContain('–');
    });
  });

  describe('locale en inglés', () => {
    it('respeta el locale para el nombre del mes', () => {
      const result = formatExperienceDateTime('2026-08-01T16:00:00.000Z', null, 'en-US');
      expect(result).not.toBeNull();
      expect(result).toContain('August');
      expect(result).not.toContain('agosto');
    });
  });
});
