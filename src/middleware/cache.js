const cacheService = require('../services/cacheService');

const cacheMiddleware = (duration = 3600) => {
  return async (req, res, next) => {
    try {
      if (req.method !== 'GET') {
        return next();
      }

      const key = `${req.originalUrl || req.url}:${req.query.lang || 'en'}`;
      const cachedData = await cacheService.get(key);

      if (cachedData) {
        return res.json(JSON.parse(cachedData));
      }

      // Store the original send function
      const originalSend = res.json;

      // Override res.json method
      res.json = function(body) {
        // Restore original send
        res.json = originalSend;

        // Cache the response
        cacheService.set(key, JSON.stringify(body), duration);

        // Send the response
        return originalSend.call(this, body);
      };

      next();
    } catch (error) {
      console.error('Cache middleware error:', error);
      next();
    }
  };
};

module.exports = cacheMiddleware;