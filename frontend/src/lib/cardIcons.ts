// Emoji/icons for each card (fallback by rarity if id not found)
export const CARD_ICONS: Record<string, string> = {
  '001': '🌿',
  '002': '🔥',
  '003': '🌊',
  '004': '🪨',
  '005': '⚡',
  '006': '🐉',
  '007': '🌑',
  '008': '💎',
  '009': '🐕',
  '010': '🍃',
  '011': '🦬',
  '012': '❄️',
  '013': '☠️',
  '014': '🛡️',
  '015': '⛈️',
  '016': '👁️',
};

export const RARITY_ICONS: Record<string, string> = {
  common: '🌟',
  rare: '✨',
  epic: '💫',
};

export function getCardIcon(cardId: string, rarity?: string): string {
  return CARD_ICONS[cardId] ?? RARITY_ICONS[rarity ?? 'common'] ?? '🃏';
}
