import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { db } from '@/firebase/firbaseConfig';

export const getSearchPlaylist = async (keyword: string) => {
  try {
    const playlistCollection = collection(db, 'playlist');
    const q = query(
      playlistCollection,
      where('isPublic', '==', true),
      where('title', '>=', keyword),
      where('title', '<=', keyword + '\uf8ff'),
      orderBy('regDate', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const playlistsData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return playlistsData;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
