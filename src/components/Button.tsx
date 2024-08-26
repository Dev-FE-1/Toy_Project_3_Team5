import React from 'react';
import { css } from '@emotion/react';
import { Plus, LogOut } from 'lucide-react';
import googleIcon from '@/assets/google_icon.svg';

type ButtonColorType = 'primary' | 'gray' | 'red' | 'black';
type ButtonShapeType = 'block' | 'line' | 'round' | 'text';
type ButtonSizeType = 'lg' | 'md' | 'sm';
type ButtonIconType = 'plus' | 'logout' | 'google' | undefined;

interface ButtonProps {
  label: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  color?: ButtonColorType;
  shape?: ButtonShapeType;
  size?: ButtonSizeType;
  icon?: ButtonIconType;
}

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  color = 'primary',
  shape = 'block',
  size = 'md',
  icon = undefined,
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
    <button css={buttonStyle(color, shape, size)} onClick={onClick}>
      {icon && <span style={{ marginRight: '8px' }}>{renderIcon()}</span>}
      {label}
    </button>
  );
};

const buttonStyle = (
  color: ButtonColorType,
  shape: ButtonShapeType,
  size: ButtonSizeType
) => css``;

export default Button;
