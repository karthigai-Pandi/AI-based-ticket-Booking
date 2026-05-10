const db = require('../utils/db');

async function findUserByEmail(email) {
  const [rows] = await db.execute(
    `SELECT u.*, r.name AS role_name, d.name AS department_name
     FROM users u
     LEFT JOIN roles r ON u.role_id = r.id
     LEFT JOIN departments d ON u.department_id = d.id
     WHERE u.email = ?`,
    [email]
  );
  return rows[0];
}

async function findUserById(id) {
  const [rows] = await db.execute(
    `SELECT u.*, r.name AS role_name, d.name AS department_name
     FROM users u
     LEFT JOIN roles r ON u.role_id = r.id
     LEFT JOIN departments d ON u.department_id = d.id
     WHERE u.id = ?`,
    [id]
  );
  return rows[0];
}

async function createUser(user) {
  const result = await db.execute(
    `INSERT INTO users (first_name, last_name, email, password_hash, role_id, department_id)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      user.firstName,
      user.lastName,
      user.email,
      user.passwordHash,
      user.roleId,
      user.departmentId || null,
    ]
  );
  return result.insertId || result[0].id;
}

async function getAllUsers() {
  const [rows] = await db.execute(
    `SELECT u.id, u.first_name, u.last_name, u.email, u.role_id, r.name AS role_name,
            u.department_id, d.name AS department_name, u.is_active, u.created_at, u.updated_at
     FROM users u
     LEFT JOIN roles r ON u.role_id = r.id
     LEFT JOIN departments d ON u.department_id = d.id
     ORDER BY u.created_at DESC`
  );
  return rows;
}

async function updateUserProfile(id, fields) {
  const pool = db.getPool();
  const updates = [];
  const values = [];

  if (fields.firstName) {
    updates.push('first_name = ?');
    values.push(fields.firstName);
  }
  if (fields.lastName) {
    updates.push('last_name = ?');
    values.push(fields.lastName);
  }
  if (fields.phone) {
    updates.push('phone = ?');
    values.push(fields.phone);
  }
  if (fields.avatarUrl) {
    updates.push('avatar_url = ?');
    values.push(fields.avatarUrl);
  }
  if (fields.departmentId !== undefined) {
    updates.push('department_id = ?');
    values.push(fields.departmentId);
  }

  if (!updates.length) {
    return findUserById(id);
  }

  values.push(id);
  await pool.query(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, values);
  return findUserById(id);
}

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
};
