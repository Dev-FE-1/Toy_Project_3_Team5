import { useState, useEffect, useCallback } from 'react';
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

type CollectionName = 'playlist' | 'users' | 'comment';

export interface FetchInfo {
  collectionName: CollectionName;
  tag?: string;
  limitNumber?: number;
}

const useTagFetch = ({ collectionName, tag, limitNumber = 10 }: FetchInfo) => {
  const [data, setData] = useState<any[]>([]);

  const fetchData = useCallback(async () => {
    await signInWithEmailAndPassword(auth, 'ldh921126@gmail.com', '102030');
    console.log('로그인 성공');

    let fetchQuery;
    if (tag && tag !== '인기 급상승 동영상') {
      fetchQuery = query(
        collection(db, collectionName),
        where('tags', 'array-contains', `#${tag}`),
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
    console.log(documents);
    setData(documents);
  }, [collectionName, tag, limitNumber]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, refetch: fetchData };
};

export default useTagFetch;
