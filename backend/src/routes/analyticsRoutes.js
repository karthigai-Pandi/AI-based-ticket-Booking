const express = require('express');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const db = require('../utils/db');

const router = express.Router();

// Get ticket trends (monthly counts)
router.get('/trends', authenticate, async (req, res) => {
  try {
    const query = `
      SELECT
        DATE_FORMAT(created_at, '%Y-%m') as month,
        COUNT(*) as count
      FROM tickets
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
      GROUP BY DATE_FORMAT(created_at, '%Y-%m')
      ORDER BY month
    `;
    const [rows] = await db.execute(query);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch ticket trends' });
  }
});

// Get department issue counts
router.get('/departments', authenticate, async (req, res) => {
  try {
    const query = `
      SELECT
        d.name as department,
        COUNT(t.id) as count
      FROM departments d
      LEFT JOIN tickets t ON d.id = t.department_id
      GROUP BY d.id, d.name
      ORDER BY count DESC
    `;
    const [rows] = await db.execute(query);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch department stats' });
  }
});

// Get engineer performance
router.get('/engineers', authenticate, async (req, res) => {
  try {
    const query = `
      SELECT
        u.name as engineer,
        COUNT(t.id) as assigned_tickets,
        AVG(CASE WHEN t.status = 'Resolved' THEN 1 ELSE 0 END) * 100 as resolution_rate,
        AVG(TIMESTAMPDIFF(HOUR, t.created_at, t.updated_at)) as avg_resolution_time
      FROM users u
      LEFT JOIN tickets t ON u.id = t.assigned_to
      WHERE u.role_id = (SELECT id FROM roles WHERE name = 'Engineer')
      GROUP BY u.id, u.name
      ORDER BY assigned_tickets DESC
    `;
    const [rows] = await db.execute(query);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch engineer stats' });
  }
});

// Get SLA compliance
router.get('/sla', authenticate, async (req, res) => {
  try {
    const query = `
      SELECT
        COUNT(*) as total_tickets,
        SUM(CASE WHEN is_overdue = 0 THEN 1 ELSE 0 END) as on_time,
        SUM(CASE WHEN is_overdue = 1 THEN 1 ELSE 0 END) as overdue,
        (SUM(CASE WHEN is_overdue = 0 THEN 1 ELSE 0 END) / COUNT(*)) * 100 as compliance_rate
      FROM tickets
      WHERE status IN ('Resolved', 'Closed')
    `;
    const [rows] = await db.execute(query);
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch SLA stats' });
  }
});

// Get category analysis
router.get('/categories', authenticate, async (req, res) => {
  try {
    const query = `
      SELECT
        category,
        COUNT(*) as count,
        AVG(CASE WHEN status = 'Resolved' THEN TIMESTAMPDIFF(HOUR, created_at, updated_at) ELSE NULL END) as avg_resolution_time
      FROM tickets
      GROUP BY category
      ORDER BY count DESC
    `;
    const [rows] = await db.execute(query);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch category stats' });
  }
});

// Export tickets to CSV
router.get('/export/csv', authenticate, authorize(['Admin', 'Manager']), async (req, res) => {
  try {
    const query = `
      SELECT
        t.ticket_key,
        t.title,
        t.category,
        t.priority,
        t.status,
        d.name as department,
        u1.name as created_by,
        u2.name as assigned_to,
        t.created_at,
        t.updated_at
      FROM tickets t
      LEFT JOIN departments d ON t.department_id = d.id
      LEFT JOIN users u1 ON t.created_by = u1.id
      LEFT JOIN users u2 ON t.assigned_to = u2.id
      ORDER BY t.created_at DESC
    `;
    const [rows] = await db.execute(query);

    // Convert to CSV
    const csv = [
      ['Ticket Key', 'Title', 'Category', 'Priority', 'Status', 'Department', 'Created By', 'Assigned To', 'Created At', 'Updated At'],
      ...rows.map(row => [
        row.ticket_key,
        row.title,
        row.category,
        row.priority,
        row.status,
        row.department,
        row.created_by,
        row.assigned_to,
        row.created_at,
        row.updated_at
      ])
    ].map(row => row.join(',')).join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=tickets.csv');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ error: 'Failed to export CSV' });
  }
});

module.exports = router;