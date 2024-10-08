import React, { useState, useEffect } from 'react';
import { css } from '@emotion/react';
import colors from '@/constants/colors';
import { fontSize, fontWeight } from '@/constants/font';

interface InputBoxProps {
  label: string;
  description?: string;
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
  externalErrorMessage?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const InputBox: React.FC<InputBoxProps> = ({
  label,
  description,
  placeholder,
  validate,
  isPassword = false,
  isTextarea = false,
  labelStyle,
  width = '390px',
  height = '36px',
  value: propValue,
  onChange: propOnChange,
  externalErrorMessage,
  onKeyDown,
}) => {
  const [value, setValue] = useState(propValue || '');
  const [isTouched, setIsTouched] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    setValue(propValue || '');
  }, [propValue]);

  const onInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const inputValue = e.target.value;
    setValue(inputValue);
    if (propOnChange) propOnChange(e);

    if (validate) {
      const validationMessage = validate(inputValue);
      setErrorMessage(validationMessage);
    }
  };

  const onInputBlur = () => {
    setIsTouched(true);
    if (validate) {
      const validationMessage = validate(value);
      setErrorMessage(validationMessage);
    }
  };

  const errorMessageToShow = externalErrorMessage || errorMessage;
  const isValid = validate
    ? errorMessageToShow === '' ||
      errorMessageToShow.includes('가능한') ||
      errorMessageToShow.includes('일치')
    : null;

  return (
    <>
      <div css={inputContainerStyle}>
        <label css={labelStyleBase} style={labelStyle}>
          {label}
        </label>
        {description && <label css={labelStyleDesc}>{description}</label>}
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
            onKeyDown={onKeyDown}
          />
        )}
        {isTouched && errorMessageToShow && (
          <span css={messageStyle(isValid)}>{errorMessageToShow}</span>
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

const labelStyleDesc = css`
  font-size: ${fontSize.sm};
  color: ${colors.gray04};
  margin-bottom: 4px;
`;

const inputStyle = (
  isValid: boolean | null,
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
      : isValid === null
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
    border-color: ${!isTouched
      ? colors.gray02
      : isValid === null
        ? colors.gray02
        : isValid
          ? colors.primaryNormal
          : colors.redNormal};
  }
`;

const messageStyle = (isValid: boolean | null) => css`
  margin-top: 6px;
  color: ${isValid === null
    ? colors.gray02
    : isValid
      ? colors.primaryNormal
      : colors.redNormal};
  font-size: ${fontSize.xs};
`;
export default InputBox;
