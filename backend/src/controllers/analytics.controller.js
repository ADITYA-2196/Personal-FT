import { query } from '../db.js';

export const overview = async (req, res, next) => {
  try {
    const { year } = req.query;
    const params = [req.user.id];
    let yearFilter = '';
    if (year) { params.push(year); yearFilter = `AND EXTRACT(YEAR FROM date) = $${params.length}`; }
    const sum = await query(
      `SELECT
         SUM(CASE WHEN type='income' THEN amount ELSE 0 END) as income,
         SUM(CASE WHEN type='expense' THEN amount ELSE 0 END) as expense
       FROM transactions
       WHERE user_id=$1 ${yearFilter}`, params
    );
    const data = sum.rows[0];
    res.json({
      year: year || 'all',
      totalIncome: Number(data.income || 0),
      totalExpense: Number(data.expense || 0),
      balance: Number(data.income || 0) - Number(data.expense || 0)
    });
  } catch (e) { next(e); }
};

export const byCategory = async (req, res, next) => {
  try {
    const { month, year } = req.query;
    const params = [req.user.id];
    let filter = 'WHERE user_id=$1';
    if (year) { params.push(year); filter += ` AND EXTRACT(YEAR FROM date) = $${params.length}`; }
    if (month) { params.push(month); filter += ` AND EXTRACT(MONTH FROM date) = $${params.length}`; }
    const result = await query(
      `SELECT category,
              SUM(CASE WHEN type='expense' THEN amount ELSE 0 END) as expense,
              SUM(CASE WHEN type='income' THEN amount ELSE 0 END) as income
       FROM transactions
       ${filter}
       GROUP BY category
       ORDER BY category ASC`, params
    );
    res.json(result.rows.map(r => ({
      category: r.category,
      expense: Number(r.expense || 0),
      income: Number(r.income || 0)
    })));
  } catch (e) { next(e); }
};

export const trends = async (req, res, next) => {
  try {
    const { year } = req.query;
    const params = [req.user.id];
    let filter = 'WHERE user_id=$1';
    if (year) { params.push(year); filter += ` AND EXTRACT(YEAR FROM date) = $${params.length}`; }
    const result = await query(
      `SELECT
         EXTRACT(MONTH FROM date) as month,
         SUM(CASE WHEN type='income' THEN amount ELSE 0 END) as income,
         SUM(CASE WHEN type='expense' THEN amount ELSE 0 END) as expense
       FROM transactions
       ${filter}
       GROUP BY month
       ORDER BY month`, params
    );
    res.json(result.rows.map(r => ({
      month: Number(r.month),
      income: Number(r.income || 0),
      expense: Number(r.expense || 0)
    })));
  } catch (e) { next(e); }
};
