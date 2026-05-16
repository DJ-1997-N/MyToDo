import app from '../src/index';
import { VercelRequest, VercelResponse } from '@vercel/node';

module.exports = function handler(req: VercelRequest, res: VercelResponse) {
  return app(req, res);
};


