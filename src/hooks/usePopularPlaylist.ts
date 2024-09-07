import { useInfiniteQuery } from '@tanstack/react-query';
import {
  query,
  where,
  orderBy,
  collection,
  limit,
  getDocs,
  startAfter,
  DocumentData,
  QueryDocumentSnapshot,
} from 'firebase/firestore';
import { getOwnerChannelName } from '@/api/followingPlaylists';
import { getCommentCount } from '@/api/myplaylists';
import { db } from '@/firebase/firbaseConfig';
import { PlayListDataProps } from '@/types/playlistType';

const fetchPlaylistsByTag = async (
  tag: string,
  pageParam: QueryDocumentSnapshot<DocumentData> | null
): Promise<{
  playlistsData: PlayListDataProps[];
  nextCursor: QueryDocumentSnapshot<DocumentData> | null;
}> => {
  let q;

  if (tag === '인기 급상승 동영상') {
    q = query(collection(db, 'playlist'), orderBy('likes', 'desc'), limit(5));
  } else {
    q = query(
      collection(db, 'playlist'),
      where('tags', 'array-contains', `#${tag}`),
      orderBy('likes', 'desc'),
      limit(5)
    );
  }

  if (pageParam) {
    q = query(q, startAfter(pageParam));
  }

  const querySnapshot = await getDocs(q);
  const playlistPromises = querySnapshot.docs.map(async (doc) => {
    const data = doc.data();
    const ownerChannelName = await getOwnerChannelName(data.userId);
    const commentCount = await getCommentCount(doc.id);
    return {
      playlistId: doc.id,
      title: data.title,
      description: data.description,
      isPublic: data.isPublic,
      likes: data.likes,
      links: data.links,
      regDate: data.regDate,
      tags: data.tags,
      thumbnail: data.thumbnail,
      userId: data.userId,
      ownerChannelName,
      commentCount,
    } as PlayListDataProps;
  });

  const playlistsData = await Promise.all(playlistPromises);
  const nextCursor = querySnapshot.docs[querySnapshot.docs.length - 1] || null;
  return { playlistsData, nextCursor };
};

const useTagFetch = (tag: string) =>
  useInfiniteQuery({
    queryKey: ['popularPlaylists', tag],
    queryFn: ({ pageParam = null }) =>
      fetchPlaylistsByTag(
        tag,
        pageParam as QueryDocumentSnapshot<DocumentData> | null
      ),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: null as QueryDocumentSnapshot<DocumentData> | null,
    enabled: !!tag,
  });

export default useTagFetch;
