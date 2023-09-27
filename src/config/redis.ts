import IORedis from 'ioredis';

interface RedisConnectionAttributes {
  host: string;
  port: number;
  password: string;
}

const connectionAttributes: RedisConnectionAttributes = {
  host: process.env.REDIS_HOST || 'localhost',
  port: Number(process.env.REDIS_PORT || 6379),
  password: process.env.REDIS_PASSWORD || '',
};

export default class Redis {
  private static instance: IORedis;

  public static getInstance() {
    if (!Redis.instance) {
      Redis.instance = new IORedis({
        ...connectionAttributes,
        maxRetriesPerRequest: null,
      });
    }

    return Redis.instance;
  }
}
