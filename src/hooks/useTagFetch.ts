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
    //로그인 로직 완성되면 없애기
    const loginInfo = await signInWithEmailAndPassword(
      auth,
      'ldh921126@gmail.com',
      '102030'
    );
    console.log('로그인정보', loginInfo);
    console.log('로그인uid', loginInfo.user.uid); //유저정보 콘솔로그
    //여기까지 없애기

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
    setData(documents);
  }, [collectionName, tag, limitNumber]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  return { data };
};

export default useTagFetch;
