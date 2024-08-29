import { css } from '@emotion/react';
import { Outlet } from 'react-router-dom';
import Header from '@/components/Header';
import { TempFooter } from '@/components/TempFooter';
import colors from '@/constants/colors';

export const Layout = () => (
  <div css={pageContainerStyles}>
    <Header type='main' />
    <main>
      <Outlet />
    </main>
    <TempFooter />
  </div>
);

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
