const bcrypt = require('bcrypt');
const sequelize = require('../db');
const User = require('../models/User');

async function createSuperAdmin() {
  await sequelize.sync();
  const hash = await bcrypt.hash('154145', 10);
  const user = await User.create({
    id: '001',
    username: 'gaorui',
    password: hash,
    name: 'Ray',
    role: 'superadmin'
  });
  console.log('超级管理员创建成功:', user.toJSON());
  process.exit();
}

createSuperAdmin();
