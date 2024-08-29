// import React, { useState, useEffect } from 'react';
// import { css } from '@emotion/react';
// import { Users, House, Library, Flame } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import colors from '@/constants/colors';
// import { fontSize } from '@/constants/font';
// import ROUTES from '@/constants/route';

// export const NavBar = () => {
//   const navigate = useNavigate();
//   const [activeTab, setActiveTab] = useState(ROUTES.ROOT);
//   const userId = 'yourUserId'; //유저 아이디
//   useEffect(() => {
//     setActiveTab(window.location.pathname);
//   }, [window.location.pathname]);

//   const navItems = [
//     { icon: House, path: ROUTES.ROOT, label: '홈' },
//     { icon: Flame, path: ROUTES.POPULAR, label: '인기' },
//     { icon: Users, path: ROUTES.PROFILE, label: '프로필' },
//     { icon: Library, path: ROUTES.FOLLOWING, label: '팔로잉' },
//   ];

//   const handleNavigation = (path) => {
//     navigate(path);
//     setActiveTab(path);
//   };

//   return (
//     <nav css={styles.navbar}>
//       {navItems.map((item) => (
//         <button
//           key={item.path}
//           onClick={() => handleNavigation(item.path)}
//           css={[
//             styles.navItem,
//             activeTab === item.path && styles.activeNavItem,
//           ]}
//         >
//           <item.icon size={24} />
//           <span>{item.label}</span>
//         </button>
//       ))}
//     </nav>
//   );
// };

// const styles = {
//   navbar: css`
//     display: flex;
//     justify-content: space-around;
//     align-items: center;
//     position: fixed;
//     bottom: 0;
//     left: 0;
//     right: 0;
//     background-color: ${colors.white};
//     padding: 10px 0;
//     border-top: 1px solid ${colors.gray01};
//   `,
//   navItem: css`
//     display: flex;
//     flex-direction: column;
//     align-items: center;
//     color: ${colors.gray01};
//     background: none;
//     border: none;
//     cursor: pointer;
//     font-size: ${fontSize.sm};
//     transition: color 0.3s ease;

//     &:hover {
//       color: ${colors.primaryDark};
//     }
//   `,
//   activeNavItem: css`
//     color: ${colors.primaryDark};
//   `,
// };
