import dbClient from '@/config/database';

const resetDatabase = async () => {
  return await dbClient.$transaction([
    dbClient.searchResult.deleteMany(),
    dbClient.account.deleteMany(),
    dbClient.user.deleteMany(),
  ]);
};

export default resetDatabase;
