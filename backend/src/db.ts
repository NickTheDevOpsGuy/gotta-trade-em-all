import Database from 'better-sqlite3';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const db = new Database('db/game.db');

// Initialize schema
const schema = readFileSync(join(__dirname, '../db/schema.sql'), 'utf-8');
db.exec(schema);
