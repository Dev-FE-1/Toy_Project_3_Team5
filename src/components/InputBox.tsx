import React from 'react';
import { css } from '@emotion/react';
import colors from '@/constants/colors';
import { fontSize, fontWeight } from '@/constants/font';
import useInput from '@/hooks/useInput';

interface InputBoxProps {
  label: string;
  placeholder: string;
  validate?: (value: string) => string;
  isPassword?: boolean;
  isTextarea?: boolean;
  labelStyle?: React.CSSProperties;
  width?: string;
  height?: string;
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
}) => {
  const { value, onChangeValue, onFocusout, isValid, errorMessage } = useInput(
    '',
    validate
  );

  const hasValidation = !!validate;

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
            onChange={onChangeValue}
            onFocus={onFocusout}
            css={inputStyle(isValid, hasValidation, width, height, true)}
          />
        ) : (
          <input
            type={isPassword ? 'password' : 'text'}
            placeholder={placeholder}
            value={value}
            onChange={onChangeValue}
            onFocus={onFocusout}
            css={inputStyle(isValid, hasValidation, width, height, false)}
          />
        )}
        {errorMessage && (
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
  isValid: boolean | null,
  hasValidation: boolean,
  width: string,
  height: string,
  isTextarea: boolean
) => css`
  width: ${width};
  height: ${height};
  padding: 8px 12px;
  border: 1px solid
    ${!hasValidation
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
    border-color: ${isValid === null
      ? colors.primaryNormal
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
