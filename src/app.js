const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Import configurations
const connectDB = require('./config/database');
const redisConfig = require('./config/redis');

// Import routes
const faqRoutes = require('./routes/faq');

// Import middleware
const cacheMiddleware = require('./middleware/cache');
const translatorMiddleware = require('./middleware/translator');

dotenv.config();

const app = express();

// Connect to databases
(async () => {
    try {
        await connectDB();
        await redisConfig.connect();
        console.log('All database connections established');
    } catch (error) {
        console.error('Database connection error:', error);
        process.exit(1);
    }
})();

// Global Middleware
app.use(cors());
app.use(express.json());
app.use(translatorMiddleware());

// API Routes with middleware
app.use('/api/faqs', cacheMiddleware(3600), faqRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Handle graceful shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    await redisConfig.disconnect();
    process.exit(0);
});

module.exports = app;