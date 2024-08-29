import React, { useState } from 'react';
import { css } from '@emotion/react';
import colors from '@/constants/colors';
import { fontSize, fontWeight } from '@/constants/font';

interface InputBoxProps {
  label: string;
  placeholder: string;
  validate?: (value: string) => string;
  isPassword?: boolean;
  isTextarea?: boolean;
  labelStyle?: React.CSSProperties;
  width?: string;
  height?: string;
  value?: string;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

const InputBox: React.FC<InputBoxProps> = ({
  label,
  placeholder,
  validate,
  isPassword = false,
  isTextarea = false,
  labelStyle,
  width = '390px',
  height = '36px',
  value: propValue,
  onChange: propOnChange,
}) => {
  const [value, setValue] = useState(propValue || '');
  const [isTouched, setIsTouched] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const isValid = !errorMessage;

  const onInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const inputValue = e.target.value;
    setValue(inputValue);
    if (propOnChange) propOnChange(e);

    if (validate) {
      setErrorMessage(validate(inputValue));
    }
  };

  const onInputBlur = () => {
    setIsTouched(true);
    if (validate) {
      setErrorMessage(validate(value));
    }
  };

  return (
    <>
      <div css={inputContainerStyle}>
        <label css={labelStyleBase} style={labelStyle}>
          {label}
        </label>
        {isTextarea ? (
          <textarea
            placeholder={placeholder}
            value={value}
            onChange={onInputChange}
            onBlur={onInputBlur}
            css={inputStyle(isValid, isTouched, width, height, true)}
          />
        ) : (
          <input
            type={isPassword ? 'password' : 'text'}
            placeholder={placeholder}
            value={value}
            onChange={onInputChange}
            onBlur={onInputBlur}
            css={inputStyle(isValid, isTouched, width, height, false)}
          />
        )}
        {isTouched && errorMessage && (
          <span css={messageStyle(isValid)}>{errorMessage}</span>
        )}
      </div>
    </>
  );
};

const inputContainerStyle = css`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;

const labelStyleBase = css`
  font-size: ${fontSize.sm};
  font-weight: ${fontWeight.regular};
  margin-bottom: 4px;
`;

const inputStyle = (
  isValid: boolean,
  isTouched: boolean,
  width: string,
  height: string,
  isTextarea: boolean
) => css`
  width: ${width};
  height: ${height};
  padding: 8px 12px;
  border: 1px solid
    ${!isTouched
      ? colors.gray02
      : isValid
        ? colors.primaryNormal
        : colors.redNormal};
  border-radius: 6px;
  font-size: ${fontSize.sm};
  resize: ${isTextarea ? 'vertical' : 'none'};

  &::placeholder {
    color: ${colors.black};
    font-size: ${fontSize.sm};
    opacity: 0.5;
  }

  &:focus {
    outline: none;
    border-color: ${isValid ? colors.primaryNormal : colors.redNormal};
  }
`;

const messageStyle = (isValid: boolean) => css`
  margin-top: 6px;
  color: ${isValid ? colors.primaryNormal : colors.redNormal};
  font-size: ${fontSize.xs};
`;

export default InputBox;
