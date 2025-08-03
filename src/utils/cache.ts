import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const redis = new Redis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: Number(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
});

export const setCache = async (key: string, value: any, ttl = 3600) => {
  await redis.set(key, JSON.stringify(value), 'EX', ttl);
};

export const getCached = async (key: string): Promise<any | null> => {
  const data = await redis.get(key);
  return data ? JSON.parse(data) : null;
};

export const clearCache = async (pattern: string) => {
  const keys = await redis.keys(`${pattern}*`);
  if (keys.length) await redis.del(...keys);
};
