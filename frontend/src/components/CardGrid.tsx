import { Card } from '../types/card';
import { CardView } from './CardView';

interface CardGridProps {
  cards: Card[];
  selected?: Set<string>;
  mode?: 'display' | 'add' | 'trade';
  onAdd?: (card: Card) => void;
  onToggleSelect?: (card: Card) => void;
}

export function CardGrid({
  cards,
  selected = new Set(),
  mode = 'display',
  onAdd,
  onToggleSelect,
}: CardGridProps) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
        gap: 16,
      }}
    >
      {cards.map((c) => (
        <CardView
          key={c.id}
          card={c}
          selected={selected.has(c.id)}
          mode={mode}
          onAdd={onAdd}
          onToggleSelect={onToggleSelect}
        />
      ))}
    </div>
  );
}
