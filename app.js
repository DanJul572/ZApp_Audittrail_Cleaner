require('./src/config/loadEnv');

const db = require('./src/models');

const jobs = require('./src/jobs');

async function stop() {
  try {
    await db.sequelize.close();
  } finally {
    process.exit(0);
  }
}

async function start() {
  try {
    await db.sequelize.authenticate();
    console.log('Database connected');
  } catch (err) {
    console.error('Database connection failed:', err.message);
    process.exit(1);
  }

  // The job is all this app does; with it disabled there is nothing to keep running for.
  if (!jobs.logRetention.start()) {
    console.log('Log retention is disabled (set LOG_RETENTION_ENABLED=true); nothing to do');
    await stop();
  }
}

process.on('SIGINT', stop);
process.on('SIGTERM', stop);

start();
