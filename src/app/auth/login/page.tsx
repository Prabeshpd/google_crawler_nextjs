'use client';

import * as React from 'react';

import { useSearchParams, useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

import LogInForm from '@/components/Login/Form';
import toast from '@/lib/toast';
import { Credentials } from '@/types/common';

const Login = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const handleFormSubmit = async (payload: Credentials) => {
    const response = await signIn('credentials', {
      redirect: false,
      email: payload?.email,
      password: payload?.password,
    });
    if (!response?.error) {
      toast('You have logged in successfully.', 'success');

      return router.push(callbackUrl);
    }

    toast('The provided credentials are invalid.', 'error');
  };

  const signInGoogle = async () => {
    try {
      await signIn('google');
      toast('You have logged in successfully.', 'success');
    } catch (err: any) {
      toast(err.message, 'error');
    }
  };

  return (
    <main className="layout-auth">
      <h2 className="layout-auth__heading">Log In Form</h2>
      <LogInForm handleFormSubmit={handleFormSubmit} />
      <button onClick={signInGoogle} data-test-id="login-google" className="button button--primary">
        Login with Google
      </button>
    </main>
  );
};

export default Login;
