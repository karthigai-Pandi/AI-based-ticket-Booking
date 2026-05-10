const express = require('express');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const db = require('../utils/db');
const PDFDocument = require('pdfkit');

const router = express.Router();

// Export tickets to PDF
router.get('/export/pdf', authenticate, authorize(['Admin', 'Manager']), async (req, res) => {
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

    // Create PDF
    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=tickets.pdf');
    doc.pipe(res);

    doc.fontSize(20).text('Ticket Report', { align: 'center' });
    doc.moveDown();

    rows.forEach((ticket, index) => {
      doc.fontSize(12).text(`Ticket ${index + 1}: ${ticket.ticket_key}`);
      doc.fontSize(10).text(`Title: ${ticket.title}`);
      doc.text(`Category: ${ticket.category} | Priority: ${ticket.priority} | Status: ${ticket.status}`);
      doc.text(`Department: ${ticket.department}`);
      doc.text(`Created By: ${ticket.created_by} | Assigned To: ${ticket.assigned_to}`);
      doc.text(`Created: ${ticket.created_at} | Updated: ${ticket.updated_at}`);
      doc.moveDown();
    });

    doc.end();
  } catch (error) {
    res.status(500).json({ error: 'Failed to export PDF' });
  }
});

module.exports = router;