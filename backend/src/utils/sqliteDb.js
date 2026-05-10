const sqlite3 = require('sqlite3').verbose();
const path = require('path');

let db;

async function initializeSQLite() {
  return new Promise((resolve, reject) => {
    const dbPath = path.join(__dirname, '../../data/dev.db');
    db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        reject(err);
      } else {
        console.log('SQLite database connected');
        initializeTables().then(resolve).catch(reject);
      }
    });
  });
}

async function initializeTables() {
  const tables = [
    `CREATE TABLE IF NOT EXISTS roles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      description TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS departments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      description TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role_id INTEGER,
      department_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (role_id) REFERENCES roles (id),
      FOREIGN KEY (department_id) REFERENCES departments (id)
    )`,
    `CREATE TABLE IF NOT EXISTS tickets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ticket_key TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      category TEXT,
      priority TEXT DEFAULT 'Medium',
      status TEXT DEFAULT 'Open',
      department_id INTEGER,
      asset_id INTEGER,
      created_by INTEGER,
      assigned_to INTEGER,
      sla_policy_id INTEGER,
      response_deadline DATETIME,
      resolution_deadline DATETIME,
      escalation_count INTEGER DEFAULT 0,
      is_overdue BOOLEAN DEFAULT 0,
      attachment_url TEXT,
      ai_recommendation TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (department_id) REFERENCES departments (id),
      FOREIGN KEY (created_by) REFERENCES users (id),
      FOREIGN KEY (assigned_to) REFERENCES users (id)
    )`
  ];

  for (const sql of tables) {
    await run(sql);
  }

  // Insert default data
  await seedData();
}

async function seedData() {
  try {
    // Check if roles exist
    const roles = await get('SELECT COUNT(*) as count FROM roles');
    if (roles.count === 0) {
      await run('INSERT INTO roles (name, description) VALUES (?, ?)', ['Admin', 'System Administrator']);
      await run('INSERT INTO roles (name, description) VALUES (?, ?)', ['Manager', 'Department Manager']);
      await run('INSERT INTO roles (name, description) VALUES (?, ?)', ['Engineer', 'Support Engineer']);
      await run('INSERT INTO roles (name, description) VALUES (?, ?)', ['User', 'End User']);
    }

    // Check if departments exist
    const depts = await get('SELECT COUNT(*) as count FROM departments');
    if (depts.count === 0) {
      await run('INSERT INTO departments (name, description) VALUES (?, ?)', ['IT', 'Information Technology']);
      await run('INSERT INTO departments (name, description) VALUES (?, ?)', ['HR', 'Human Resources']);
      await run('INSERT INTO departments (name, description) VALUES (?, ?)', ['Facilities', 'Building Facilities']);
    }
  } catch (error) {
    console.log('Seeding data:', error.message);
  }
}

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ id: this.lastID, changes: this.changes });
      }
    });
  });
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

function close() {
  if (db) {
    db.close();
  }
}

module.exports = {
  initializeSQLite,
  run,
  get,
  all,
  close
};