import React from 'react';
import { css } from '@emotion/react';

type ProfileProps = {
  src: string;
  alt: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
};

const sizes = {
  xs: 32,
  sm: 36,
  md: 48,
  lg: 100,
  xl: 120,
};

const Profile: React.FC<ProfileProps> = ({ src, alt, size = 'lg' }) => (
  <div
    css={css`
      width: ${sizes[size]}px;
      height: ${sizes[size]}px;
      border-radius: 50%;
      overflow: hidden;
      display: inline-block;
    `}
  >
    <img
      src={!!!src ? '/src/assets/profile_default.png' : src}
      alt={alt}
      css={css`
        width: 100%;
        height: 100%;
        object-fit: cover;
      `}
    />
  </div>
);

export default Profile;
