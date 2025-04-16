import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

const db = await open({
  filename: 'database.sqlite',
  driver: sqlite3.Database
});

// 用户表
await db.exec(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE,
  password TEXT
)`);

// 客户表
await db.exec(`CREATE TABLE IF NOT EXISTS customers (
  id TEXT PRIMARY KEY,
  name TEXT,
  gender TEXT,
  age INTEGER,
  language TEXT,
  phone TEXT,
  email TEXT,
  city TEXT,
  address TEXT,
  hours TEXT,
  joinDate TEXT,
  joinCount INTEGER,
  status TEXT,
  points INTEGER,
  preferredDates TEXT,
  rn TEXT,
  pca TEXT,
  supportPlanner TEXT,
  lastVisitDate TEXT,
  notes TEXT,
  emergencyContact TEXT
)`);

// 员工表
await db.exec(`CREATE TABLE IF NOT EXISTS employees (
  id TEXT PRIMARY KEY,
  name TEXT,
  age INTEGER,
  gender TEXT,
  language TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  joinDate TEXT,
  position TEXT,
  status TEXT,
  notes TEXT
)`);

// 文档表结构初始化
export default async function(db) {
  await db.run(`CREATE TABLE IF NOT EXISTS documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    path TEXT,
    mimetype TEXT,
    size INTEGER,
    createdAt TEXT
  )`);
}
