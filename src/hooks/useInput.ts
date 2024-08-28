import { useState } from 'react';

const useInput = (
  initialValue: string,
  validate?: (value: string) => string
) => {
  const [value, setValue] = useState(initialValue);
  const [focus, setFocus] = useState(false);

  const onChangeValue = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setValue(e.target.value);
  };

  const onFocusout = () => {
    setFocus(true);
  };

  const errorMessage = validate && focus ? validate(value) : '';
  const isValid = focus
    ? errorMessage === '' ||
      errorMessage.includes('가능') ||
      errorMessage.includes('일치합니다')
    : null;

  return {
    value,
    onChangeValue,
    onFocusout,
    isValid,
    errorMessage,
  };
};

export default useInput;
