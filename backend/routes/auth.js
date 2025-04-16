import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getDb } from '../utils/db.js';

const router = express.Router();
const JWT_SECRET = 'your_jwt_secret'; // 生产环境请用环境变量

// 用户注册
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ code: 1, msg: '用户名和密码必填' });
  }
  const db = getDb();
  const user = await db.get('SELECT * FROM users WHERE username = ?', username);
  if (user) {
    return res.status(409).json({ code: 2, msg: '用户名已存在' });
  }
  const hash = await bcrypt.hash(password, 10);
  await db.run('INSERT INTO users (username, password) VALUES (?, ?)', username, hash);
  res.json({ code: 0, msg: '注册成功' });
});

// 用户登录
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const db = getDb();
  const user = await db.get('SELECT * FROM users WHERE username = ?', username);
  if (!user) {
    return res.status(401).json({ code: 1, msg: '用户名或密码错误' });
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(401).json({ code: 1, msg: '用户名或密码错误' });
  }
  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '2h' });
  res.json({ code: 0, msg: '登录成功', data: { token, userInfo: { id: user.id, username: user.username } } });
});

export default router;
