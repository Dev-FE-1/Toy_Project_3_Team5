import { useState } from 'react';

export const useCheckDuplicate = () => {
  const [message, setMessage] = useState('');
  const [isChecked, setIsChecked] = useState(false);

  const checkDuplicate = async (
    value: string,
    checkFunc: (val: string) => Promise<boolean>,
    errorMessage: string,
    successMessage: string
  ) => {
    if (!value) {
      setMessage('');
      setIsChecked(false);
      return;
    }

    const exists = await checkFunc(value);
    if (exists) {
      setMessage(errorMessage);
      setIsChecked(false);
    } else {
      setMessage(successMessage);
      setIsChecked(true);
    }
  };

  return { message, isChecked, checkDuplicate, setMessage, setIsChecked };
};
