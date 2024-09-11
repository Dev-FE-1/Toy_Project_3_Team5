import React from 'react';
import { css } from '@emotion/react';
import { NavLink, useParams } from 'react-router-dom';
import colors from '@/constants/colors';
import { fontWeight } from '@/constants/font';

interface TabButtonProps {
  tabNames: string[];
  tabLinks: ((userId?: string) => string)[];
}

const TabButton: React.FC<TabButtonProps> = ({ tabNames, tabLinks }) => {
  const { userId } = useParams<{ userId: string }>();

  return (
    <div css={tabContainerStyle}>
      {tabNames.map((name, index) => (
        <NavLink
          key={name}
          to={tabLinks[index](userId)}
          css={tabLinkStyle}
          className={({ isActive }) => (isActive ? 'active' : '')}
          end={index === 0}
        >
          {name}
        </NavLink>
      ))}
    </div>
  );
};

const tabContainerStyle = css`
  display: flex;
  background-color: ${colors.white};
  border-bottom: 1px solid ${colors.gray02};
`;

const tabLinkStyle = css`
  position: relative;
  padding: 12px 16px;
  text-decoration: none;
  color: ${colors.gray04};
  font-weight: ${fontWeight.semiBold};

  &:hover {
    color: ${colors.black};
  }

  &.active {
    color: ${colors.black};

    &::after {
      content: '';
      position: absolute;
      bottom: -1px;
      left: 0;
      width: 100%;
      height: 2px;
      background-color: ${colors.primaryNormal};
    }
  }
`;

export default TabButton;
