# My To-Do App

一个全栈待办事项应用，使用 React + Express + Prisma + PostgreSQL 构建。

## 技术栈

### 前端
- React 18 + Vite
- TypeScript
- Mantine UI
- TanStack Query
- Zustand

### 后端
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL (Neon)

## 项目结构

```
my-todo-app/
├── apps/
│   ├── frontend/    # React 前端应用
│   └── backend/     # Express 后端 API
├── packages/        # 共享类型定义
└── package.json     # Monorepo 根配置
```

## 快速开始

### 前置要求
- Node.js >= 24.0.0
- npm >= 10.0.0
- PostgreSQL 数据库 (或 Neon 账号)

### 安装依赖

```bash
cd my-todo-app
npm install
```

### 环境配置

1. 复制 `apps/backend/.env.example` 到 `apps/backend/.env` 并配置
2. 复制 `apps/frontend/.env.example` 到 `apps/frontend/.env` 并配置

### 数据库设置

```bash
# 运行 Prisma 迁移
npm run prepare -w apps/backend

# 生成 Prisma Client
npx prisma generate -w apps/backend
```

### 开发运行

```bash
# 同时启动前端和后端
npm run dev

# 或分别启动
npm run dev -w apps/frontend   # 前端: http://localhost:5173
npm run dev -w apps/backend    # 后端: http://localhost:3000
```

### 生产构建

```bash
npm run build
```

## 部署

### 前端 (Vercel)
1. 连接 Git 仓库到 Vercel
2. 设置根目录为 `apps/frontend`
3. 配置环境变量 `VITE_API_URL`

### 后端 (Vercel)
1. 连接 Git 仓库到 Vercel
2. 设置根目录为 `apps/backend`
3. 配置环境变量 `DATABASE_URL` 和 `JWT_SECRET`

## 功能特性

- ✅ 用户注册/登录系统 (JWT 认证)
- ✅ 任务的 CRUD 操作
- ✅ 任务分类与标签管理
- ✅ 子任务支持
- ✅ 截止日期、优先级设置
- ✅ 任务过滤与搜索
- ✅ 分页支持

## 许可证

MIT
