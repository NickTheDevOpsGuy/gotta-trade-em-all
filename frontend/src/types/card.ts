export type Rarity = 'common' | 'rare' | 'epic';

export interface Card {
  id: string;
  name: string;
  rarity: Rarity;
  value: number;
  quantity?: number;
}
