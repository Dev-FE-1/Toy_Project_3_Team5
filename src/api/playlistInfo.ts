import {
  collection,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  query,
  QueryDocumentSnapshot,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { COLLECTION, db, storage, STORAGE } from '@/firebase/firbaseConfig';
import { ApiResponse } from '@/types/api';
import { PlayListDataProps } from '@/types/playlistType';

export const getPlaylistInfo = async (
  playlistId: number
): Promise<ApiResponse<PlayListDataProps>> => {
  try {
    const docRef = doc(db, COLLECTION.playlist, `${playlistId}`);
    const docSnap = await getDoc(docRef);
    return { status: 'success', result: docSnap.data() as PlayListDataProps };
  } catch (err) {
    console.error(err);
    return { status: 'fail' };
  }
};

export const addPlaylist = async (
  data: PlayListDataProps
): Promise<ApiResponse<boolean>> => {
  const col = collection(db, COLLECTION.playlist);
  const { docs } = await getDocs(query(col));
  const nextPlaylistId = getNextPlaylistId(docs);

  const addData: PlayListDataProps = { ...data };
  delete addData.thumbnailFile;

  await setDoc(doc(db, COLLECTION.playlist, `${nextPlaylistId}`), addData);

  const docRef = doc(db, COLLECTION.playlist, `${nextPlaylistId}`);

  if (data.thumbnailFile) {
    const url = await uploadThumbnail(
      data.thumbnailFile,
      nextPlaylistId.toString()
    );

    await updateDoc(docRef, { thumbnail: url });
  }

  return { status: 'success', result: true };
};

export const updatePlaylist = async (
  data: PlayListDataProps,
  playlistId: number
): Promise<ApiResponse<boolean>> => {
  const docRef = doc(db, COLLECTION.playlist, `${playlistId}`);
  const docSnap = await getDoc(docRef);

  const addData: PlayListDataProps = { ...data };
  delete addData.thumbnailFile;

  if (!!!docSnap.exists()) return { status: 'fail' };
  if (data.thumbnailFile) {
    const url = await uploadThumbnail(data.thumbnailFile, `${playlistId}`);
    addData.thumbnail = url;
  }
  await updateDoc(docRef, { ...addData });
  return { status: 'success', result: true };
};

export const deletePlaylist = async () => {};

const getNextPlaylistId = (
  docs: QueryDocumentSnapshot<DocumentData, DocumentData>[]
): number => {
  const sortedDocs = docs;
  sortedDocs.sort((a, b) => Number(b.id) - Number(a.id));
  const result = Number(sortedDocs[0].id) ?? 0;
  return result + 1;
};

const uploadThumbnail = async (file: File, docId: string) => {
  const path = `${STORAGE.playlist}/${docId}/thumbnail.png`;
  const locationRef = ref(storage, path);

  const result = await uploadBytes(locationRef, file);
  const url = await getDownloadURL(result.ref);

  return url;
};
