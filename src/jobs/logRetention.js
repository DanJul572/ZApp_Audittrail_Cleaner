const config = require('../config');
const enums = require('../enums');
const tasks = require('../tasks');

const DAY_IN_MS = 24 * 60 * 60 * 1000;
const HOUR_IN_MS = 60 * 60 * 1000;

let running = false;

/**
 * Deletes the log rows that are past their retention, one table at a time, so deletes never
 * compete with each other. A table that fails does not stop the others; it is tried again on
 * the next run. Deleting is idempotent, so running twice does no harm.
 */
async function cleanUp() {
  const now = Date.now();

  for (const [table, days] of Object.entries(config.logRetention.days)) {
    if (!days) continue;

    const before = new Date(now - days * DAY_IN_MS).toISOString();
    try {
      await tasks[enums.cleanupTask.auditTrail].run({ table, before });
    } catch (err) {
      console.error(`Log retention: could not clean up ${table}: ${err.message}`);
    }
  }
}

// A cleanup that is still running when the next one is due is not started twice.
async function tick() {
  if (running) return;
  running = true;
  try {
    await cleanUp();
  } finally {
    running = false;
  }
}

// Runs once on startup, then every LOG_RETENTION_INTERVAL_HOURS. Returns false when it is
// disabled (LOG_RETENTION_ENABLED is not true).
function start() {
  if (!config.logRetention.enabled) return false;

  tick();
  setInterval(tick, config.logRetention.intervalHours * HOUR_IN_MS);
  return true;
}

module.exports = {
  cleanUp,
  start,
};
