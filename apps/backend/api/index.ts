import app from '../src/index';

module.exports = (req: any, res: any) => {
  // Vercel 的 Serverless Functions 会自动去掉 /api 前缀
  // 需要加回去让 Express 路由正确匹配
  if (!req.url.startsWith('/api')) {
    req.url = '/api' + req.url;
  }
  return app(req, res);
};



