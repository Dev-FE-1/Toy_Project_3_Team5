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
  startAfter,
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
  let q: Query<DocumentData>;
  const playlistCollection = collection(db, 'playlist');

  if (userId === loginUserId) {
    const userDocRef = doc(db, 'users', userId);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data() as DocumentData;
      const { channelFollowing } = userData;

      if (channelFollowing && channelFollowing.length > 0) {
        q = query(
          playlistCollection,
          where('userId', 'in', channelFollowing),
          where('isPublic', '==', true),
          orderBy('regDate', 'desc'),
          limit(pageSize)
        );
      } else {
        return { playlistsData: [], nextCursor: null };
      }
    } else {
      return { playlistsData: [], nextCursor: null };
    }
  } else {
    q = query(
      playlistCollection,
      where('userId', '==', userId),
      where('isPublic', '==', true),
      orderBy('regDate', 'desc'),
      limit(pageSize)
    );
  }

  if (pageParam > 0) {
    const previousQuery = query(q, limit(pageParam * pageSize));
    const previousSnapshot = await getDocs(previousQuery);
    const lastDoc = previousSnapshot.docs[previousSnapshot.docs.length - 1];

    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }
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
  const nextCursor = allPlaylists.length < pageSize ? null : pageParam + 1;

  return { playlistsData: allPlaylists, nextCursor };
};

export default fetchFollowingPlaylists;
