import { addDoc, collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import { COLLECTION, db } from '@/firebase/firbaseConfig';
import { ApiResponse } from '@/types/api';
import { CommentProps } from '@/types/playlistType';

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
