import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { getDb } from '../utils/db.js';

const router = express.Router();

// 获取员工列表
router.get('/', authMiddleware, async (req, res) => {
  const db = getDb();
  const employees = await db.all('SELECT * FROM employees');
  const result = employees.map(e => ({
    ...e,
    language: JSON.parse(e.language || '[]'),
  }));
  res.json({ code: 0, msg: 'success', data: result });
});

// 新增员工
router.post('/', authMiddleware, async (req, res) => {
  const db = getDb();
  const {
    id, name, age, gender, language, phone, email, address, joinDate, position, status, notes
  } = req.body;
  try {
    await db.run(
      `INSERT INTO employees (id, name, age, gender, language, phone, email, address, joinDate, position, status, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id, name, age, gender, JSON.stringify(language), phone, email, address, joinDate, position, status, notes
      ]
    );
    res.json({ code: 0, msg: 'success' });
  } catch (err) {
    res.json({ code: 1, msg: err.message });
  }
});

// 编辑员工
router.put('/:id', authMiddleware, async (req, res) => {
  const db = getDb();
  const id = req.params.id;
  const {
    name, age, gender, language, phone, email, address, joinDate, position, status, notes
  } = req.body;
  try {
    await db.run(
      `UPDATE employees SET
        name = ?, age = ?, gender = ?, language = ?, phone = ?, email = ?, address = ?, joinDate = ?, position = ?, status = ?, notes = ?
      WHERE id = ?`,
      [
        name, age, gender, JSON.stringify(language), phone, email, address, joinDate, position, status, notes, id
      ]
    );
    res.json({ code: 0, msg: 'success' });
  } catch (err) {
    res.json({ code: 1, msg: err.message });
  }
});

// 删除员工
router.delete('/:id', authMiddleware, async (req, res) => {
  const db = getDb();
  const id = req.params.id;
  try {
    await db.run('DELETE FROM employees WHERE id = ?', [id]);
    res.json({ code: 0, msg: 'success' });
  } catch (err) {
    res.json({ code: 1, msg: err.message });
  }
});

export default router;
