const config = require('../config');
const rabbitmq = require('../helpers/rabbitmq');
const tasks = require('../tasks');

async function handle(message) {
  const task = Object.hasOwn(tasks, message.task) ? tasks[message.task] : null;
  if (!task) {
    console.warn('Cleanup consumer: unknown task', message);
    return;
  }

  await task.run(message);
}

/**
 * Consumes the cleanup messages of the worker app ({ task, ... }), one at a time, so deletes
 * never compete with each other.
 */
async function start() {
  await rabbitmq.consume(config.rabbitmq.queueName.cleanup, handle, { prefetch: 1 });
  console.log(`Cleanup consumer: waiting for messages on ${config.rabbitmq.queueName.cleanup}`);
}

module.exports = {
  handle,
  start,
};
