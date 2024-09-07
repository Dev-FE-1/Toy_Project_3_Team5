import ROUTES from '@/constants/route';
import { HeaderProps } from '@/types/header';

const HEADER_FILTER = {
  main: [],
  detail: [
    { url: ROUTES.PROFILE_MODIFY(), title: '프로필 수정' },
    { url: ROUTES.PROFILE_FOLLOWER(), title: '모든 팔로워 목록' },
    { url: ROUTES.PROFILE_FOLLOWING(), title: '모든 팔로잉 목록' },
    { url: ROUTES.PLAYLIST_ADD(), title: '플레이리스트 생성' },
    { url: ROUTES.PLAYLIST_MODIFY(), title: '플레이리스트 수정' },
    { url: ROUTES.FOLLOWING_LIST(), title: '모든 팔로잉 목록' },
  ],
  searchResult: [ROUTES.SEARCH()],
};

export const checkHeaderType = (path: string): HeaderProps => {
  for (const route of HEADER_FILTER.searchResult) {
    if (path.includes(route.split('/')[1])) return { type: 'searchResult' };
  }

  for (const route of HEADER_FILTER.detail) {
    const r = route.url.split('/');
    const p = path.split('/');
    if (
      r.length === p.length &&
      path.includes(r[1]) &&
      path.includes(r[r.length - 1])
    ) {
      return { type: 'detail', headerTitle: route.title };
    }
  }

  return { type: 'main' };
};
