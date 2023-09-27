import * as React from 'react';

export const useModal = () => {
  const [modalStatus, setModalStatus] = React.useState<boolean>(false);

  const openModal = () => {
    setModalStatus(true);
  };

  const closeModal = () => {
    setModalStatus(false);
  };

  return { modalStatus, openModal, closeModal };
};
