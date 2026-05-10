const activityModel = require('../models/activityModel');

async function logActivity(entry) {
  return activityModel.logActivity(entry);
}

module.exports = {
  logActivity,
};
