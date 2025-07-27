const { Queue } = require('bullmq');

const redis = require('../config/redis')

const deletionQueue = new Queue('user-deletion', {
  connection: redis
});

module.exports = {deletionQueue}