import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from 'firebase/firestore';
import { db } from '@/firebase/firbaseConfig';

const getUserComments = async (userId: string) => {
  try {
    const comments = collection(db, 'comments');
    const q = query(comments, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    const userComments = querySnapshot.docs.map((doc) => ({
      content: doc.data().content,
      playlistId: doc.data().playlistId,
    }));
    return userComments;
  } catch (error) {
    console.error('comments 가져오기 에러', error);
    return [];
  }
};

const getPlaylistTitle = async (playlistId: number): Promise<string> => {
  try {
    const playlistIdDoc = doc(db, 'playlist', playlistId.toString());
    const playlistIdDocSnap = await getDoc(playlistIdDoc);

    if (playlistIdDocSnap.exists()) {
      const playlistData = playlistIdDocSnap.data();
      return playlistData.title;
    }
  } catch (error) {
    console.error('title 가져오기 에러', error);
  }
};

const getMyPlaylistCount = async (userId: string): Promise<number> => {
  try {
    const playlists = collection(db, 'playlist');
    const q = query(playlists, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    console.log(querySnapshot);
    return querySnapshot.size;
  } catch (error) {
    console.error('내가 만든 플레이리스트 수 가져오기 에러', error);
  }
};

export { getUserComments, getPlaylistTitle, getMyPlaylistCount };
