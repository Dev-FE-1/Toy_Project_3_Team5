import React from 'react';
import { Outlet } from 'react-router-dom';
import { TempFooter } from '@/components/TempFooter';

export const Layout = () => (
  <div>
    <div>Layout</div>
    <header>uselocation을 이용한 변경되는 Header</header>
    <main>
      <Outlet />
    </main>
    <TempFooter />
  </div>
);
