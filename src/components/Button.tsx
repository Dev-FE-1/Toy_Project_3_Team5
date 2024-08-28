import React from 'react';
import { css } from '@emotion/react';
import colors from '@/constants/colors';

type ButtonShapeType = 'block' | 'line' | 'round' | 'text';
type ButtonSizeType = 'sm' | 'md' | 'lg';
type ButtonColorType = 'primary' | 'gray' | 'red' | 'black';
type ButtonIconType = React.ComponentType<IconProps> | string | undefined;

interface IconProps {
  size?: string | number;
}

interface ButtonProps {
  label: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  shape?: ButtonShapeType;
  size?: ButtonSizeType;
  color?: ButtonColorType;
  IconComponent?: ButtonIconType;
  fullWidth?: boolean;
  disabled?: boolean;
}

type ButtonColors = {
  color: string;
  hoverColor: string;
};

const buttonColors: Record<ButtonColorType, ButtonColors> = {
  primary: { color: colors.primaryNormal, hoverColor: colors.primaryDark },
  gray: { color: colors.gray05, hoverColor: colors.gray06 },
  red: { color: colors.redNormal, hoverColor: colors.redDark },
  black: { color: colors.black, hoverColor: colors.gray04 },
};

const buttonSizes: Record<ButtonSizeType, ReturnType<typeof css>> = {
  sm: css`
    padding: 4px 12px;
  `,
  md: css`
    padding: 8px 12px;
  `,
  lg: css`
    padding: 14px 12px;
  `,
};

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  shape = 'block',
  size = 'md',
  color = 'primary',
  IconComponent = undefined,
  fullWidth = false,
  disabled = false,
}) => {
  const selectColors = buttonColors[color];
  const selectSizes = buttonSizes[size];

  return (
    <button
      css={buttonStyle(shape, selectSizes, selectColors, fullWidth, disabled)}
      onClick={onClick}
      disabled={disabled}
    >
      {IconComponent && (
        <span style={{ marginRight: '6px' }}>
          {typeof IconComponent === 'string' ? (
            <img
              src={IconComponent}
              alt='아이콘'
              style={{ width: 16, height: 16 }}
            />
          ) : (
            <IconComponent size={16} />
          )}
        </span>
      )}
      {label}
    </button>
  );
};

const buttonStyle = (
  shape: ButtonShapeType,
  selectSizes: ReturnType<typeof css>,
  selectColors: ButtonColors,
  fullWidth: boolean,
  disabled: boolean
) => css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: ${disabled ? 'not-allowed' : 'pointer'};
  border: none;
  outline: none;
  width: ${fullWidth ? '100%' : 'auto'};
  border-radius: ${shape === 'round' ? '50px' : '6px'};

  ${selectSizes}

  background-color: ${disabled
    ? colors.gray03
    : shape === 'text' || shape === 'line'
      ? 'transparent'
      : selectColors.color};
  color: ${disabled
    ? colors.black
    : shape === 'text' || shape === 'line'
      ? selectColors.color
      : colors.white};
  border: ${shape === 'line' ? `1px solid ${selectColors.color}` : 'none'};
  opacity: ${disabled ? 0.7 : 1};

  &:hover {
    ${!disabled &&
    `background-color: ${
      shape === 'text' ? 'transparent' : selectColors.hoverColor
    };
    color: ${shape === 'text' ? selectColors.hoverColor : colors.white};
    ${shape === 'line' && `border-color: ${selectColors.hoverColor}`};`}
  }

  span {
    display: inline-flex;
  }
`;

export default Button;
