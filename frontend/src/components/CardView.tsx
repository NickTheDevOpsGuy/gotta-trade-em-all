import { motion } from 'framer-motion';
import { Card } from '../types/card';
import { getCardIcon } from '../lib/cardIcons';

const RARITY_COLORS: Record<string, string> = {
  common: '#94a3b8',
  rare: '#60a5fa',
  epic: '#a78bfa',
};

interface CardViewProps {
  card: Card;
  selected?: boolean;
  mode?: 'display' | 'add' | 'trade';
  onAdd?: (card: Card) => void;
  onToggleSelect?: (card: Card) => void;
}

export function CardView({ card, selected, mode = 'display', onAdd, onToggleSelect }: CardViewProps) {
  const accent = RARITY_COLORS[card.rarity] || '#94a3b8';
  const isSelectable = mode === 'trade' && onToggleSelect;
  const isAddable = mode === 'add' && onAdd;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={isSelectable ? { scale: 1.02 } : undefined}
      transition={{ duration: 0.2 }}
      onClick={isSelectable ? () => onToggleSelect?.(card) : undefined}
      style={{
        border: `2px solid ${selected ? accent : '#334155'}`,
        borderRadius: 12,
        padding: 16,
        background: 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)',
        color: '#f8fafc',
        boxShadow: selected ? `0 0 16px ${accent}40` : '0 4px 6px rgba(0,0,0,0.3)',
        cursor: isSelectable ? 'pointer' : 'default',
        transition: 'all 0.2s ease',
        position: 'relative',
      }}
    >
      <div style={{ fontSize: 28, marginBottom: 8, lineHeight: 1 }}>
        {getCardIcon(card.id, card.rarity)}
      </div>
      <div style={{ fontSize: 10, color: accent, textTransform: 'uppercase', marginBottom: 4 }}>
        {card.rarity}
      </div>
      <strong style={{ fontSize: 16, display: 'block' }}>{card.name}</strong>
      <div style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>
        Value: {card.value}
      </div>
      {card.quantity != null && card.quantity > 1 && (
        <div style={{ position: 'absolute', top: 8, right: 8, background: accent, color: '#0f172a', borderRadius: 8, padding: '2px 8px', fontSize: 12, fontWeight: 'bold' }}>
          ×{card.quantity}
        </div>
      )}
      {isAddable && (
        <button
          onClick={(e) => { e.stopPropagation(); onAdd(card); }}
          style={{
            marginTop: 12,
            padding: '8px 16px',
            background: accent,
            border: 'none',
            borderRadius: 8,
            color: '#0f172a',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          + Add to Collection
        </button>
      )}
    </motion.div>
  );
}
