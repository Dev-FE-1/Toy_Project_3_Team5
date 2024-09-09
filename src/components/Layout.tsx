import { css } from '@emotion/react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import Navbar from '@/components/Navbar';
import Toast from '@/components/Toast';
import colors from '@/constants/colors';
import { checkHeaderType } from '@/utils/headerUtils';

export const Layout = () => {
  const { pathname } = useLocation();
  const headerType = checkHeaderType(pathname);

  return (
    <div css={pageContainerStyles}>
      <Header type={headerType.type} headerTitle={headerType?.headerTitle} />
      <main>
        <Outlet />
      </main>
      <Toast />
      <Navbar />
    </div>
  );
};

const headerNavbarHeight = '60px';

const pageContainerStyles = css`
  position: relative;
  width: 100%;
  max-width: 430px;
  height: 100%;
  margin: 0 auto;

  main {
    padding-top: ${headerNavbarHeight};
    height: calc(100% - ${headerNavbarHeight});
  }

  &::before {
    left: 50%;
    transform: translateX(-215px);
  }

  &::after {
    right: 50%;
    transform: translateX(215px);
  }

  &::before,
  &::after {
    width: 1px;
    position: fixed;
    top: 0px;
    bottom: 0px;
    background-color: ${colors.gray02};
    content: '';
    z-index: 11;
  }
`;
