import React, { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import { User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { ChevronLeft, Pointer, SearchIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import defaultProfile from '@/assets/profile_default.png';
import IconButton from '@/components/IconButton';
import Logo from '@/components/Logo';
import Profile from '@/components/Profile';
import colors from '@/constants/colors';
import { fontSize, fontWeight } from '@/constants/font';
import ROUTES from '@/constants/route';
import { onUserStateChanged, db } from '@/firebase/firbaseConfig';

type HeaderType = 'main' | 'searchResult' | 'detail';

interface HeaderProps {
  type: HeaderType;
  headerTitle?: string;
}

const Header: React.FC<HeaderProps> = ({ type, headerTitle }) => {
  const [searchText, setSearchText] = useState<string>('');
  const [user, setUser] = useState<User | null>(null);
  const [profileImage, setProfileImage] = useState<string>(defaultProfile);

  useEffect(() => {
    const unsubscribe = onUserStateChanged(async (user: User | null) => {
      setUser(user);
      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const docSnapshot = await getDoc(userDocRef);
          if (docSnapshot.exists()) {
            const data = docSnapshot.data();
            if (data && data.profileImg) {
              setProfileImage(data.profileImg);
            }
          }
        } catch (error) {
          console.error('Error fetching user data: ', error);
        }
      } else {
        setProfileImage(defaultProfile);
      }
    });
  }, []);

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
            <Profile src={profileImage} alt='프로필 이미지' size='xs' />
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
