import React, { useState } from 'react';
import { css } from '@emotion/react';
import { ChevronLeft, SearchIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import defaultProfile from '@/assets/profile_default.png';
import IconButton from '@/components/IconButton';
import Logo from '@/components/Logo';
import Profile from '@/components/Profile';
import colors from '@/constants/colors';
import { fontSize, fontWeight } from '@/constants/font';
import ROUTES from '@/constants/route';
import { useAuthStore } from '@/stores/useAuthStore';
import { HeaderProps } from '@/types/header';

const Header: React.FC<HeaderProps> = ({ type, headerTitle }) => {
  const [searchText, setSearchText] = useState<string>('');
  const { user, profileImage } = useAuthStore();
  const navigate = useNavigate();

  const onProfileClick = () => {
    if (user) {
      navigate(ROUTES.PROFILE(user.uid));
    } else {
      navigate(ROUTES.SIGN_IN);
    }
  };

  return (
    <header css={headerStyle}>
      {type === 'main' ? (
        <Logo logoWidth={100} clickable={true} />
      ) : (
        <IconButton IconComponent={ChevronLeft} onClick={() => navigate(-1)} />
      )}
      {type !== 'detail' ? (
        <>
          <div css={searchBarStyle}>
            <input
              css={searchInputStyle}
              type='text'
              value={searchText}
              placeholder='검색'
              onChange={(e) => {
                setSearchText(e.target.value);
              }}
            />
            <IconButton
              IconComponent={SearchIcon}
              onClick={() => navigate(ROUTES.SEARCH('검색어'))}
              size='sm'
            />
          </div>
          <div onClick={onProfileClick} css={profileStyle}>
            <Profile
              src={profileImage || defaultProfile}
              alt='프로필 이미지'
              size='xs'
            />
          </div>
        </>
      ) : (
        <span css={headerTitleStyle}>{headerTitle}</span>
      )}
    </header>
  );
};

const headerStyle = css`
  width: 430px;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 20px;
  background-color: ${colors.white};
  gap: 10px;
  position: fixed;
  z-index: 10;
`;

const searchBarStyle = css`
  width: 100%;
  display: flex;
  align-items: center;
  background-color: ${colors.gray01};
  border-radius: 6px;
  padding: 2px 10px;

  button {
    padding: 0px;
  }
`;

const searchInputStyle = css`
  flex: 1;
  border: none;
  background: none;
  font-size: ${fontSize.sm};
  padding: 5px;
  outline: none;

  &::placeholder {
    color: ${colors.gray03};
  }
`;

const profileStyle = css`
  cursor: pointer;
`;

const headerTitleStyle = css`
  position: absolute;
  font-size: ${fontSize.lg};
  font-weight: ${fontWeight.semiBold};
  left: 50%;
  transform: translateX(-50%);
`;

export default Header;
