import React from 'react';
import { css } from '@emotion/react';
import logo from '@/assets/logo.svg';

interface LogoProps {
  clickable?: boolean;
}

const Logo: React.FC<LogoProps> = () => {
  const onLogoClick = () => {};

  return (
    <img css={LogoStyle} src={logo} alt='위플리 로고' onClick={onLogoClick} />
  );
};

const LogoStyle = css``;

export default Logo;
