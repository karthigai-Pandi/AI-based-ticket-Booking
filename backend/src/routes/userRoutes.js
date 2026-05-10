const express = require('express');
const { getCurrentProfile, listUsers, updateProfile } = require('../controllers/userController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/me', authenticate, getCurrentProfile);
router.patch('/me', authenticate, updateProfile);
router.get('/', authenticate, authorize('Admin'), listUsers);

module.exports = router;
