import { Job } from 'bullmq';

import { SearchResultStatus } from '@/constants/enum';
import { updateSearchResult } from '@/repositories/searchResult';
import Parser from '@/services/parser/parser';
import { searchResult } from '@/services/search/searchResult';

export const scrape = async (job: Job) => {
  const { keyword, userId, id, searchEngine } = job.data;
  try {
    const htmlData = await searchResult(keyword, searchEngine);
    const parserInstance = new Parser(searchEngine, htmlData).parser;
    const topAdUrls = parserInstance.parseTopAdWordList();
    const bottomAdUrls = parserInstance.parseBottomAdWordList();
    const nonAdUrls = parserInstance.parseNonAdWordList();
    const adWordsCount = topAdUrls.length + bottomAdUrls.length;
    const totalLinksCount = adWordsCount + nonAdUrls.length;

    const args = {
      where: {
        userId: +userId,
        id,
      },
      data: {
        status: SearchResultStatus.SUCCESS,
        adWordsCount,
        nonAdUrls,
        adWordTopUrls: topAdUrls,
        searchEngine,
        totalLinksCount,
        nonAdLinksCount: nonAdUrls.length,
        adWordsTopCount: topAdUrls.length,
        html: htmlData,
      },
    };

    await updateSearchResult(args);
  } catch (err) {
    const args = {
      where: {
        userId,
        id,
      },
      data: {
        status: SearchResultStatus.FAILED,
      },
    };

    await updateSearchResult(args);
  }
};
