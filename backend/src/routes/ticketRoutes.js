const express = require('express');
const { body } = require('express-validator');
const ticketController = require('../controllers/ticketController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authenticate, ticketController.listTickets);
router.get('/:id', authenticate, ticketController.getTicket);
router.post(
  '/',
  authenticate,
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('category').trim().notEmpty().withMessage('Category is required'),
    body('priority').isIn(['Low', 'Medium', 'High', 'Critical']).withMessage('Invalid priority'),
  ],
  ticketController.createTicket
);
router.patch('/:id', authenticate, ticketController.updateTicket);
router.delete('/:id', authenticate, authorize('Admin', 'Manager'), ticketController.deleteTicket);

module.exports = router;
