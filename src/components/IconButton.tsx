import React from 'react';
import { css } from '@emotion/react';
import colors from '@/constants/colors';
import { fontSize } from '@/constants/font';

type IconButtonSizeType = 'sm' | 'md';
type IconButtonColorType = 'primary' | 'gray' | 'red' | 'black';

interface IconProps {
  size?: string | number;
  fill?: string;
}

interface IconButtonProps {
  IconComponent: React.ComponentType<IconProps>;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  label?: string;
  size?: IconButtonSizeType;
  color?: IconButtonColorType;
  fillColor?: IconButtonColorType;
}

type IconButtonColors = {
  color: string;
};

const iconButtonColors: Record<IconButtonColorType, IconButtonColors> = {
  primary: { color: colors.primaryNormal },
  gray: { color: colors.gray05 },
  red: { color: colors.redNormal },
  black: { color: colors.black },
};

const IconButton: React.FC<IconButtonProps> = ({
  IconComponent,
  onClick,
  label = '',
  size = 'md',
  color = 'primary',
  fillColor,
}) => {
  const selectColors = iconButtonColors[color].color;
  const selectFillColor = fillColor
    ? iconButtonColors[fillColor].color
    : 'none';

  return (
    <button css={iconButtonStyle(size, selectColors)} onClick={onClick}>
      <IconComponent size={size === 'md' ? 24 : 12} fill={selectFillColor} />
      {label}
    </button>
  );
};

const iconButtonStyle = (size: IconButtonSizeType, selectColors: string) => css`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  border: none;
  background-color: transparent;
  gap: 2px;
  outline: none;
  font-size: ${size === 'md' ? fontSize.xs : fontSize.xxs};
  color: ${selectColors};

  &:hover {
    cursor: pointer;
  }
`;

export default IconButton;
