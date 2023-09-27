/**
 * @jest-environment node
 */
import IORedis from 'ioredis';

import Redis from './redis';

describe('Redis:', () => {
  let redisInstance: IORedis;

  afterAll(() => {
    redisInstance.disconnect();
  });

  describe('given "getInstance" is called', () => {
    it('returns an IORedis instance', async () => {
      redisInstance = Redis.getInstance();

      expect(redisInstance).toBeInstanceOf(IORedis);
    });
  });

  describe('given "getInstance" is called multiple times', () => {
    it('returns the same instance', async () => {
      redisInstance = Redis.getInstance();

      expect(redisInstance).toEqual(Redis.getInstance());
    });
  });
});
