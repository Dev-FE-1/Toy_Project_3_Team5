import { useState, useEffect } from 'react';
import { collection, query, where, doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/firebase/firbaseConfig';
import { useAuthStore } from '@/stores/useAuthStore';

interface Channel {
  id: string;
  profileImg: string;
  channelName: string;
  uid?: string;
}

type ListType = 'following' | 'follower';

const useChannel = (channelId: string, listType: ListType) => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const { userId } = useAuthStore();

  useEffect(() => {
    const userDocRef = doc(db, 'users', channelId);

    const unsubscribe = onSnapshot(userDocRef, (doc) => {
      if (doc.exists()) {
        const userData = doc.data() as {
          channelFollowing: string[];
          channelFollower: string[];
        };

        const listToFetch =
          listType === 'following'
            ? userData.channelFollowing
            : userData.channelFollower;

        if (listToFetch && listToFetch.length > 0) {
          const usersQuery = query(
            collection(db, 'users'),
            where('uid', 'in', listToFetch)
          );

          const unsubscribeUsers = onSnapshot(usersQuery, (querySnapshot) => {
            const fetchedChannels = querySnapshot.docs.map((doc) => ({
              id: doc.id,
              profileImg: doc.data().profileImg || '',
              channelName: doc.data().channelName || '',
              uid: doc.data().uid || '',
            }));

            setChannels(fetchedChannels);
          });

          return () => unsubscribeUsers();
        } else {
          setChannels([]);
        }
      } else {
        console.log('No such user document!');
        setChannels([]);
      }
    });

    return () => unsubscribe();
  }, [channelId, listType, userId]);
  return channels;
};

export default useChannel;
