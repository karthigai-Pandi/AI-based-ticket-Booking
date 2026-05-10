const roleModel = require('../models/roleModel');

async function listRoles(req, res, next) {
  try {
    const roles = await roleModel.getAllRoles();
    res.status(200).json({ roles });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listRoles,
};
