# Allcare System

A full-stack health care management system.

## Tech Stack

- **Backend**: Node.js, Express, Sequelize, PostgreSQL
- **Frontend**: React, Vite, Ant Design, Axios

## Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/dacong-space/allcare-system.git
   ```

2. **Backend**
   ```bash
   cd backend
   npm install
   # Create a .env file with DATABASE_URL
   npm start
   ```

3. **Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## API Documentation

Swagger UI available at: [http://localhost:3001/api-docs](http://localhost:3001/api-docs)

## 测试说明  

### 后端  
1. 安装依赖：  
```
cd backend
npm install
```  
2. 代码格式检查（ESLint）：  
```
npm run lint
```  
3. 运行单元测试与集成测试：  
```
npm test
```  
> 集成测试会在内存 SQLite 数据库中自动执行迁移并验证主要接口。

### 前端  
1. 安装依赖：  
```bash
cd frontend
npm install
```  
2. 运行 E2E 自动化测试（可视化界面）：  
```bash
npm run e2e
```  
3. 运行 E2E 自动化测试（CI 模式，无头）：  
```bash
npm run e2e:ci
```  

### CI 集成  
GitHub Actions 已配置：每次提交或 PR 到 `main` 分支时，自动执行后端 lint、测试以及前端 lint、构建和 E2E 测试。

## 开发流程建议  
1. 新功能开发完成后，先运行 `npm run lint` 和 `npm test`（后端）确保无报错。
2. 再执行前端 `npm run lint` 与构建 `npm run build` 验证无构建错误。
3. 本地验证通过后提交 PR，CI 会再次校验并部署文档。  

## 部署  
请参考上方各模块说明进行部署。

## Code Quality

- ESLint & Prettier configured for consistent styling
- Husky & lint-staged enforce pre-commit checks

## Continuous Integration

See [`.github/workflows/ci.yml`](.github/workflows/ci.yml) for GitHub Actions workflow.

## License

MIT
