import { useState, useEffect } from 'react';
import { collection, query, where, doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/firebase/firbaseConfig';

interface FollowingChannel {
  id: string;
  profileImg: string;
  channelName: string;
  uid?: string;
}

const useChannel = (channelId: string) => {
  const [channels, setChannels] = useState<FollowingChannel[]>([]);

  useEffect(() => {
    const userDocRef = doc(db, 'users', channelId);

    const unsubscribe = onSnapshot(userDocRef, (doc) => {
      if (doc.exists()) {
        const { channelFollowing } = doc.data() as {
          channelFollowing: string[];
        };

        if (channelFollowing && channelFollowing.length > 0) {
          const usersQuery = query(
            collection(db, 'users'),
            where('uid', 'in', channelFollowing)
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
        }
      } else {
        console.log('No such user document!');
        setChannels([]);
      }
    });

    return () => unsubscribe();
  }, [channelId]);

  return channels;
};

export default useChannel;
