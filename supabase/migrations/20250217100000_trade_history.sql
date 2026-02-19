-- Trade history for each user
CREATE TABLE IF NOT EXISTS trades (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  offered_card_ids TEXT[] NOT NULL,
  received_card_ids TEXT[] NOT NULL,
  offered_value INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_trades_user_created ON trades(user_id, created_at DESC);
