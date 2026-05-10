const db = require('../utils/db');

function buildFilters(filters) {
  const clauses = [];
  const values = [];

  if (filters.status) {
    clauses.push('t.status = ?');
    values.push(filters.status);
  }
  if (filters.priority) {
    clauses.push('t.priority = ?');
    values.push(filters.priority);
  }
  if (filters.departmentId) {
    clauses.push('t.department_id = ?');
    values.push(filters.departmentId);
  }
  if (filters.assignedTo) {
    clauses.push('t.assigned_to = ?');
    values.push(filters.assignedTo);
  }
  if (filters.createdBy) {
    clauses.push('t.created_by = ?');
    values.push(filters.createdBy);
  }
  if (filters.startDate) {
    clauses.push('t.created_at >= ?');
    values.push(filters.startDate);
  }
  if (filters.endDate) {
    clauses.push('t.created_at <= ?');
    values.push(filters.endDate);
  }

  return {
    where: clauses.length ? `WHERE ${clauses.join(' AND ')}` : '',
    values,
  };
}

async function getAllTickets(filters = {}) {
  const pool = db.getPool();
  const { where, values } = buildFilters(filters);
  const query = `
    SELECT t.*, d.name AS department_name, a.name AS asset_name,
           creator.first_name AS creator_first_name, creator.last_name AS creator_last_name,
           assignee.first_name AS assignee_first_name, assignee.last_name AS assignee_last_name,
           s.name AS sla_policy_name
    FROM tickets t
    LEFT JOIN departments d ON t.department_id = d.id
    LEFT JOIN assets a ON t.asset_id = a.id
    LEFT JOIN users creator ON t.created_by = creator.id
    LEFT JOIN users assignee ON t.assigned_to = assignee.id
    LEFT JOIN sla_policies s ON t.sla_policy_id = s.id
    ${where}
    ORDER BY t.created_at DESC
  `;
  const [rows] = await pool.query(query, values);
  return rows;
}

async function getTicketById(id) {
  const pool = db.getPool();
  const [rows] = await pool.query(
    `
      SELECT t.*, d.name AS department_name, a.name AS asset_name,
             creator.first_name AS creator_first_name, creator.last_name AS creator_last_name,
             assignee.first_name AS assignee_first_name, assignee.last_name AS assignee_last_name,
             s.name AS sla_policy_name
      FROM tickets t
      LEFT JOIN departments d ON t.department_id = d.id
      LEFT JOIN assets a ON t.asset_id = a.id
      LEFT JOIN users creator ON t.created_by = creator.id
      LEFT JOIN users assignee ON t.assigned_to = assignee.id
      LEFT JOIN sla_policies s ON t.sla_policy_id = s.id
      WHERE t.id = ?
    `,
    [id]
  );
  return rows[0];
}

async function createTicket(ticket) {
  const pool = db.getPool();
  const [result] = await pool.query(
    `INSERT INTO tickets (
      ticket_key, title, description, category, priority, status,
      department_id, asset_id, created_by, assigned_to, sla_policy_id,
      response_deadline, resolution_deadline, escalation_count, is_overdue,
      attachment_url, ai_recommendation
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      ticket.ticketKey,
      ticket.title,
      ticket.description,
      ticket.category,
      ticket.priority,
      ticket.status,
      ticket.departmentId || null,
      ticket.assetId || null,
      ticket.createdBy,
      ticket.assignedTo || null,
      ticket.slaPolicyId || null,
      ticket.responseDeadline || null,
      ticket.resolutionDeadline || null,
      ticket.escalationCount || 0,
      ticket.isOverdue || false,
      ticket.attachmentUrl || null,
      ticket.aiRecommendation || null,
    ]
  );
  return result.insertId;
}

async function updateTicket(id, fields) {
  const pool = db.getPool();
  const updates = [];
  const values = [];

  if (fields.title) {
    updates.push('title = ?');
    values.push(fields.title);
  }
  if (fields.description) {
    updates.push('description = ?');
    values.push(fields.description);
  }
  if (fields.category) {
    updates.push('category = ?');
    values.push(fields.category);
  }
  if (fields.priority) {
    updates.push('priority = ?');
    values.push(fields.priority);
  }
  if (fields.status) {
    updates.push('status = ?');
    values.push(fields.status);
  }
  if (fields.departmentId !== undefined) {
    updates.push('department_id = ?');
    values.push(fields.departmentId || null);
  }
  if (fields.assetId !== undefined) {
    updates.push('asset_id = ?');
    values.push(fields.assetId || null);
  }
  if (fields.assignedTo !== undefined) {
    updates.push('assigned_to = ?');
    values.push(fields.assignedTo || null);
  }
  if (fields.responseDeadline !== undefined) {
    updates.push('response_deadline = ?');
    values.push(fields.responseDeadline || null);
  }
  if (fields.resolutionDeadline !== undefined) {
    updates.push('resolution_deadline = ?');
    values.push(fields.resolutionDeadline || null);
  }
  if (fields.isOverdue !== undefined) {
    updates.push('is_overdue = ?');
    values.push(fields.isOverdue);
  }
  if (fields.attachmentUrl !== undefined) {
    updates.push('attachment_url = ?');
    values.push(fields.attachmentUrl);
  }
  if (fields.aiRecommendation !== undefined) {
    updates.push('ai_recommendation = ?');
    values.push(fields.aiRecommendation);
  }

  if (!updates.length) {
    return getTicketById(id);
  }

  values.push(id);
  await pool.query(`UPDATE tickets SET ${updates.join(', ')} WHERE id = ?`, values);
  return getTicketById(id);
}

async function deleteTicket(id) {
  const pool = db.getPool();
  const [result] = await pool.query('DELETE FROM tickets WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = {
  getAllTickets,
  getTicketById,
  createTicket,
  updateTicket,
  deleteTicket,
};
