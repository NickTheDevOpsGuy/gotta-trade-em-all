import type { Card } from '../types/card';

export type SortOption = 'name' | 'value' | 'rarity';
export type RarityFilter = 'all' | 'common' | 'rare' | 'epic';

export function filterByRarity(cards: Card[], rarity: RarityFilter): Card[] {
  if (rarity === 'all') return [...cards];
  return cards.filter((c) => c.rarity === rarity);
}

export function sortCards(cards: Card[], sort: SortOption): Card[] {
  const list = [...cards];
  const order: Record<string, number> = { common: 1, rare: 2, epic: 3 };
  if (sort === 'name') list.sort((a, b) => a.name.localeCompare(b.name));
  else if (sort === 'value') list.sort((a, b) => b.value - a.value);
  else if (sort === 'rarity') list.sort((a, b) => (order[a.rarity] ?? 0) - (order[b.rarity] ?? 0));
  return list;
}

export function searchCards(cards: Card[], query: string): Card[] {
  if (!query.trim()) return [...cards];
  const q = query.toLowerCase().trim();
  return cards.filter((c) => c.name.toLowerCase().includes(q));
}
