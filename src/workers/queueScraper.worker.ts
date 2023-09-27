import { Worker, Queue } from 'bullmq';

import Redis from '@/config/redis';
import { AsyncProcess } from '@/constants/enum';
import { BullQueue } from '@/lib/worker';

import buildScraper from './queueScraper';

const redisConnection = Redis.getInstance();

const scrapeBullQueue = new Queue(AsyncProcess.QUEUE_SCRAPE, { connection: redisConnection });

export const scrapeQueue = new BullQueue(scrapeBullQueue);

const worker = new Worker(
  AsyncProcess.QUEUE_SCRAPE,
  async (job) => {
    await buildScraper(job);
  },
  { connection: redisConnection }
);

export default worker;
