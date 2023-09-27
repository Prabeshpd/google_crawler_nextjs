import { toast, ToastOptions } from 'react-toastify';

export default async function makeToast(message: string, type: 'success' | 'error') {
  const toastOptions: ToastOptions = {
    position: 'top-center',
    autoClose: 1000,
    hideProgressBar: false,
  };

  if (type === 'success') {
    return toast.success(message, { ...toastOptions, toastId: 'toast-success' });
  }

  return toast.error(message, { ...toastOptions, toastId: 'toast-error' });
}
