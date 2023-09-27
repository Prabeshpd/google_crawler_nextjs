'use client';

import * as React from 'react';
import { ClipLoader } from 'react-spinners';

import toast from '@/lib/toast';

import { fetchCurrentUserAction } from '../actions/action';

export default function Home() {
  const [user, setUser] = React.useState<any>(undefined);
  const [loading, setLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    async function getCurrentUser() {
      try {
        setLoading(true);
        const data = await fetchCurrentUserAction();
        setUser(data);
        setLoading(false);
      } catch (err: any) {
        toast(err.message, 'error');
        setLoading(false);
      }
    }

    getCurrentUser();
  }, [fetchCurrentUserAction]);

  return (
    <main className="layout-app">
      {(!loading && (
        <div className="layout-app__body">Welcome to Application {user && user.name}</div>
      )) || <ClipLoader />}
    </main>
  );
}
