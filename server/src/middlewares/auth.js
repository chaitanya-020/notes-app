import jwt from 'jsonwebtoken';
import { sendError } from '../utils/http.js';


const COOKIE_NAME = process.env.COOKIE_NAME || 'token';
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

export function requireAuth(req, res, next) {
  const token = req.cookies[COOKIE_NAME];
  if (!token) return sendError(res, 401, 'Unauthorized');
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.sub;   // used by notes controller
    req.user = payload;
    next();
  } catch {
    return sendError(res, 401, 'Invalid or expired token');
  }
}
