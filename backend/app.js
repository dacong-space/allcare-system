import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import authRoutes from './routes/auth.js';
import customerRoutes from './routes/customers.js';
import employeeRoutes from './routes/employees.js';
import documentRoutes from './routes/documents.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// 路由
app.use('/api', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/documents', documentRoutes);

// 启动数据库并监听端口
import { initDb } from './utils/db.js';
import initDocumentsTable from './models/init.js';

(async () => {
  const db = await initDb(); // 自动初始化数据库和建表
  await initDocumentsTable(db); // 初始化文档表结构
  app.listen(PORT, () => {
    console.log(`Backend server running at http://localhost:${PORT}`);
  });
})();
