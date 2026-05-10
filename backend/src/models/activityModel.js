const db = require('../utils/db');

async function logActivity(entry) {
  const pool = db.getPool();
  const [result] = await pool.query(
    `INSERT INTO activity_logs (user_id, ticket_id, action, details) VALUES (?, ?, ?, ?)`,
    [entry.userId || null, entry.ticketId || null, entry.action, entry.details || null]
  );
  return result.insertId;
}

module.exports = {
  logActivity,
};
