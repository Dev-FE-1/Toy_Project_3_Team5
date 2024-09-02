import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/firbaseConfig';

const getOwnerChannelName = async (userId: string): Promise<string> => {
  const userDoc = await getDoc(doc(db, 'users', userId));
  const userData = userDoc.data();
  return userData?.channelName || '알 수 없는 채널';
};

export default getOwnerChannelName;
