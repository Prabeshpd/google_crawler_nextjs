'use client';

import * as React from 'react';

import ClipLoader from 'react-spinners/ClipLoader';

interface PropTypes {
  onUpload: (formData: FormData) => void;
  isLoading: boolean;
}

const FileUploader = (props: PropTypes) => {
  const { onUpload, isLoading } = props;
  const [file, setFile] = React.useState<File>();

  const onChange = (event: React.FormEvent<HTMLInputElement>) => {
    if (event.currentTarget.files?.length) {
      const currentFile = event.currentTarget.files[0];

      setFile(currentFile);
    }
  };

  const onSubmit = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('keywords', file);

    await onUpload(formData);
    setFile(undefined);
  };

  return (
    <div className="file-upload">
      {(!isLoading && (
        <div className="file-upload__header">
          Upload CSV file with keywords
          <div className="file-upload__body">
            <label className="file-upload__label">
              <span>Upload a file</span>
              <input
                name="keywords"
                type="file"
                data-test-id="file-upload-input"
                className="file-upload__input"
                onChange={onChange}
                accept={'text/csv'}
              />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
        </div>
      )) || <ClipLoader aria-label="application-loader" />}
      {file && <div>{file.name}</div>}
      <div className="file-upload__footer">
        <button
          className="button button--primary"
          data-test-id="file-upload-submit"
          onClick={onSubmit}
        >
          Upload
        </button>
      </div>
    </div>
  );
};

export default FileUploader;
