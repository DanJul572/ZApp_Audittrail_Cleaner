const enums = require('../enums');
const auditTrail = require('./auditTrail');

// Task name → the module that carries it out. Drafts and trash get their own module here, run
// by their own job.
module.exports = {
  [enums.cleanupTask.auditTrail]: auditTrail,
};
