const express = require('express');
const cors = require('cors');
const sequelize = require('./db');
const Customer = require('./models/Customer');
const authRoutes = require('./routes/auth');
const customerRoutes = require('./routes/customers');
const employeeRoutes = require('./routes/employees');
const documentRoutes = require('./routes/documents');

const app = express();
const PORT = 3001;

// 全局日志，输出所有请求的方法和路径
app.use((req, res, next) => {
  console.log(`[全局日志] ${req.method} ${req.url}`);
  next();
});

app.use(cors());
app.use(express.json());

// 登录相关接口
app.use('/api', authRoutes);

// 客户相关接口
app.use('/api/customers', customerRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/documents', documentRoutes);

// 启动数据库并监听端口
sequelize.sync({ alter: true }).then(() => {
  app.listen(PORT, () => {
    console.log(`Backend server running at http://localhost:${PORT}`);
  });
});
