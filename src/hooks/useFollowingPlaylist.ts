import { useInfiniteQuery } from '@tanstack/react-query';
import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import {
  fetchFollowingPlaylists,
  PlaylistsResultProps,
} from '@/api/followingPlaylists';

import { useAuthStore } from '@/stores/useAuthStore';

const useFollowingPlaylistFetch = (userId: string) => {
  const loginUserId = useAuthStore().userId;

  return useInfiniteQuery({
    queryKey: ['followingPlaylists', userId],
    queryFn: ({ pageParam = null }) =>
      fetchFollowingPlaylists(userId, loginUserId, pageParam),
    getNextPageParam: (lastPage: PlaylistsResultProps) => lastPage.nextCursor,
    initialPageParam: null as QueryDocumentSnapshot<DocumentData> | null,
    enabled: !!userId,
  });
};

export default useFollowingPlaylistFetch;
