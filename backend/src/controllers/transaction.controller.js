import { query } from '../db.js';
import { invalidateUserCache } from '../middleware/cache.js';

const ownScope = (user) => (user.role === 'admin' ? '' : ' AND user_id = $params_user_id');

export const list = async (req, res, next) => {
  try {
    // Pagination & filtering
    const { page = 1, limit = 10, type, category, q, sort = 'date_desc' } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    const params = [];
    let where = 'WHERE 1=1';
    if (type) { params.push(type); where += ` AND type = $${params.length}`; }
    if (category) { params.push(category); where += ` AND category = $${params.length}`; }
    if (q) { params.push(`%${q}%`); where += ` AND (note ILIKE $${params.length})`; }

    // Scope by user for non-admin
    if (req.user.role !== 'admin') {
      params.push(req.user.id);
      where += ` AND user_id = $${params.length}`;
    }

    // Sorting
    const sortMap = {
      date_desc: 'date DESC',
      date_asc: 'date ASC',
      amount_desc: 'amount DESC',
      amount_asc: 'amount ASC'
    };
    const orderBy = sortMap[sort] || sortMap.date_desc;

    const data = await query(
      `SELECT id, user_id, type, category, amount, date, note
       FROM transactions ${where}
       ORDER BY ${orderBy}
       LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      [...params, Number(limit), offset]
    );
    const count = await query(`SELECT COUNT(*) FROM transactions ${where}`, params);
    res.json({ items: data.rows, total: Number(count.rows[0].count), page: Number(page), limit: Number(limit) });
  } catch (e) { next(e); }
};

export const create = async (req, res, next) => {
  try {
    if (req.user.role === 'read-only') return res.status(403).json({ message: 'Read-only users cannot create' });
    const { type, category, amount, date, note } = req.body;
    const result = await query(
      `INSERT INTO transactions(user_id, type, category, amount, date, note)
       VALUES($1,$2,$3,$4,$5,$6) RETURNING *`,
      [req.user.id, type, category, amount, date || new Date(), note || '']
    );
    invalidateUserCache(req.user.id);
    res.status(201).json(result.rows[0]);
  } catch (e) { next(e); }
};

export const update = async (req, res, next) => {
  try {
    if (req.user.role === 'read-only') return res.status(403).json({ message: 'Read-only users cannot update' });
    const id = Number(req.params.id);
    // Ensure ownership unless admin
    const ownerCheck = await query('SELECT user_id FROM transactions WHERE id=$1', [id]);
    if (!ownerCheck.rowCount) return res.status(404).json({ message: 'Not found' });
    if (req.user.role !== 'admin' && ownerCheck.rows[0].user_id !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const { type, category, amount, date, note } = req.body;
    const result = await query(
      `UPDATE transactions SET type=$1, category=$2, amount=$3, date=$4, note=$5 WHERE id=$6 RETURNING *`,
      [type, category, amount, date, note, id]
    );
    invalidateUserCache(ownerCheck.rows[0].user_id);
    res.json(result.rows[0]);
  } catch (e) { next(e); }
};

export const remove = async (req, res, next) => {
  try {
    if (req.user.role === 'read-only') return res.status(403).json({ message: 'Read-only users cannot delete' });
    const id = Number(req.params.id);
    // Ensure ownership unless admin
    const ownerCheck = await query('SELECT user_id FROM transactions WHERE id=$1', [id]);
    if (!ownerCheck.rowCount) return res.status(404).json({ message: 'Not found' });
    if (req.user.role !== 'admin' && ownerCheck.rows[0].user_id !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    await query('DELETE FROM transactions WHERE id=$1', [id]);
    invalidateUserCache(ownerCheck.rows[0].user_id);
    res.json({ success: true });
  } catch (e) { next(e); }
};
