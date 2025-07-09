import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

// In development, reuse global to avoid multiple connections (Next.js hot reload)
declare global {
  var __redisClient: Redis | undefined;
}

const client: Redis = global.__redisClient || new Redis(redisUrl);

if (process.env.NODE_ENV === "development") {
  global.__redisClient = client;
}

// async function main() {
//    await client.set('test', 'Hello, Redis!');

//    const response = await client.get('test');
//    console.log(`Redis client connected and test key set: ${response}`);
// }

// main();

export default client;
