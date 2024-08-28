import React from 'react';

import { Link } from 'react-router-dom';

export const TempFooter = () => (
  <nav>
    <ul>
      <li>
        <Link to='/'>홈</Link>
      </li>
      <li>
        <Link to='popular'>인기</Link>
      </li>
      <li>
        <Link to='playlist/1'>내플리</Link>
      </li>
      <li>
        <Link to='following/1'>팔로잉</Link>
      </li>
    </ul>
  </nav>
);
