const Redis = require('ioredis');

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  username: 'default', // Required by Redis Cloud
  password: process.env.REDIS_PASSWORD,
  maxRetriesPerRequest: null
});


redis.on('connect', () => {
  console.log('[ioredis] Connecting...');
});
redis.on('ready', () => {
  console.log('[ioredis] Connected and ready 🚀');
});

redis.on('error', (err) => {
  console.error('[ioredis] Error:', err);
});

redis.on('close', () => {
  console.log('[ioredis] Connection closed ❌');
});

module.exports = redis;