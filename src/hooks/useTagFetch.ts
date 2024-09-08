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
import {
  PlaylistsResultProps,
  getOwnerChannelName,
} from '@/api/followingPlaylists';
import { db } from '@/firebase/firbaseConfig';

const fetchPlaylistsByTag = async (
  tag: string,
  pageParam: QueryDocumentSnapshot<DocumentData> | null
): Promise<PlaylistsResultProps> => {
  let q;

  if (tag === '인기 급상승 동영상') {
    q = query(collection(db, 'playlist'), orderBy('likes', 'desc'), limit(5));
  } else {
    q = query(
      collection(db, 'playlist'),
      where('tags', 'array-contains', `#${tag}`),
      where('isPublic', '==', true),
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
    return {
      playlistId: doc.id,
      ownerChannelName,
      title: data.title,
      isPublic: data.isPublic,
      likes: data.likes,
      links: data.links,
      regDate: data.regDate,
      tags: data.tags,
      thumbnail: data.thumbnail,
      userId: data.userId,
    };
  });

  const playlist = await Promise.all(playlistPromises);
  const nextCursor = querySnapshot.docs[querySnapshot.docs.length - 1] || null;

  return { playlist, nextCursor };
};

const useTagFetch = (tag: string) =>
  useInfiniteQuery({
    queryKey: ['playlists', tag],
    queryFn: ({ pageParam = null }) => fetchPlaylistsByTag(tag, pageParam),
    getNextPageParam: (lastPage: PlaylistsResultProps) => lastPage.nextCursor,
    initialPageParam: null as QueryDocumentSnapshot<DocumentData> | null,
    enabled: !!tag,
  });

export default useTagFetch;
