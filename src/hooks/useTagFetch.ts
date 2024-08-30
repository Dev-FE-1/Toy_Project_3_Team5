import { signInWithEmailAndPassword } from 'firebase/auth';
import {
  query,
  where,
  orderBy,
  collection,
  limit,
  getDocs,
} from 'firebase/firestore';
import { db, auth } from '@/firebase/firbaseConfig';

type CollectionName = 'playlist' | 'users';

export interface FetchInfo {
  collectionName: CollectionName;
  tag?: string;
  limitNumber: number;
}

const useTagFetch = async ({ collectionName, tag, limitNumber }: FetchInfo) => {
  try {
    await signInWithEmailAndPassword(auth, 'ldh921126@gmail.com', '102030');
    console.log('로그인 성공');
    let fetchQuery;
    if (tag) {
      fetchQuery = query(
        collection(db, 'playlist'),
        where('tags', 'array-contains', tag),
        orderBy('likes', 'desc'),
        limit(limitNumber)
      );
    } else {
      fetchQuery = query(
        collection(db, collectionName),
        orderBy('likes', 'desc'),
        limit(limitNumber)
      );
    }

    const querySnapshot = await getDocs(fetchQuery);

    const documents = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log('받아온 데이터', documents);
    return documents;
  } catch (error) {
    console.error('에러', error);
  }
};

export default useTagFetch;
