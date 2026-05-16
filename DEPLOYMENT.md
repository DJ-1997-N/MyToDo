# My To-Do App - 部署指南

## 项目状态

### ✅ 已完成
- ✅ Monorepo 项目结构
- ✅ 前端代码（React + Vite + Mantine）
- ✅ 前端构建成功（`npm run build` ✅）
- ✅ 后端代码（Express + Prisma + TypeScript）
- ✅ Prisma 数据库 Schema
- ✅ Git 代码已提交

### ⚠️ 待解决问题
- ⚠️ 后端 TypeScript 本地构建失败（模块找不到错误）
- ⚠️ 后端开发服务器无法本地启动

### 📋 解决方案
**方案 A：部署到 Vercel（推荐）**
Vercel 的 Serverless 环境可能更好地处理 TypeScript 编译。

**方案 B：跳过 TypeScript 检查**
修改后端 `package.json` 的 `build` 脚本为 `"build": "tsc --skipLibCheck"` 或直接使用 `ts-node-dev --transpile-only`。

---

## 部署到 Vercel（免费）

### 1. 前端部署

#### 创建 `apps/frontend/vercel.json`：

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

#### 部署步骤：
1. 推送到 Git 仓库（GitHub/GitLab/Bitbucket）
2. 登录 [Vercel](https://vercel.com)
3. 点击 "New Project"
4. 导入你的 Git 仓库
5. 配置：
   - **Root Directory**: `apps/frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Environment Variables**:
     - `VITE_API_URL`: 后端部署后填入后端 URL

---

### 2. 后端部署

#### 创建 `apps/backend/vercel.json`：

```json
{
  "version": 2,
  "builds": [
    { "src": "src/index.ts", "use": "@vercel/node" }
  ],
  "routes": [
    { "src": "/(.*)", "dest": "src/index.ts" }
  ]
}
```

#### 部署步骤：
1. 在 Vercel 中点击 "New Project"
2. 导入同一个 Git 仓库
3. 配置：
   - **Root Directory**: `apps/backend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Environment Variables**:
     - `DATABASE_URL`: 你的 Neon PostgreSQL 连接字符串
     - `JWT_SECRET`: 随机字符串（用于 JWT 签名）
     - `NODE_ENV`: `production`
     - `PORT`: `3000`

4. 部署完成后，复制后端 URL（如 `https://your-backend.vercel.app`）
5. 回到前端项目配置，设置 `VITE_API_URL` 为后端 URL
6. 重新部署前端

---

### 3. 配置 Neon PostgreSQL 数据库

1. 注册 [Neon](https://neon.tech)
2. 创建新项目
3. 复制连接字符串（类似：`postgresql://user:password@ep-xxx.region.aws.neon.tech/my-todo-app?sslmode=require`）
4. 在 Vercel 后端项目中设置 `DATABASE_URL` 环境变量
5. 运行 Prisma 迁移：
   ```bash
   cd apps/backend
   npx prisma migrate deploy
   ```

---

## 本地开发替代方案

如果 Vercel 部署也失败，可以：

### 方案 1：使用 JavaScript 重写后端
将 `apps/backend/src/**/*.ts` 改为 `.js` 文件，移除所有 TypeScript 类型注解。

### 方案 2：使用 Docker 容器化
创建 `Dockerfile` 和 `docker-compose.yml`，在容器中运行。

### 方案 3：使用其他后端（如 Python FastAPI）
如果 TypeScript 配置问题太多，可以换用 Python 后端。

---

## 下一步

1. [ ] 配置 Neon PostgreSQL 数据库
2. [ ] 创建 `vercel.json` 部署配置
3. [ ] 部署前端到 Vercel
4. [ ] 部署后端到 Vercel
5. [ ] 配置环境变量
6. [ ] 运行 Prisma 数据库迁移
7. [ ] 测试完整应用

---

## 项目文件结构

```
my-todo-app/
├── apps/
│   ├── frontend/    ✅ 前端（构建成功）
│   │   ├── src/
│   │   │   ├── components/    # UI 组件
│   │   │   ├── pages/         # 页面
│   │   │   ├── hooks/         # 自定义 hooks
│   │   │   ├── services/      # API 服务
│   │   │   ├── stores/        # 状态管理
│   │   │   └── types/         # TypeScript 类型
│   │   └── dist/           # 构建输出（已生成 ✅）
│   └── backend/     ⚠️ 后端（TypeScript 配置问题）
│       ├── src/
│       │   ├── controllers/   # 业务逻辑
│       │   ├── routes/        # API 路由
│       │   ├── middleware/    # 中间件
│       │   └── utils/         # 工具函数
│       └── prisma/         # 数据库 Schema
├── package.json         # Monorepo 根配置
├── README.md           # 项目文档
└── PROGRESS.md         # 进度报告
```

---

## 常见问题

### Q: 后端 TypeScript 构建失败怎么办？
**A**: 尝试以下方案：
1. 部署到 Vercel（Vercel 可能更好地处理 TypeScript）
2. 修改 `tsconfig.json` 设置 `"skipLibCheck": true`
3. 使用 `ts-node-dev --transpile-only` 跳过类型检查
4. 将后端代码改为 JavaScript（移除类型注解）

### Q: 前端如何本地开发？
**A**: 
```bash
cd apps/frontend
npm run dev
```
访问 http://localhost:5173

### Q: 后端如何本地开发？
**A** (尝试以下命令）：
```bash
cd apps/backend
npm run dev  # 使用 ts-node-dev --transpile-only
```

如果失败，可以尝试：
```bash
npx ts-node --transpile-only src/index.ts
```

---

## 总结

- ✅ 前端代码完成并构建成功
- ✅ Git 代码已提交
- ⚠️ 后端 TypeScript 配置需要修复
- 📋 推荐：部署到 Vercel 测试

**下一步行动**：创建 Vercel 部署配置并部署应用！
