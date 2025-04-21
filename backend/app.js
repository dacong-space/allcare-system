const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const sequelize = require('./db');
const authRoutes = require('./routes/auth');
const customerRoutes = require('./routes/customers');
const employeeRoutes = require('./routes/employees');
const documentRoutes = require('./routes/documents');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const PORT = 3001;

// 使用 morgan 记录请求日志
app.use(morgan('combined'));

app.use(cors());
app.use(express.json());

// Swagger 文档配置
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: { title: 'Allcare System API', version: '1.0.0', description: 'API 文档' },
    servers: [{ url: `http://localhost:${PORT}/api` }]
  },
  apis: ['./routes/*.js']
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 登录相关接口
app.use('/api', authRoutes);

// 客户相关接口
app.use('/api/customers', customerRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/documents', documentRoutes);

// 导入模型以支持员工表重建
const Employee = require('./models/Employee');

if (require.main === module) {
  (async () => {
    try {
      // 同步 Employee 表（保留已有数据）
      await Employee.sync();
      console.log('Employees table synced');
    } catch (err) {
      console.warn('Skipping Employees sync:', err.message);
    }
    try {
      // 将已有的 language 字段转为 JSON 类型
      await sequelize.query(`
        ALTER TABLE "Employees" ALTER COLUMN "language" TYPE JSON USING language::json;
      `);
      console.log('Converted language column to JSON');
    } catch (err) {
      console.warn('Skipping language cast:', err.message);
    }
    await sequelize.sync({ alter: true });
    app.listen(PORT);
  })();
}

// 导出 app 以便测试使用
module.exports = app;
