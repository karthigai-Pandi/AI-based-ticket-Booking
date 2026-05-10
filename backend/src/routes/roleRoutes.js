const express = require('express');
const { listRoles } = require('../controllers/roleController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authenticate, listRoles);

module.exports = router;
