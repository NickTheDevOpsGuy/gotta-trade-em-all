-- Cards catalog (public, read-only for users)
CREATE TABLE IF NOT EXISTS cards (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  rarity TEXT NOT NULL,
  value INTEGER NOT NULL
);

-- User inventory (scoped by user_id from Supabase Auth)
CREATE TABLE IF NOT EXISTS inventory (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  card_id TEXT NOT NULL REFERENCES cards(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  UNIQUE(user_id, card_id)
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_inventory_user_card ON inventory(user_id, card_id);

-- Seed cards (idempotent)
INSERT INTO cards (id, name, rarity, value) VALUES
  ('001', 'Leafling', 'common', 1),
  ('002', 'Flametail', 'common', 1),
  ('003', 'Aquabat', 'common', 1),
  ('004', 'Stonehog', 'rare', 3),
  ('005', 'Voltwing', 'rare', 3),
  ('006', 'Drakono', 'epic', 6)
ON CONFLICT (id) DO NOTHING;
