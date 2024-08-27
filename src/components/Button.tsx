import React from 'react';
import { css } from '@emotion/react';
import { Plus, LogOut } from 'lucide-react';
import googleIcon from '@/assets/google_icon.svg';
import colors from '@/constants/colors';

type ButtonShapeType = 'block' | 'line' | 'round' | 'text';
type ButtonSizeType = 'sm' | 'md' | 'lg';
type ButtonColorType = 'primary' | 'gray' | 'red' | 'black';
type ButtonIconType = 'plus' | 'logout' | 'google' | undefined;

interface ButtonProps {
  label: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  shape?: ButtonShapeType;
  size?: ButtonSizeType;
  color?: ButtonColorType;
  icon?: ButtonIconType;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  shape = 'block',
  size = 'md',
  color = 'primary',
  icon = undefined,
  fullWidth = false,
}) => {
  const renderIcon = () => {
    switch (icon) {
      case 'plus':
        return <Plus size={16} />;
      case 'logout':
        return <LogOut size={16} />;
      case 'google':
        return <img src={googleIcon} width={16} height={16} />;
      default:
        return null;
    }
  };

  return (
    <button css={buttonStyle(shape, size, color, fullWidth)} onClick={onClick}>
      {icon && <span style={{ marginRight: '6px' }}>{renderIcon()}</span>}
      {label}
    </button>
  );
};

const buttonStyle = (
  shape: ButtonShapeType,
  size: ButtonSizeType,
  color: ButtonColorType,
  fullWidth: boolean
) => css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: none;
  outline: none;
  width: ${fullWidth ? '100%' : 'auto'};

  span {
    display: inline-flex;
  }

  ${(shape === 'block' || shape === 'line') &&
  css`
    border-radius: 6px;
  `}

  ${shape === 'round' &&
  css`
    border-radius: 50px;
  `}

    ${size === 'sm' &&
  css`
    padding: 4px 12px;
  `}

    ${size === 'md' &&
  css`
    padding: 8px 12px;
  `}

  ${size === 'lg' &&
  css`
    padding: 14px 12px;
  `}

  ${color === 'primary' &&
  css`
    background-color: ${shape === 'text' || shape === 'line'
      ? 'transparent'
      : colors.primaryNormal};
    color: ${shape === 'text' || shape === 'line'
      ? colors.primaryNormal
      : colors.white};
    border: ${shape === 'line' ? `1px solid ${colors.primaryNormal}` : 'none'};
    &:hover {
      background-color: ${shape === 'text'
        ? 'transparent'
        : colors.primaryDark};
      color: ${shape === 'text' ? colors.primaryDark : colors.white};
      ${shape === 'line' && `border-color: ${colors.primaryDark}`};
    }
  `}

  ${color === 'gray' &&
  css`
    background-color: ${shape === 'text' || shape === 'line'
      ? 'transparent'
      : colors.gray05};
    color: ${shape === 'text' || shape === 'line'
      ? colors.gray05
      : colors.white};
    border: ${shape === 'line' ? `1px solid ${colors.gray05}` : 'none'};
    &:hover {
      background-color: ${shape === 'text' ? 'transparent' : colors.gray06};
      color: ${shape === 'text' ? colors.gray06 : colors.white};
      ${shape === 'line' && `border-color: ${colors.gray06}`};
    }
  `}

  ${color === 'red' &&
  css`
    background-color: ${shape === 'text' || shape === 'line'
      ? 'transparent'
      : colors.redNormal};
    color: ${shape === 'text' || shape === 'line'
      ? colors.redNormal
      : colors.white};
    border: ${shape === 'line' ? `1px solid ${colors.redNormal}` : 'none'};
    &:hover {
      background-color: ${shape === 'text' ? 'transparent' : colors.redDark};
      color: ${shape === 'text' ? colors.redDark : colors.white};
      ${shape === 'line' && `border-color: ${colors.redDark}`};
    }
  `}

  ${color === 'black' &&
  css`
    background-color: ${shape === 'text' || shape === 'line'
      ? 'transparent'
      : colors.black};
    color: ${shape === 'text' || shape === 'line'
      ? colors.black
      : colors.white};
    border: ${shape === 'line' ? `1px solid ${colors.black}` : 'none'};
    &:hover {
      background-color: ${shape === 'text' ? 'transparent' : colors.gray04};
      color: ${shape === 'text' ? colors.gray04 : colors.white};
      ${shape === 'line' && `border-color: ${colors.gray04}`};
    }
  `}
`;

export default Button;
