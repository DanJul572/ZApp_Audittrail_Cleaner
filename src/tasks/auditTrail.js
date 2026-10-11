const auditTrailService = require('../services/auditTrailService');

// Log tables this task may delete from. A message naming any other table is refused.
const TABLES = ['auditTrails', 'auditLogins', 'logErrors'];

/** { table, before }: deletes the rows of a log table created before `before` (ISO time). */
async function run({ table, before }) {
  if (!TABLES.includes(table)) {
    throw new Error(`Audit trail cleanup: "${table}" is not a log table`);
  }

  const beforeDate = new Date(before);
  if (!before || Number.isNaN(beforeDate.getTime())) {
    throw new Error(`Audit trail cleanup: "${before}" is not a valid time`);
  }

  const deleted = await auditTrailService.deleteBefore(table, beforeDate);
  console.log(
    `Audit trail cleanup: deleted ${deleted} row(s) of ${table} created before ${beforeDate.toISOString()}`,
  );
  return deleted;
}

module.exports = {
  TABLES,
  run,
};
