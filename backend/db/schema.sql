
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
('006','Drakono','epic',6),
('007','Shadowmaw','common',1),
('008','Crystalfin','common',1),
('009','Emberpup','common',1),
('010','Mossback','common',1),
('011','Thunderhoof','rare',3),
('012','Frostwing','rare',3),
('013','Venomtail','rare',3),
('014','Ironhide','rare',3),
('015','Stormbringer','epic',6),
('016','Voidclaw','epic',6);

INSERT OR IGNORE INTO inventory (card_id, quantity) VALUES
('001',1),('002',1),('004',1);
