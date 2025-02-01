const Redis = require('redis');

class RedisConfig {
  constructor() {
    this.client = null;
  }

  async connect() {
    try {
      this.client = Redis.createClient({
        url: process.env.REDIS_URL || 'redis://localhost:6379',
        retry_strategy: function(options) {
          if (options.error && options.error.code === 'ECONNREFUSED') {
            return new Error('The server refused the connection');
          }
          if (options.total_retry_time > 1000 * 60 * 60) {
            return new Error('Retry time exhausted');
          }
          if (options.attempt > 10) {
            return undefined;
          }
          return Math.min(options.attempt * 100, 3000);
        }
      });

      this.client.on('error', (err) => console.error('Redis Client Error', err));
      this.client.on('connect', () => console.log('Redis Client Connected'));
      this.client.on('ready', () => console.log('Redis Client Ready'));
      this.client.on('reconnecting', () => console.log('Redis Client Reconnecting'));

      await this.client.connect();
    } catch (error) {
      console.error('Redis connection error:', error);
      throw error;
    }
  }

  getClient() {
    if (!this.client) {
      throw new Error('Redis client not initialized. Call connect() first.');
    }
    return this.client;
  }
}

module.exports = new RedisConfig();