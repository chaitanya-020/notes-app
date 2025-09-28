import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { sendOk, sendError } from '../utils/http.js';

const COOKIE_NAME = process.env.COOKIE_NAME || 'token';
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
const isProd = process.env.NODE_ENV === 'production';

function setAuthCookie(res, token) {
  const isProd = process.env.NODE_ENV === 'production';
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: isProd ? 'none' : 'lax', // ← important for cross-site
    secure: isProd,                    // required when sameSite is 'none'
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

export async function signup(req, res, next) {
  try {
    const { email, password, name } = req.body || {};
    if (!email || !password) return sendError(res, 400, 'Email and password are required');
    if (password.length < 6)   return sendError(res, 400, 'Password must be at least 6 characters');

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return sendError(res, 409, 'Email already in use');

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ email: email.toLowerCase(), passwordHash, name });
    const token = jwt.sign({ email: user.email }, JWT_SECRET, { subject: user.id, expiresIn: '7d' });

    setAuthCookie(res, token);
    return sendOk(res, user.toJSON());
  } catch (err) { next(err); }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return sendError(res, 400, 'Email and password are required');

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return sendError(res, 401, 'Invalid credentials');

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return sendError(res, 401, 'Invalid credentials');

    const token = jwt.sign({ email: user.email }, JWT_SECRET, { subject: user.id, expiresIn: '7d' });
    setAuthCookie(res, token);
    return sendOk(res, user.toJSON());
  } catch (err) { next(err); }
}

export async function me(req, res, next) {
  try {
    const user = await User.findById(req.userId).select('email name').lean();
    if (!user) return sendError(res, 401, 'Unauthorized');
    return sendOk(res, { id: req.userId, email: user.email, name: user.name });
  } catch (err) { next(err); }
}

export function logout(_req, res) {
  res.clearCookie(COOKIE_NAME, { httpOnly: true, sameSite: 'lax', secure: isProd });
  return sendOk(res, { message: 'Logged out' });
}
