module.exports = {
    SUPPORTED_LANGUAGES: process.env.SUPPORTED_LANGUAGES?.split(',') || ['en', 'hi', 'bn'],
    DEFAULT_LANGUAGE: 'en',
    CACHE_TTL: parseInt(process.env.CACHE_TTL) || 3600,
    ERROR_MESSAGES: {
      UNSUPPORTED_LANGUAGE: 'Unsupported language',
      FAQ_NOT_FOUND: 'FAQ not found',
      UNAUTHORIZED: 'Authentication required',
      INVALID_TOKEN: 'Invalid token',
    }
  };  