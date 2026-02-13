
CREATE TABLE IF NOT EXISTS cards (
  id TEXT PRIMARY KEY,
  name TEXT,
  rarity TEXT,
  value INTEGER
);

CREATE TABLE IF NOT EXISTS inventory (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  card_id TEXT,
  quantity INTEGER
);

INSERT OR IGNORE INTO cards VALUES
('001','Leafling','common',1),
('002','Flametail','common',1),
('003','Aquabat','common',1),
('004','Stonehog','rare',3),
('005','Voltwing','rare',3),
('006','Drakono','epic',6);

INSERT OR IGNORE INTO inventory (card_id, quantity) VALUES
('001',1),('002',1),('004',1);
