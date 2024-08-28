import { Outlet } from 'react-router-dom';

export const Profile = () => (
  <>
    <div>Profile Header</div>
    <Outlet />
    <div>Profile Footer</div>
  </>
);
