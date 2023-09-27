import * as bcrypt from 'bcrypt';

import config from '@/config/config';

export type HmacEncoding = 'hex' | 'base64';

export async function hash(value: string): Promise<string> {
  const saltRounds = parseInt(config.auth.saltRounds, 10);

  return bcrypt.hash(value, saltRounds);
}

export async function compareWithHashValue(value: string, hashedValue: string): Promise<boolean> {
  return bcrypt.compare(value, hashedValue);
}
