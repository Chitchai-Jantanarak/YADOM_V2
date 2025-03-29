// src/utils/redisUtils.ts
import { createClient } from 'redis';

// Create Redis client from environment variables
const getRedisClient = () => {
  const url = process.env.REDIS_URL || 'redis://localhost:6379';
  
  const client = createClient({
    url: url
  });

  // Handle connection events
  client.on('error', (err) => console.error('Redis Client Error:', err));
  client.on('connect', () => console.log('Redis Client Connected'));
  client.on('reconnecting', () => console.log('Redis Client Reconnecting'));
  
  return client;
};

// Initialize client
const redisClient = getRedisClient();

// Connect to Redis
(async () => {
  try {
    await redisClient.connect();
  } catch (error) {
    console.error('Failed to connect to Redis:', error);
  }
})();

// Redis utility functions
export const redis = {
  // Set a key with optional expiration in seconds
  set: async (key: string, value: string, expireSeconds?: number): Promise<void> => {
    try {
      await redisClient.set(key, value);
      if (expireSeconds) {
        await redisClient.expire(key, expireSeconds);
      }
    } catch (error) {
      console.error(`Redis SET Error for key ${key}:`, error);
      throw new Error(`Failed to set Redis key: ${key}`);
    }
  },

  // Get a value by key
  get: async (key: string): Promise<string | null> => {
    try {
      return await redisClient.get(key);
    } catch (error) {
      console.error(`Redis GET Error for key ${key}:`, error);
      return null;
    }
  },

  // Delete a key
  del: async (key: string): Promise<void> => {
    try {
      await redisClient.del(key);
    } catch (error) {
      console.error(`Redis DEL Error for key ${key}:`, error);
    }
  },

  // Check if a key exists
  exists: async (key: string): Promise<boolean> => {
    try {
      const result = await redisClient.exists(key);
      return result === 1;
    } catch (error) {
      console.error(`Redis EXISTS Error for key ${key}:`, error);
      return false;
    }
  },
  
  // Get time-to-live for a key in seconds
  ttl: async (key: string): Promise<number> => {
    try {
      return await redisClient.ttl(key);
    } catch (error) {
      console.error(`Redis TTL Error for key ${key}:`, error);
      return -2; // -2 means key doesn't exist
    }
  },
  
  // Graceful shutdown
  quit: async (): Promise<void> => {
    try {
      await redisClient.quit();
    } catch (error) {
      console.error('Redis QUIT Error:', error);
    }
  }
};