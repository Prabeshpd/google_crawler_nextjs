'use client';

import * as React from 'react';

import FileUploader from '@/components/FileUploader/FileUploader';
import config from '@/config/ui';
import toast from '@/lib/toast';

export default function Upload() {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const uploadFile = async (formData: FormData) => {
    if (!config.SERVER_URL) throw Error('Set the url of server in env file');

    setIsLoading(true);
    try {
      const url = `${config.SERVER_URL}/upload`;
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      });
      const data = await response.json();

      toast(data.message, 'success');
      setIsLoading(false);
    } catch (err: any) {
      toast(err.message, 'error');
      setIsLoading(false);
    }
  };

  return (
    <main className="layout-app">
      <div className="layout-app__body">
        <FileUploader isLoading={isLoading} onUpload={uploadFile} />
      </div>
    </main>
  );
}
