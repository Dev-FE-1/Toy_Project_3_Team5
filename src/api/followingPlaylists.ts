import {
  collection,
  query,
  where,
  DocumentData,
  getDocs,
  Query,
  limit,
  orderBy,
  doc,
  getDoc,
} from 'firebase/firestore';
import { getCommentCount } from '@/api/myplaylists';
import { db } from '@/firebase/firbaseConfig';
import { PlayListDataProps } from '@/types/playlistType';
const fetchFollowingPlaylists = async (
  userId: string,
  loginUserId: string,
  pageSize: number,
  pageParam: number
): Promise<{
  playlistsData: PlayListDataProps[];
  nextCursor: number | null;
}> => {
  let q;
  if (userId === loginUserId) {
    const userDocRef = doc(db, 'users', userId);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data() as DocumentData;
      const { channelFollowing } = userData;

      if (channelFollowing) {
        q = query(
          collection(db, 'playlist'),
          where('userId', 'in', channelFollowing),
          where('isPublic', '==', true),
          orderBy('regDate', 'desc'),
          limit(5)
        );
      }
    }
  } else {
    q = query(
      collection(db, 'playlist'),
      where('userId', '==', userId),
      orderBy('regDate', 'desc'),
      limit(5)
    );
  }

  if (!q) {
    return { playlistsData: [], nextCursor: null };
  }

  const fetchPlaylists = async (q: Query<DocumentData>) => {
    const querySnapshot = await getDocs(q);

    return await Promise.all(
      querySnapshot.docs.map(async (doc) => ({
        playlistId: doc.id,
        commentCount: await getCommentCount(doc.id),
        ...(doc.data() as Omit<
          PlayListDataProps,
          'playlistId' | 'commentCount'
        >),
      }))
    );
  };

  const allPlaylists = await fetchPlaylists(q);

  const startIndex = pageParam * pageSize;
  const paginatedData = allPlaylists.slice(startIndex, startIndex + pageSize);

  const nextCursor =
    startIndex + pageSize < allPlaylists.length ? pageParam + 1 : null;

  return { playlistsData: paginatedData, nextCursor };
};

export default fetchFollowingPlaylists;
