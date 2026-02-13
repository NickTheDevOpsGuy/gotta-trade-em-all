
import Database from 'better-sqlite3';
import { readFileSync } from 'fs';
import { join } from 'path';

export const db = new Database('db/game.db');

// Initialize schema
const schema = readFileSync(join(__dirname, '../db/schema.sql'), 'utf-8');
db.exec(schema);
