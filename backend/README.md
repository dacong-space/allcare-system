# Allcare System 后端

## 技术栈
- Node.js + Express
- SQLite3
- JWT 用户认证

## 启动方法

1. 安装依赖
   ```bash
   npm install
   ```
2. 启动服务
   ```bash
   npm start
   ```

服务默认监听 3001 端口。

## 主要接口
- POST   `/api/register`   用户注册
- POST   `/api/login`      用户登录，返回 JWT
- GET    `/api/customers`  获取客户列表（需认证）
- GET    `/api/employees`  获取员工列表（需认证）
- GET    `/api/documents`  获取文档列表（需认证）

## 数据库文件
- 数据库存储在 `backend/database.sqlite`，无需手动创建，首次启动自动生成。

---
如需扩展更多接口或业务，请补充 routes/controllers/models 目录。
