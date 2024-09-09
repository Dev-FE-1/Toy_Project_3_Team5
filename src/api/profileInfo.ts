import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc,
} from 'firebase/firestore';

import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/firebase/firbaseConfig';
import { ApiResponse, UserProps } from '@/types/api';

interface ProfileUpdateData {
  profileImageFile?: File;
}

export const getUserInfo = async (
  userId: string
): Promise<ApiResponse<UserProps>> => {
  try {
    const userDocRef = doc(db, 'users', userId);
    const docSnap = await getDoc(userDocRef);

    if (!!!docSnap) throw new Error('사용자 정보 불러오기 실패');

    return { status: 'success', result: docSnap.data() as UserProps };
  } catch (err) {
    console.error(err);
    return { status: 'fail' };
  }
};

const getUserComments = async (userId: string) => {
  try {
    const comments = collection(db, 'comments');
    const q = query(comments, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    const userComments = querySnapshot.docs.map((doc) => ({
      commentsId: doc.id,
      content: doc.data().content,
      playlistId: doc.data().playlistId,
    }));
    return userComments;
  } catch (error) {
    console.error('comments 가져오기 에러', error);
    return [];
  }
};

const getPlaylistTitle = async (playlistId: number) => {
  try {
    const playlistIdDoc = doc(db, 'playlist', playlistId.toString());
    const playlistIdDocSnap = await getDoc(playlistIdDoc);
    const playlistData = playlistIdDocSnap.data();
    return playlistData?.title;
  } catch (error) {
    console.error('title 가져오기 에러', error);
  }
};

const getMyPlaylistCount = async (userId: string) => {
  try {
    const playlists = collection(db, 'playlist');
    const q = query(playlists, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.size;
  } catch (error) {
    console.error('내가 만든 플레이리스트 수 가져오기 에러', error);
  }
};

const getMyHashtag = async (userId: string) => {
  const userDoc = doc(db, 'users', userId);
  const userSnapshot = await getDoc(userDoc);
  if (userSnapshot.exists()) {
    const userData = userSnapshot.data();
    const hashtags = userData.tags;
    return hashtags;
  }
};

const updateProfileTags = async (userId: string, tags: string[]) => {
  const userDoc = doc(db, 'users', userId);
  await updateDoc(userDoc, {
    tags,
  });
};

const uploadImage = async (file: File, userId: string) => {
  const path = `profile/${userId}/profile.png`;
  const locationRef = ref(storage, path);
  const result = await uploadBytes(locationRef, file);
  const url = await getDownloadURL(result.ref);
  return url;
};

const updateProfileImage = async (userId: string, data: ProfileUpdateData) => {
  const docRef = doc(db, 'users', userId);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) {
    return { status: 'fail', result: false };
  }
  const updatedData: { profileImg?: string } = {};
  if (data.profileImageFile) {
    const imageUrl = await uploadImage(data.profileImageFile, userId);
    updatedData.profileImg = imageUrl;
  }
  await updateDoc(docRef, updatedData);
};

export {
  getUserComments,
  getPlaylistTitle,
  getMyPlaylistCount,
  updateProfileImage,
  getMyHashtag,
  updateProfileTags,
};
