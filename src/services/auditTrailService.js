const config = require('../config');
const auditTrailQuery = require('../queries/auditTrailQuery');

/**
 * Deletes every row of a log table created before `before`, one batch at a time, so a large
 * backlog never holds a long lock. Returns the number of rows deleted.
 */
async function deleteBefore(table, before) {
  const { batchSize } = config.cleanup;
  let total = 0;

  for (;;) {
    const deleted = await auditTrailQuery.deleteBatch(table, before, batchSize);
    total += deleted;
    if (deleted < batchSize) return total;
  }
}

module.exports = {
  deleteBefore,
};
