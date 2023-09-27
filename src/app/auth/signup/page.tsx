'use client';

import * as React from 'react';

import { Prisma } from '@prisma/client';

import { createUserAction } from '@/app/actions/action';
import SignUpForm from '@/components/Signup/Form';
import toast from '@/lib/toast';

const SignUp = () => {
  const handleFormSubmit = async (payload: Prisma.UserCreateInput) => {
    try {
      await createUserAction(payload);
      toast('The user account has been successfully created. You can now log in.', 'success');
    } catch (err) {
      toast('An issue occurred when creating the user account', 'error');
    }
  };

  return (
    <main className="layout-auth">
      <h2 className="layout-auth__heading">Sign Up Form</h2>
      <SignUpForm handleFormSubmit={handleFormSubmit} />
    </main>
  );
};

export default SignUp;
