const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();
const JWT_SECRET = 'your_jwt_secret'; // 生产环境请用环境变量

// 用户登录（仅支持现有账号，无注册）
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ where: { username } });
  if (!user) {
    return res.status(401).json({ code: 1, msg: '用户不存在' });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ code: 1, msg: '密码错误' });
  }
  // 生成 token
  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: '2h' }
  );
  res.json({ code: 0, data: { token, user: { id: user.id, username: user.username, name: user.name, role: user.role } } });
});

module.exports = router;
