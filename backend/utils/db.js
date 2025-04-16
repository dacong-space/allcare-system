import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

let dbInstance = null;

export async function initDb() {
  if (!dbInstance) {
    dbInstance = await open({
      filename: 'database.sqlite',
      driver: sqlite3.Database
    });
    // 自动建表，确保 users 表存在
    await dbInstance.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
      );
    `);
  }
  return dbInstance;
}

export function getDb() {
  if (!dbInstance) {
    throw new Error('Database not initialized!');
  }
  return dbInstance;
}
