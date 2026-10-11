const enums = require('../enums');
const auditTrail = require('./auditTrail');

// Task name (the "task" of a message) → the module that carries it out. Drafts and trash get
// their own module here.
module.exports = {
  [enums.cleanupTask.auditTrail]: auditTrail,
};
