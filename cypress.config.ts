import { defineConfig } from 'cypress';
import resetAllDatabaseTables from '@test/helpers/database.reset';
import {
  createUser,
  createSearchResults,
  createScrapedSearchResult,
} from '@test/helpers/database.seed';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, _config) {
      on('task', {
        async resetDatabase() {
          return resetAllDatabaseTables();
        },

        async setupUser(user) {
          return createUser(user);
        },

        async setupSearchResults(searchResults) {
          return createSearchResults(searchResults);
        },

        async setupScrapedSearchResult(searchResult) {
          return createScrapedSearchResult(searchResult);
        },
      });
    },
  },
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
  },
});
