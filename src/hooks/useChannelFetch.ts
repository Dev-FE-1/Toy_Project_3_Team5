import { useState, useEffect, useCallback } from 'react';
import {
  collection,
  doc,
  getDoc,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { db } from '@/firebase/firbaseConfig';

interface FollowingChannel {
  id: string;
  profileImg: string;
  channelName: string;
}

const useChannelFetch = (userId: string) => {
  const [channels, setChannels] = useState<FollowingChannel[]>([]);

  const fetchChannels = useCallback(async () => {
    // 특정 사용자 문서 가져오기
    const userDocRef = doc(db, 'users', userId);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const { channelFollowing } = userDocSnap.data() as {
        channelFollowing: string[];
      };
      console.log('channelFollowing', channelFollowing);

      if (channelFollowing && channelFollowing.length > 0) {
        // users 컬렉션에서 uid가 channelFollowing 배열에 있는 경우를 찾는 쿼리
        const usersQuery = query(
          collection(db, 'users'),
          where('uid', 'in', channelFollowing)
        );
        const querySnapshot = await getDocs(usersQuery);
        const fetchedChannels = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          profileImg: doc.data().profileImg || '',
          channelName: doc.data().channelName || '',
        }));
        console.log('fetchedChannels', fetchedChannels);
        setChannels(fetchedChannels);
      }
    } else {
      console.log('No such user document!');
      return [];
    }
  }, []);

  useEffect(() => {
    if (userId) {
      fetchChannels();
    }
  }, [userId, fetchChannels]);

  return { channels };
};

export default useChannelFetch;
