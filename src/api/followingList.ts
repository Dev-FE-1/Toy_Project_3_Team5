// src/api/followingList.ts
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase/firbaseConfig';

const updateUserFollowingList = async (userId: string, uid: string) => {
  const userDocRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userDocRef);

  if (userDoc.exists()) {
    const { channelFollowing } = userDoc.data() as {
      channelFollowing: string[];
    };

    const updatedChannelFollowing = channelFollowing.filter(
      (followingUid: string) => followingUid !== uid
    );

    await updateDoc(userDocRef, {
      channelFollowing: updatedChannelFollowing,
    });
  }
};

export default updateUserFollowingList;
