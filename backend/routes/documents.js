import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { getDb } from '../utils/db.js';
import upload from '../utils/multerConfig.js';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// 获取文档列表
router.get('/', authMiddleware, async (req, res) => {
  const db = getDb();
  const documents = await db.all('SELECT id, title, path, mimetype, size, createdAt, category, subcategory, uploadBy FROM documents');
  res.json({ code: 0, msg: 'success', data: documents });
});

// 上传文件
router.post('/upload', authMiddleware, upload.single('file'), async (req, res) => {
  const db = getDb();
  const file = req.file;
  const category = req.body.category || '';
  const subcategory = req.body.subcategory || '';
  const uploadBy = req.body.uploadBy || '';
  if (!file) {
    return res.status(400).json({ code: 1, msg: 'No file uploaded' });
  }
  await db.run(
    'INSERT INTO documents (title, path, mimetype, size, createdAt, category, subcategory, uploadBy) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [file.originalname, file.filename, file.mimetype, file.size, new Date().toISOString(), category, subcategory, uploadBy]
  );
  res.json({ code: 0, msg: 'Upload success', data: { filename: file.filename, originalname: file.originalname } });
});

// 预览文件
router.get('/:id/preview', authMiddleware, async (req, res) => {
  const db = getDb();
  const id = req.params.id;
  const doc = await db.get('SELECT * FROM documents WHERE id = ?', [id]);
  if (!doc) {
    return res.status(404).json({ code: 1, msg: 'File not found' });
  }
  const filePath = path.resolve('uploads', doc.path);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ code: 2, msg: 'File missing on server' });
  }
  // Set headers for inline preview
  res.setHeader('Content-Type', doc.mimetype);
  res.setHeader('Content-Disposition', 'inline; filename="' + encodeURIComponent(doc.title) + '"');
  const stream = fs.createReadStream(filePath);
  stream.pipe(res);
});

// 下载文件
router.get('/:id/download', authMiddleware, async (req, res) => {
  const db = getDb();
  const id = req.params.id;
  const doc = await db.get('SELECT * FROM documents WHERE id = ?', [id]);
  if (!doc) {
    return res.status(404).json({ code: 1, msg: 'File not found' });
  }
  const filePath = path.resolve('uploads', doc.path);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ code: 2, msg: 'File missing on server' });
  }
  res.download(filePath, doc.title);
});

// 更新文件分类和子分类
router.put('/:id', authMiddleware, async (req, res) => {
  const db = getDb();
  const id = req.params.id;
  const { category, subcategory } = req.body;
  const doc = await db.get('SELECT * FROM documents WHERE id = ?', [id]);
  if (!doc) {
    return res.status(404).json({ code: 1, msg: 'File not found' });
  }
  await db.run('UPDATE documents SET category = ?, subcategory = ? WHERE id = ?', [category || doc.category, subcategory || doc.subcategory, id]);
  res.json({ code: 0, msg: '更新成功' });
});

// 删除文件
router.delete('/:id', authMiddleware, async (req, res) => {
  const db = getDb();
  const id = req.params.id;
  // 查找文件路径
  const doc = await db.get('SELECT * FROM documents WHERE id = ?', [id]);
  if (doc) {
    // 删除物理文件
    const filePath = path.resolve('uploads', doc.path);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
  // 删除数据库记录
  await db.run('DELETE FROM documents WHERE id = ?', [id]);
  res.json({ code: 0, msg: '删除成功' });
});

export default router;
