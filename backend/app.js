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

if (require.main === module) {
  sequelize.sync({ alter: true }).then(() => {
    app.listen(PORT);
  });
}

// 导出 app 以便测试使用
module.exports = app;
