const userModel = require('../models/userModel');

async function getCurrentProfile(req, res, next) {
  try {
    const user = req.user;
    res.status(200).json({
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      roleId: user.role_id,
      departmentId: user.department_id,
      phone: user.phone,
      avatarUrl: user.avatar_url,
      isActive: user.is_active,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    });
  } catch (error) {
    next(error);
  }
}

async function listUsers(req, res, next) {
  try {
    const users = await userModel.getAllUsers();
    res.status(200).json({ users });
  } catch (error) {
    next(error);
  }
}

async function updateProfile(req, res, next) {
  try {
    const fields = req.body;
    const updatedUser = await userModel.updateUserProfile(req.user.id, fields);
    res.status(200).json({
      id: updatedUser.id,
      firstName: updatedUser.first_name,
      lastName: updatedUser.last_name,
      email: updatedUser.email,
      roleId: updatedUser.role_id,
      roleName: updatedUser.role_name,
      departmentId: updatedUser.department_id,
      phone: updatedUser.phone,
      avatarUrl: updatedUser.avatar_url,
      isActive: updatedUser.is_active,
      createdAt: updatedUser.created_at,
      updatedAt: updatedUser.updated_at,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getCurrentProfile,
  listUsers,
  updateProfile,
};
