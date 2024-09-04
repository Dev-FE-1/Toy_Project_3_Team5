// src/router.js
import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import ROUTES from '@/constants/route';
import { Detail } from '@/pages/common/Detail';
import Following from '@/pages/common/Following';
import HashTag from '@/pages/common/HashTag';
import Home from '@/pages/common/Home';
import { NotFound } from '@/pages/common/NotFound';
import { Popular } from '@/pages/common/Popular';
import Search from '@/pages/common/Search';
import { SignIn } from '@/pages/common/SignIn';
import { SignUp } from '@/pages/common/SignUp';
import { PlayList } from '@/pages/playlist/PlayList';
import PlayListAdd from '@/pages/playlist/PlayListAdd';
import PlayListEdit from '@/pages/playlist/PlayListEdit';
import { PlayListHome } from '@/pages/playlist/PlayListHome';
import { PlayListLikes } from '@/pages/playlist/PlayListLikes';
import { PlayListSaved } from '@/pages/playlist/PlayListSaved';
import { Profile } from '@/pages/profile/Profile';
import { ProfileFollower } from '@/pages/profile/ProfileFollower';
import { ProfileFollowing } from '@/pages/profile/ProfileFollowing';
import { ProfileHome } from '@/pages/profile/ProfileHome';
import { ProfileUpdate } from '@/pages/profile/ProfileUpdate';
import ProtectedRoute from '@/router/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: ROUTES.ROOT,
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: ROUTES.PLAYLIST(),
        element: (
          <ProtectedRoute>
            <PlayList />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <PlayListHome />,
          },
          {
            path: ROUTES.PLAYLIST_SAVED(),
            element: <PlayListSaved />,
          },
          {
            path: ROUTES.PLAYLIST_LIKES(),
            element: <PlayListLikes />,
          },
        ],
      },
      {
        path: ROUTES.PLAYLIST_ADD(),
        element: (
          <ProtectedRoute>
            <PlayListAdd />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.PLAYLIST_MODIFY(),
        element: (
          <ProtectedRoute>
            <PlayListEdit />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.PROFILE(),
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <ProfileHome />,
          },
          {
            path: ROUTES.PROFILE_MODIFY(),
            element: <ProfileUpdate />,
          },
          {
            path: ROUTES.PROFILE_FOLLOWING(),
            element: <ProfileFollowing />,
          },
        ],
      },
      {
        path: ROUTES.POPULAR,
        element: <Popular />,
      },
      {
        path: ROUTES.FOLLOWING,
        element: (
          <ProtectedRoute>
            <Following />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.SEARCH(),
        element: <Search />,
      },
      {
        path: ROUTES.DETAIL(),
        element: <Detail />,
      },
      {
        path: ROUTES.PROFILE_FOLLOWER(),
        element: <ProfileFollower />,
      },
      {
        path: ROUTES.PROFILE_FOLLOWING(),
        element: <ProfileFollowing />,
      },
    ],
  },
  {
    path: ROUTES.SIGN_IN,
    element: <SignIn />,
  },
  {
    path: ROUTES.SIGN_UP,
    element: <SignUp />,
  },
  {
    path: ROUTES.HASH_TAG,
    element: <HashTag />,
  },
  {
    path: ROUTES.NOT_FOUND,
    element: <NotFound />,
  },
]);
