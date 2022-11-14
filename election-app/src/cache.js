const { createClient } = require('redis');
const console = require('console');
const cacheConfig = require('../config/cache');

const client = createClient({
  socket: {
    port: cacheConfig.port,
    host: cacheConfig.host,
  },
});

client.on('error', (err) => console.log('Redis Client Error', err));

client.connect().catch((e) => {
  console.error('Redis Client Error', e);
});

module.exports = {
  client,
};
