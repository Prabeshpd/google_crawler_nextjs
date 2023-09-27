import { Queue, Worker } from 'bullmq';

import Redis from '@/config/redis';
import { AsyncProcess } from '@/constants/enum';
import { BullQueue } from '@/lib/worker';

import { scrape } from './scraper';

const redisConnection = Redis.getInstance();

const scrapeBullQueue = new Queue(AsyncProcess.SCRAPE, { connection: redisConnection });

export const scrapeQueue = new BullQueue(scrapeBullQueue);

const worker = new Worker(
  AsyncProcess.SCRAPE,
  async (job) => {
    await scrape(job);
  },
  { connection: redisConnection }
);

export default worker;
