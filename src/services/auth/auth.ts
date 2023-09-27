import { validateUserPassword } from '@/lib/auth/auth';
import { findByEmail } from '@/repositories/user';
import { Credentials } from '@/types/common';

import AuthError from './error';

export async function authenticateCredentialLogin(credentials: Credentials) {
  if (!credentials) {
    throw new AuthError({ message: 'Email and Password must be provided on logging in.' });
  }

  const { email, password } = credentials;
  const user = await findByEmail(email);
  const isValidPassword = await validateUserPassword(user, password);
  if (!isValidPassword) {
    throw new AuthError({ message: 'Provided email or password does not match.' });
  }

  return user;
}
