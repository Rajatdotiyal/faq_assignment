const { RedisMemoryServer } = require('redis-memory-server');
const { createClient } = require('redis');

async function startRedis() {
    // Create a new Redis instance
    const redisServer = new RedisMemoryServer();
    
    // Get the port Redis is running on
    const port = await redisServer.getPort();
    
    // Create Redis client
    const client = createClient({
        url: `redis://127.0.0.1:${port}`
    });

    client.on('error', err => console.log('Redis Client Error', err));
    
    await client.connect();
    
    console.log(`Redis server is running on port ${port}`);
    
    // Test the connection
    await client.set('test', 'Hello from Redis');
    const value = await client.get('test');
    console.log('Test value:', value);
    
    return { client, redisServer };
}

module.exports = startRedis;