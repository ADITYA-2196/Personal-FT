import { query } from '../db.js';

export const list = async (req, res, next) => {
  try {
    const result = await query('SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (e) { next(e); }
};

export const getOne = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const result = await query('SELECT id, name, email, role, created_at FROM users WHERE id=$1', [id]);
    if (!result.rowCount) return res.status(404).json({ message: 'Not found' });
    res.json(result.rows[0]);
  } catch (e) { next(e); }
};
