import { query } from '../db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

/** Sanitize role */
const sanitizeRole = (role) => (['admin','user','read-only'].includes(role) ? role : 'user');

export const register = async (req, res, next) => {
  try {
    const { email, password, name, role } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });
    const exists = await query('SELECT id FROM users WHERE email=$1', [email]);
    if (exists.rowCount) return res.status(409).json({ message: 'Email already in use' });
    const hash = await bcrypt.hash(password, 10);
    const userRole = sanitizeRole(role);
    const result = await query('INSERT INTO users(name,email,password_hash,role) VALUES($1,$2,$3,$4) RETURNING id, role, name, email', [name || 'User', email, hash, userRole]);
    const user = result.rows[0];
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
    res.status(201).json({ token, user });
  } catch (e) { next(e); }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await query('SELECT id, name, email, password_hash, role FROM users WHERE email=$1', [email]);
    if (!result.rowCount) return res.status(401).json({ message: 'Invalid credentials' });
    const user = result.rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
    delete user.password_hash;
    res.json({ token, user });
  } catch (e) { next(e); }
};

export const me = async (req, res) => {
  const result = await query('SELECT id, name, email, role, created_at FROM users WHERE id=$1', [req.user.id]);
  res.json(result.rows[0]);
};
