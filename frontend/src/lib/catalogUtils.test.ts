import { describe, it, expect } from 'vitest';
import type { Card } from '../types/card';
import { filterByRarity, sortCards, searchCards } from './catalogUtils';

describe('catalogUtils', () => {
  const mockCards: Card[] = [
    { id: '001', name: 'Leafling', rarity: 'common', value: 1 },
    { id: '004', name: 'Stonehog', rarity: 'rare', value: 3 },
    { id: '006', name: 'Drakono', rarity: 'epic', value: 6 },
    { id: '002', name: 'Flametail', rarity: 'common', value: 1 },
  ];

  describe('filterByRarity', () => {
    it('returns all cards when filter is "all"', () => {
      expect(filterByRarity(mockCards, 'all')).toHaveLength(4);
    });
    it('filters by common', () => {
      const result = filterByRarity(mockCards, 'common');
      expect(result).toHaveLength(2);
      expect(result.every((c) => c.rarity === 'common')).toBe(true);
    });
    it('filters by epic', () => {
      const result = filterByRarity(mockCards, 'epic');
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Drakono');
    });
  });

  describe('sortCards', () => {
    it('sorts by name', () => {
      const result = sortCards(mockCards, 'name');
      expect(result.map((c) => c.name)).toEqual(['Drakono', 'Flametail', 'Leafling', 'Stonehog']);
    });
    it('sorts by value descending', () => {
      const result = sortCards(mockCards, 'value');
      expect(result[0].value).toBe(6);
      expect(result[3].value).toBe(1);
    });
    it('sorts by rarity', () => {
      const result = sortCards(mockCards, 'rarity');
      expect(result[0].rarity).toBe('common');
      expect(result[result.length - 1].rarity).toBe('epic');
    });
  });

  describe('searchCards', () => {
    it('returns all when query is empty', () => {
      expect(searchCards(mockCards, '')).toHaveLength(4);
      expect(searchCards(mockCards, '   ')).toHaveLength(4);
    });
    it('filters by name substring', () => {
      const result = searchCards(mockCards, 'leaf');
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Leafling');
    });
    it('is case insensitive', () => {
      const result = searchCards(mockCards, 'DRAKONO');
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Drakono');
    });
  });
});
