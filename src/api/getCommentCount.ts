import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/firebase/firbaseConfig';

const getCommentCount = async (playlistId: string): Promise<number> => {
  const commentsRef = collection(db, 'comments');
  const q = query(commentsRef, where('playlistId', '==', playlistId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.size;
};

export default getCommentCount;
