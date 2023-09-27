import { Prisma } from '@prisma/client';

import dbClient from '@/config/database';

import { getDatabaseInstance } from './helper';

export const createUser = async (
  userAttributes: Prisma.UserCreateInput,
  transaction?: Prisma.TransactionClient
) => getDatabaseInstance(transaction).user.create({ data: userAttributes });

export const findByEmail = async (email: string) => dbClient.user.findUnique({ where: { email } });

export const findById = async (id: number) => dbClient.user.findUnique({ where: { id } });
