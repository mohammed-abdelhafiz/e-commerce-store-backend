import Redis from "ioredis";

const redisClient = new Redis(process.env.REDIS_URL!);

redisClient.on("connect", () => {
  console.log("Redis connected successfully✅");
});

redisClient.on("error", (err) => {
  console.log("Redis connection error❌", err);
});

export default redisClient;