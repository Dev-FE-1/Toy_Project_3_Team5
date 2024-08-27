import { Search } from 'lucide-react';
import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '@/component/Layout';
import { Detail } from '@/pages/common/Detail';
import { Following } from '@/pages/common/Following';
import { HashTag } from '@/pages/common/HashTag';
import { Home } from '@/pages/common/Home';
import { NotFound } from '@/pages/common/NotFound';
import { Popular } from '@/pages/common/Popular';
import { SignIn } from '@/pages/common/SignIn';
import { SignUp } from '@/pages/common/SignUp';
import { PlayList } from '@/pages/playlist/PlayList';
import { PlayListAdd } from '@/pages/playlist/PlayListAdd';
import { PlayListHome } from '@/pages/playlist/PlayListHome';
import { PlayListLikes } from '@/pages/playlist/PlayListLikes';
import { PlayListSaved } from '@/pages/playlist/PlayListSaved';
import { PlayListUpdate } from '@/pages/playlist/PlayListUpdate';
import { Profile } from '@/pages/profile/Profile';
import { ProfileFollower } from '@/pages/profile/ProfileFollower';
import { ProfileFollowing } from '@/pages/profile/ProfileFollowing';
import { ProfileHome } from '@/pages/profile/ProfileHome';
import { ProfileUpdate } from '@/pages/profile/ProfileUpdate';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'playlist/:userId',
        element: <PlayList />,
        children: [
          {
            index: true,
            element: (
              <PlayListHome />
            ) /*	본인계정일때만, 좋아요 플리 기능과 crud 가능 하도록 ui 조정 + url조작으로 다른 사람의 플리 조작 못하게 막기 ex) 본인 id=10, url playlist/11/modify 접근 불가능하도록 	*/,
          },
          {
            path: 'saved',
            element: <PlayListSaved /> /*	전체 접근가능 	*/,
          },
          {
            path: 'likes',
            element: <PlayListLikes /> /*	본인계정만, 비공개	*/,
          },
          {
            path: 'add',
            element: <PlayListAdd /> /*	본인계정만 	*/,
          },
          {
            path: 'modify',
            element: <PlayListUpdate /> /*	본인계정만 	*/,
          },
        ],
      },
      {
        path: 'profile/:userId',
        element: <Profile />,
        children: [
          {
            index: true,
            element: <ProfileHome />,
          },
          {
            path: 'modify',
            element: <ProfileUpdate />,
          },
        ],
      },
      {
        path: '/popular',
        element: <Popular />,
      },
      {
        path: '/following',
        element: <Following />,
      },
      {
        path: '/search/:searchText',
        element: <Search />,
      },
      {
        path: '/detail/:playListId',
        element: <Detail />,
      },
      {
        path: 'follower/:id',
        element: <ProfileFollower />,
      },
      {
        path: 'following/:id',
        element: (
          <ProfileFollowing />
        ) /*	following 페이지와 profile/following/:id 페이지의 다른점은? -> 그냥 following/:id로 통일?	*/,
      },
    ],
  },

  {
    path: '/signIn',
    element: <SignIn />,
  },
  {
    path: '/signUp',
    element: <SignUp />,
  },
  {
    path: '/hashTag',
    element: <HashTag />,
  },

  {
    path: '*',
    element: <NotFound />,
  },
]);
