import {
  collection,
  query,
  where,
  DocumentData,
  getDocs,
  startAfter,
  QueryDocumentSnapshot,
  limit,
  orderBy,
  doc,
  getDoc,
} from 'firebase/firestore';
import { db } from '@/firebase/firbaseConfig';
import { PlayListDataProps } from '@/types/playlistType';

export interface PlaylistsResultProps {
  playlist: PlayListDataProps[];
  nextCursor: QueryDocumentSnapshot<DocumentData> | null;
}

export const fetchFollowingPlaylists = async (
  userId: string,
  loginUserId: string,
  pageParam: QueryDocumentSnapshot<DocumentData> | null
): Promise<PlaylistsResultProps> => {
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
          orderBy('regDate', 'desc'),
          limit(5),
          ...(pageParam ? [startAfter(pageParam)] : [])
        );
      }
    }
  } else {
    q = query(
      collection(db, 'playlist'),
      where('userId', '==', userId),
      orderBy('regDate', 'desc'),
      limit(5),
      ...(pageParam ? [startAfter(pageParam)] : [])
    );
  }

  if (!q) {
    return { playlist: [], nextCursor: null };
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
export const getOwnerChannelName = async (userId: string): Promise<string> => {
  try {
    const userDocRef = doc(db, 'users', userId);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      return userData?.channelName || '알 수 없는 채널';
    } else {
      return '알 수 없는 채널';
    }
  } catch (error) {
    console.error('채널 이름을 가져오는 동안 오류 발생:', error);
    return '알 수 없는 채널';
  }
};
