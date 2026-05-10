const db = require('../utils/db');

async function getPolicyByPriority(priority) {
  const pool = db.getPool();
  const [rows] = await pool.query('SELECT * FROM sla_policies WHERE priority_level = ?', [priority]);
  return rows[0];
}

module.exports = {
  getPolicyByPriority,
};
