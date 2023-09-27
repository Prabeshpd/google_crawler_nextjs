import { Prisma } from '@prisma/client';

import dbClient from '@/config/database';

export const getDatabaseInstance = (transaction?: Prisma.TransactionClient) =>
  transaction || dbClient;
