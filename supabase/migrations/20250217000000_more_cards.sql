-- Add more cards to the catalog
INSERT INTO cards (id, name, rarity, value) VALUES
  ('007', 'Shadowmaw', 'common', 1),
  ('008', 'Crystalfin', 'common', 1),
  ('009', 'Emberpup', 'common', 1),
  ('010', 'Mossback', 'common', 1),
  ('011', 'Thunderhoof', 'rare', 3),
  ('012', 'Frostwing', 'rare', 3),
  ('013', 'Venomtail', 'rare', 3),
  ('014', 'Ironhide', 'rare', 3),
  ('015', 'Stormbringer', 'epic', 6),
  ('016', 'Voidclaw', 'epic', 6)
ON CONFLICT (id) DO NOTHING;
