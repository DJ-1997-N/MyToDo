import express, { Express, Request, Response } from 'express';
import cors from 'cors';

const app: Express = express();

// CORS 配置：允许前端跨域请求
const corsOptions = {
  origin: [
    'http://localhost:5173',  // 本地开发
    'https://my-to-do-frontend-one.vercel.app'  // 生产环境
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Minimal backend is working!' });
});

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 本地开发时启动服务器（Vercel 环境不启动）
if (!process.env.VERCEL) {
  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
  });
}

export default app;
