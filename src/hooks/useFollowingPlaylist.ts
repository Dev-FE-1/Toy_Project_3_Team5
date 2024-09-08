import { useInfiniteQuery } from '@tanstack/react-query';
import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import fetchFollowingPlaylists from '@/api/followingPlaylists';
import { useAuthStore } from '@/stores/useAuthStore';

const useFollowingPlaylistFetch = (userId: string) => {
  const loginUserId = useAuthStore().userId;

  return useInfiniteQuery({
    queryKey: ['followingPlaylists', userId],
    queryFn: ({ pageParam = 0 }) =>
      fetchFollowingPlaylists(userId, loginUserId, 5, pageParam),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: 0,
    enabled: !!userId,
  });
};

export default useFollowingPlaylistFetch;
