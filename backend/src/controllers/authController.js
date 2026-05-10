const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const userModel = require('../models/userModel');
const roleModel = require('../models/roleModel');

function createToken(user) {
  return jwt.sign(
    {
      id: user.id,
      roleId: user.role_id,
      roleName: user.role_name,
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
}

async function registerUser(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, email, password, departmentId } = req.body;
    const existing = await userModel.findUserByEmail(email);
    if (existing) {
      return res.status(409).json({ message: 'Email is already registered' });
    }

    const defaultRole = await roleModel.findRoleByName('User');
    const passwordHash = await bcrypt.hash(password, 12);
    const userId = await userModel.createUser({
      firstName,
      lastName,
      email,
      passwordHash,
      roleId: defaultRole ? defaultRole.id : 4,
      departmentId,
    });

    const newUser = await userModel.findUserById(userId);
    const token = createToken(newUser);

    res.status(201).json({
      user: {
        id: newUser.id,
        firstName: newUser.first_name,
        lastName: newUser.last_name,
        email: newUser.email,
        roleId: newUser.role_id,
        roleName: newUser.role_name,
        departmentId: newUser.department_id,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
}

async function loginUser(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const user = await userModel.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = createToken(user);
    res.status(200).json({
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        roleId: user.role_id,
        roleName: user.role_name,
        departmentId: user.department_id,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
}

async function logoutUser(req, res, next) {
  try {
    // JWT is stateless; client should discard the token to log out.
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
};
