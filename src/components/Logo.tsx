import React from 'react';
import { css } from '@emotion/react';
import logo from '@/assets/logo.svg';

interface LogoProps {
  logoWidth: number;
  clickable?: boolean;
}

const Logo: React.FC<LogoProps> = ({ logoWidth, clickable = false }) => {
  const onLogoClick = () => {};

  return (
    <img
      css={LogoStyle(logoWidth, clickable)}
      src={logo}
      alt='위플리 로고'
      onClick={clickable ? onLogoClick : undefined}
    />
  );
};

const LogoStyle = (logoWidth: number, clickable: boolean) => css`
  width: ${logoWidth}px;
  ${clickable && `cursor: pointer;`}
`;

export default Logo;
