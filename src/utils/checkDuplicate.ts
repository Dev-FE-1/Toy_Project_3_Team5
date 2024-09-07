import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from 'firebase/firestore';
import { db } from '@/firebase/firbaseConfig';

export const checkChannelNameExists = async (
  channelName: string
): Promise<boolean> => {
  const q = query(
    collection(db, 'users'),
    where('channelName', '==', channelName)
  );
  try {
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    throw new Error('채널 이름 중복 체크에 실패했습니다.');
  }
};

export const checkIdExists = async (id: string): Promise<boolean> => {
  try {
    const docRef = doc(db, 'users', id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists();
  } catch (error) {
    throw new Error('아이디 중복 체크에 실패했습니다.');
  }
};
