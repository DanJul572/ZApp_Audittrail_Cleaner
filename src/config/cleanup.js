require('./loadEnv');

module.exports = {
  // Rows deleted per statement. Small batches keep each lock short on a busy table.
  batchSize: parseInt(process.env.CLEANUP_BATCH_SIZE, 10) || 5000,
};
