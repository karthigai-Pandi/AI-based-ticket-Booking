const { validationResult } = require('express-validator');
const ticketModel = require('../models/ticketModel');
const slaModel = require('../models/slaModel');
const { logActivity } = require('./activityController');
const { getSocketServer } = require('../utils/socketServer');

function buildTicketKey(title) {
  const normalized = title.replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-+|-+$/g, '').toUpperCase();
  return `TSK-${normalized.substring(0, 12)}-${Date.now().toString().slice(-5)}`;
}

function addHoursToDate(date, hours) {
  const result = new Date(date);
  result.setHours(result.getHours() + hours);
  return result;
}

async function listTickets(req, res, next) {
  try {
    const filters = {
      status: req.query.status,
      priority: req.query.priority,
      departmentId: req.query.departmentId,
      assignedTo: req.query.assignedTo,
      createdBy: req.query.createdBy,
      startDate: req.query.startDate,
      endDate: req.query.endDate,
    };

    const tickets = await ticketModel.getAllTickets(filters);
    res.status(200).json({ tickets });
  } catch (error) {
    next(error);
  }
}

async function getTicket(req, res, next) {
  try {
    const ticket = await ticketModel.getTicketById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    res.status(200).json({ ticket });
  } catch (error) {
    next(error);
  }
}

async function createTicket(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      description,
      category,
      priority,
      departmentId,
      assetId,
      assignedTo,
      attachmentUrl,
      aiRecommendation,
    } = req.body;

    const ticketKey = buildTicketKey(title);
    const status = assignedTo ? 'Assigned' : 'Open';
    const slaPolicy = await slaModel.getPolicyByPriority(priority);

    const now = new Date();
    const responseDeadline = slaPolicy ? addHoursToDate(now, slaPolicy.response_time_hours) : null;
    const resolutionDeadline = slaPolicy ? addHoursToDate(now, slaPolicy.resolution_time_hours) : null;

    const ticketId = await ticketModel.createTicket({
      ticketKey,
      title,
      description,
      category,
      priority,
      status,
      departmentId,
      assetId,
      createdBy: req.user.id,
      assignedTo,
      slaPolicyId: slaPolicy?.id,
      responseDeadline,
      resolutionDeadline,
      escalationCount: 0,
      isOverdue: false,
      attachmentUrl,
      aiRecommendation,
    });

    await logActivity({
      userId: req.user.id,
      ticketId,
      action: 'Ticket created',
      details: `Created ticket ${ticketKey} with priority ${priority}`,
    });

    const ticket = await ticketModel.getTicketById(ticketId);

    // Emit Socket.IO event
    const io = getSocketServer();
    io.emit('ticketCreated', { ticket, user: req.user });

    res.status(201).json({ ticket });
  } catch (error) {
    next(error);
  }
}

async function updateTicket(req, res, next) {
  try {
    const ticket = await ticketModel.getTicketById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    if (req.user.role_id === 4 && ticket.created_by !== req.user.id) {
      return res.status(403).json({ message: 'Users can only update their own tickets' });
    }

    const updates = req.body;
    const updatedTicket = await ticketModel.updateTicket(req.params.id, updates);

    await logActivity({
      userId: req.user.id,
      ticketId: req.params.id,
      action: 'Ticket updated',
      details: `Updated ticket fields: ${Object.keys(updates).join(', ')}`,
    });

    // Emit Socket.IO event
    const io = getSocketServer();
    io.emit('ticketUpdated', { ticket: updatedTicket, user: req.user, changes: updates });

    res.status(200).json({ ticket: updatedTicket });
  } catch (error) {
    next(error);
  }
}

async function deleteTicket(req, res, next) {
  try {
    const ticket = await ticketModel.getTicketById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    if (![1, 2].includes(req.user.role_id)) {
      return res.status(403).json({ message: 'Only Admin and Manager may delete tickets' });
    }

    const wasDeleted = await ticketModel.deleteTicket(req.params.id);
    if (!wasDeleted) {
      return res.status(500).json({ message: 'Failed to delete ticket' });
    }

    await logActivity({
      userId: req.user.id,
      ticketId: req.params.id,
      action: 'Ticket deleted',
      details: `Deleted ticket ${ticket.ticket_key}`,
    });

    // Emit Socket.IO event
    const io = getSocketServer();
    io.emit('ticketDeleted', { ticketId: req.params.id, user: req.user });

    res.status(200).json({ message: 'Ticket deleted successfully' });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listTickets,
  getTicket,
  createTicket,
  updateTicket,
  deleteTicket,
};
