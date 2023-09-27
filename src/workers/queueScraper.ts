import { Job } from 'bullmq';

import { AsyncProcess } from '@/constants/enum';
import { listSearchResultByStatus } from '@/repositories/searchResult';

import { scrapeQueue } from './scraper.worker';

const BASE_RETRY_DELAY_MS = 1000;

const queueScrapeJob = async (job: Job) => {
  const { userId } = job.data;

  const searchResults = await listSearchResultByStatus(+userId);

  for (const [index, searchResult] of searchResults.entries()) {
    const delay = Math.pow(2, index) * BASE_RETRY_DELAY_MS;

    await scrapeQueue.addJob({
      name: AsyncProcess.SCRAPE,
      data: { ...searchResult },
      opts: { delay },
    });
  }
};

export default queueScrapeJob;
