const Redis = require('redis');
const { promisify } = require('util');

class CacheService {
  constructor() {
    this.client = Redis.createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379'
    });

    this.client.on('error', (err) => console.error('Redis Client Error', err));
    this.client.connect();
    
    this.getAsync = promisify(this.client.get).bind(this.client);
    this.setAsync = promisify(this.client.set).bind(this.client);
  }

  async get(key) {
    try {
      const value = await this.getAsync(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  async set(key, value, expirySeconds = 3600) {
    try {
      await this.setAsync(key, JSON.stringify(value), 'EX', expirySeconds);
      return true;
    } catch (error) {
      console.error('Cache set error:', error);
      return false;
    }
  }

  getCacheKey(faqId, language) {
    return `faq:${faqId}:${language}`;
  }
}

module.exports = new CacheService();