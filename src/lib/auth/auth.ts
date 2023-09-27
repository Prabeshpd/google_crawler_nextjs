import { User } from '@prisma/client';

import * as crypt from '@/lib/crypt';

export const validateUserPassword = async (user: User | null, password: string) => {
  if (!user?.password) return false;

  return crypt.compareWithHashValue(password, user.password);
};
