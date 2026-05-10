const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const roleModel = require('../models/roleModel');

async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication credentials missing' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findUserById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

function authorize(...allowedRoles) {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const roleId = req.user.role_id;
    const roleName = req.user.role_name;
    const normalizedRoles = await Promise.all(
      allowedRoles.map(async (role) => {
        if (typeof role === 'number') return role;
        const roleEntry = await roleModel.findRoleByName(role);
        return roleEntry ? roleEntry.id : null;
      })
    );

    if (!normalizedRoles.includes(roleId) && !allowedRoles.includes(roleName)) {
      return res.status(403).json({ message: 'Forbidden: insufficient permissions' });
    }

    next();
  };
}

module.exports = {
  authenticate,
  authorize,
};
