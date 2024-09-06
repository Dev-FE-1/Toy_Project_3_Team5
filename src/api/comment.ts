import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { COLLECTION, db } from '@/firebase/firbaseConfig';
import { ApiResponse, UserProps } from '@/types/api';
import { CommentProps } from '@/types/playlistType';

export interface CommentWithProfileApiProps extends CommentProps {
  docId: string;
  imgUrl: string;
  userName: string;
}

export const getPlaylistComment = async (
  playlistId: number
): Promise<ApiResponse<CommentWithProfileApiProps[]>> => {
  try {
    const result = await getDocs(
      query(
        collection(db, COLLECTION.comments),
        where('playlistId', '==', playlistId),
        orderBy('regDate', 'desc')
      )
    );

    const commentList: CommentWithProfileApiProps[] = result.docs.map(
      (doc) => ({ ...doc.data(), docId: doc.id }) as CommentWithProfileApiProps
    );

    const commentWithProfileList: CommentWithProfileApiProps[] = [
      ...commentList,
    ];

    commentWithProfileList.map(async (comment, index) => {
      const docRef = doc(db, COLLECTION.users, `${comment.userId}`);
      const docSnap = await getDoc(docRef);
      if (!!!docSnap.exists()) {
        return { status: 'fail' };
      }

      const data = docSnap.data() as UserProps;

      commentWithProfileList[index] = {
        ...comment,
        imgUrl: data.profileImg,
        userName: data.channelName,
      };
    });

    return { status: 'success', result: commentWithProfileList };
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
  commentId: string
): Promise<ApiResponse<boolean>> => {
  try {
    const docRef = doc(db, COLLECTION.comments, `${commentId}`);
    await deleteDoc(docRef);
    return { status: 'success', result: true };
  } catch (err) {
    console.error(err);
    return { status: 'fail' };
  }
};
