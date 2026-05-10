const db = require('../utils/db');

async function getAllRoles() {
  const [rows] = await db.execute('SELECT id, name, description FROM roles ORDER BY id');
  return rows;
}

async function findRoleById(id) {
  const [rows] = await db.execute('SELECT id, name, description FROM roles WHERE id = ?', [id]);
  return rows[0];
}

async function findRoleByName(name) {
  const [rows] = await db.execute('SELECT id, name, description FROM roles WHERE name = ?', [name]);
  return rows[0];
}

module.exports = {
  getAllRoles,
  findRoleById,
  findRoleByName,
};
