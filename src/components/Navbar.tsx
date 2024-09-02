import React from 'react';
import { css } from '@emotion/react';
import { Home, Flame, Library, Users } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import IconButton from '@/components/IconButton';
import colors from '@/constants/colors';
import ROUTES from '@/constants/route';

interface NavList {
  label: string;
  icon: React.ComponentType;
  to: string;
}

const navList: NavList[] = [
  { label: '홈', icon: Home, to: ROUTES.ROOT },
  { label: '인기', icon: Flame, to: ROUTES.POPULAR },
  { label: '마이플리', icon: Library, to: ROUTES.PLAYLIST('1') },
  { label: '팔로잉', icon: Users, to: ROUTES.FOLLOWING },
];

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav css={navbarStyle}>
      {navList.map((list, idx) => {
        const isActive =
          list.to === ROUTES.ROOT
            ? location.pathname === list.to
            : location.pathname.startsWith(list.to);

        return (
          <div css={iconWrapperStyle} key={idx}>
            <IconButton
              key={list.label}
              IconComponent={list.icon}
              onClick={() => navigate(list.to)}
              label={list.label}
              color={isActive ? 'primary' : 'gray'}
            />
          </div>
        );
      })}
    </nav>
  );
};

const navbarStyle = css`
  width: 430px;
  height: 60px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  position: fixed;
  bottom: 0;
  padding: 10px 20px;
  background-color: ${colors.white};
  border-top: 1px solid ${colors.gray02};
  z-index: 10;
`;

const iconWrapperStyle = css`
  display: flex;
  justify-content: center;
  width: 60px;
`;

export default Navbar;
