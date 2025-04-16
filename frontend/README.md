# Allcare System 前端项目

## 项目简介

Allcare System 是一个基于 React 和 Ant Design 的医疗管理系统前端项目，支持多页面管理、权限控制和主题切换，适用于医疗机构的客户、员工、文档等信息管理。

## 技术栈

- React 18
- React Router v6
- Ant Design 5.x（UI 组件库，已配置中文）
- Vite（前端构建工具）
- Context API（全局状态管理）
- 现代 JavaScript (ES6+)

## 目录结构

```
src/
  ├── App.jsx                # 应用主入口
  ├── main.jsx               # 渲染入口
  ├── components/            # 通用组件
  ├── pages/                 # 各业务页面
  ├── context/               # 全局上下文（认证、主题等）
  ├── services/              # API 请求封装
  ├── utils/                 # 工具函数
  └── assets/                # 静态资源
```

## 快速开始

1. 安装依赖

   ```bash
   npm install
   ```

2. 启动开发环境

   ```bash
   npm run dev
   ```

3. 打包生产环境

   ```bash
   npm run build
   ```

## 主要功能

- 用户登录与权限管理
- 多页面路由与布局
- 信息管理（客户、员工、文档等）
- 主题切换
- 错误页面（404）

## 后端对接

本项目当前仅为前端实现，后续可通过 `src/services/` 目录下的 API 封装对接后端接口。

## 参与贡献

欢迎提 issue 或 PR，完善功能和文档！

