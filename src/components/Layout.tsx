import { css } from '@emotion/react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import Navbar from '@/components/Navbar';
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
      <Navbar />
    </div>
  );
};

const headerHeight = '60px';

const pageContainerStyles = css`
  position: relative;
  width: 100%;
  max-width: 430px;
  height: 100%;
  border-left: 2px solid ${colors.gray01};
  border-right: 2px solid ${colors.gray01};
  margin: 0 auto;

  main {
    padding-top: ${headerHeight};
  }
`;
