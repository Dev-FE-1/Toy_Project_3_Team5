import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { COLLECTION, db } from '@/firebase/firbaseConfig';
import { ApiResponse } from '@/types/api';
import { CommentProps } from '@/types/playlistType';

interface PlaylistComment extends CommentProps {
  profileImg?: string;
  channelName?: string;
}

export const getPlaylistComment = async (
  playlistId: number
): Promise<ApiResponse<PlaylistComment[]>> => {
  try {
    const result = await getDocs(
      query(
        collection(db, COLLECTION.comments),
        where('playlistId', '==', playlistId),
        orderBy('regDate', 'desc')
      )
    );

    const commentList: PlaylistComment[] = result.docs.map(
      (doc) => ({ ...doc.data() }) as CommentProps
    );
    return { status: 'success', result: commentList };
  } catch (err) {
    console.error(err);
    return { status: 'fail' };
  }
};

export const addComment = async (
  commentData: CommentProps
): Promise<ApiResponse<boolean>> => {
  try {
    const col = collection(db, COLLECTION.comments);
    await addDoc(col, commentData);
    return { status: 'success' };
  } catch (err) {
    console.error(err);
    return { status: 'fail' };
  }
};

export const modifyComment = async (
  commentData: CommentProps
): Promise<ApiResponse<boolean>> => {
  try {
    const docRef = doc(db, COLLECTION.comments, `${commentData.docId}`);
    const docSnap = await getDoc(docRef);

    if (!!!docSnap.exists()) return { status: 'fail' };

    await updateDoc(docRef, { ...commentData } as Omit<CommentProps, 'docId'>);

    return { status: 'success' };
  } catch (err) {
    console.error(err);
    return { status: 'fail' };
  }
};

export const removeComment = async (
  commentData: CommentProps
): Promise<ApiResponse<boolean>> => {
  try {
    const docRef = doc(db, COLLECTION.comments, `${commentData.docId}`);
    const docSnap = await getDoc(docRef);

    if (!!!docSnap.exists()) return { status: 'fail' };

    await updateDoc(docRef, { ...commentData } as Omit<CommentProps, 'docId'>);

    return { status: 'success' };
  } catch (err) {
    console.error(err);
    return { status: 'fail' };
  }
};
