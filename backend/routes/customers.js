import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { getDb } from '../utils/db.js';

const router = express.Router();

// 获取客户列表
router.get('/', authMiddleware, async (req, res) => {
  const db = getDb();
  const customers = await db.all('SELECT * FROM customers');
  const result = customers.map(c => ({
    ...c,
    language: JSON.parse(c.language || '[]'),
    preferredDates: JSON.parse(c.preferredDates || '[]'),
    emergencyContact: JSON.parse(c.emergencyContact || '{}'),
  }));
  res.json({ code: 0, msg: 'success', data: result });
});

// 新增客户
router.post('/', authMiddleware, async (req, res) => {
  const db = getDb();
  const {
    id, name, gender, age, language, phone, email, city, address, hours,
    joinDate, joinCount, status, points, preferredDates, rn, pca, supportPlanner,
    lastVisitDate, notes, emergencyContact
  } = req.body;

  try {
    await db.run(
      `INSERT INTO customers (
        id, name, gender, age, language, phone, email, city, address, hours,
        joinDate, joinCount, status, points, preferredDates, rn, pca, supportPlanner,
        lastVisitDate, notes, emergencyContact
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id, name, gender, age, JSON.stringify(language), phone, email, city, address, hours,
        joinDate, joinCount, status, points, JSON.stringify(preferredDates), rn, pca, supportPlanner,
        lastVisitDate, notes, JSON.stringify(emergencyContact)
      ]
    );
    res.json({ code: 0, msg: 'success' });
  } catch (err) {
    res.json({ code: 1, msg: err.message });
  }
});

// 编辑客户
router.put('/:id', authMiddleware, async (req, res) => {
  const db = getDb();
  const id = req.params.id;
  const {
    name, gender, age, language, phone, email, city, address, hours,
    joinDate, joinCount, status, points, preferredDates, rn, pca, supportPlanner,
    lastVisitDate, notes, emergencyContact
  } = req.body;

  try {
    await db.run(
      `UPDATE customers SET
        name = ?, gender = ?, age = ?, language = ?, phone = ?, email = ?, city = ?, address = ?, hours = ?,
        joinDate = ?, joinCount = ?, status = ?, points = ?, preferredDates = ?, rn = ?, pca = ?, supportPlanner = ?,
        lastVisitDate = ?, notes = ?, emergencyContact = ?
      WHERE id = ?`,
      [
        name, gender, age, JSON.stringify(language), phone, email, city, address, hours,
        joinDate, joinCount, status, points, JSON.stringify(preferredDates), rn, pca, supportPlanner,
        lastVisitDate, notes, JSON.stringify(emergencyContact), id
      ]
    );
    res.json({ code: 0, msg: 'success' });
  } catch (err) {
    res.json({ code: 1, msg: err.message });
  }
});

// 删除客户
router.delete('/:id', authMiddleware, async (req, res) => {
  const db = getDb();
  const id = req.params.id;
  try {
    await db.run('DELETE FROM customers WHERE id = ?', [id]);
    res.json({ code: 0, msg: 'success' });
  } catch (err) {
    res.json({ code: 1, msg: err.message });
  }
});

export default router;
