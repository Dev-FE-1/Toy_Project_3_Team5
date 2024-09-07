import React, { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import { ChevronLeft, SearchIcon } from 'lucide-react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import defaultProfile from '@/assets/profile_default.png';
import IconButton from '@/components/IconButton';
import Logo from '@/components/Logo';
import Profile from '@/components/Profile';
import colors from '@/constants/colors';
import { fontSize, fontWeight } from '@/constants/font';
import ROUTES from '@/constants/route';
import { useAuthStore } from '@/stores/useAuthStore';
import useModalStore from '@/stores/useModalStore';
import { HeaderProps } from '@/types/header';

const Header: React.FC<HeaderProps> = ({ type, headerTitle }) => {
  const [searchText, setSearchText] = useState<string>('');
  const { userId, user, profileImage } = useAuthStore();
  const { keyword } = useParams<{ keyword?: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { openModal, closeModal } = useModalStore();

  useEffect(() => {
    if (location.pathname.startsWith('/search/') && keyword) {
      setSearchText(decodeURIComponent(keyword));
    }
  }, [location.pathname, keyword]);

  const onProfileClick = () => {
    if (user) {
      navigate(ROUTES.PROFILE(userId));
    } else {
      navigate(ROUTES.SIGN_IN);
    }
  };

  const onSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (searchText.trim()) {
      const encodedKeyword = encodeURIComponent(searchText.trim());
      navigate(ROUTES.SEARCH(encodedKeyword));
    }
  };

  const onModifyBackButton = () => {
    if (headerTitle === '프로필 수정') {
      openModal({
        type: 'confirm',
        title: '알림',
        content: '프로필 변경사항을 적용하지 않으시겠습니까?',
        onAction: () => {
          closeModal();
          navigate(-1);
        },
      });
    } else {
      navigate(-1);
    }
  };

  return (
    <header css={headerStyle}>
      {type === 'main' ? (
        <Logo logoWidth={100} clickable={true} />
      ) : (
        <IconButton IconComponent={ChevronLeft} onClick={onModifyBackButton} />
      )}
      {type !== 'detail' ? (
        <>
          <form css={searchBarStyle} onSubmit={onSearchSubmit}>
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
              onClick={() => onSearchSubmit}
              size='sm'
            />
          </form>
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
