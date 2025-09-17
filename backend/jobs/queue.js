const { Queue } = require('bullmq');

const redis = require('../config/redis')

const deletionQueue = new Queue('deletion', {
  connection: redis
});

module.exports = {deletionQueue}