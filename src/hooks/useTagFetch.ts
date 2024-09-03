import { useState, useEffect, useCallback } from 'react';
import {
  query,
  where,
  orderBy,
  collection,
  limit,
  getDocs,
} from 'firebase/firestore';
import { db } from '@/firebase/firbaseConfig';
import { PlayListDataProps } from '@/types/playlistType';

type CollectionName = 'playlist' | 'users' | 'comment';
export interface FetchInfo {
  collectionName: CollectionName;
  tag?: string;
  limitNumber?: number;
}

const useTagFetch = ({
  collectionName,
  tag,
  limitNumber = 10,
}: FetchInfo): PlayListDataProps[] => {
  const [data, setData] = useState<PlayListDataProps[]>([]);

  const fetchData = useCallback(async () => {
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
    const documents = querySnapshot.docs.map((doc) => {
      const data = doc.data() as PlayListDataProps;
      return {
        ...data,
        playlistId: doc.id,
      };
    });
    setData(documents);
  }, [collectionName, tag, limitNumber]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  return data;
};

export default useTagFetch;
