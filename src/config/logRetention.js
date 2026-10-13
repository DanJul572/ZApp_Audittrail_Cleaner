require('./loadEnv');

function toDays(value) {
  const days = parseInt(value, 10);
  return Number.isNaN(days) || days < 0 ? 0 : days;
}

module.exports = {
  enabled: process.env.LOG_RETENTION_ENABLED === 'true',
  intervalHours: parseInt(process.env.LOG_RETENTION_INTERVAL_HOURS, 10) || 24,

  // Rows older than this many days are deleted. 0 keeps the rows forever.
  days: {
    auditTrails: toDays(process.env.AUDIT_TRAIL_RETENTION_DAYS),
    auditLogins: toDays(process.env.AUDIT_LOGIN_RETENTION_DAYS),
    logErrors: toDays(process.env.ERROR_LOG_RETENTION_DAYS),
  },
};
