import { useState, useMemo } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { QueryDocumentSnapshot } from 'firebase/firestore';
import {
  getUserPlayList,
  getLikedPlaylist,
  getSavedPlaylist,
} from '@/api/playlist/getPlayList';
import { PlayListDataProps } from '@/types/playlistType';

export type PageType = 'userPlaylist' | 'likedPlaylist' | 'savedPlaylist';

interface OptionGroupProps {
  label: string;
  options: string[];
}

interface PaginatedResult {
  playlists: PlayListDataProps[];
  lastVisible: QueryDocumentSnapshot | null;
  hasMore: boolean;
}

const getInitialOptionGroups = (pageType: PageType): OptionGroupProps[] => {
  switch (pageType) {
    case 'userPlaylist':
      return [
        { label: '정렬', options: ['최신순', '좋아요순', '댓글순'] },
        { label: '공개여부', options: ['전체', '공개', '비공개'] },
      ];
    case 'likedPlaylist':
      return [{ label: '정렬', options: ['최신순', '좋아요순', '댓글순'] }];
    case 'savedPlaylist':
      return [{ label: '정렬', options: ['최신순', '좋아요순', '댓글순'] }];
    default:
      return [];
  }
};

const getApiFunction = (pageType: PageType) => {
  switch (pageType) {
    case 'userPlaylist':
      return getUserPlayList;
    case 'likedPlaylist':
      return getLikedPlaylist;
    case 'savedPlaylist':
      return getSavedPlaylist;
    default:
      throw new Error(`지원하지 않는 페이지 타입입니다: ${pageType}`);
  }
};

export const usePlaylist = (pageType: PageType) => {
  const [num, setNum] = useState<number[]>([0, 0]);
  const [optionGroups, setOptionGroups] = useState<OptionGroupProps[]>(
    getInitialOptionGroups(pageType)
  );

  const apiFunction = getApiFunction(pageType);

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<PaginatedResult, Error>({
    queryKey: ['playlists', pageType],
    queryFn: ({ pageParam }) =>
      apiFunction(pageParam as QueryDocumentSnapshot | undefined),
    getNextPageParam: (lastPage) => lastPage.lastVisible,
    initialPageParam: null as QueryDocumentSnapshot | null,
  });

  const allPlaylists = useMemo(
    () => data?.pages.flatMap((page) => page.playlists) || [],
    [data]
  );

  const filteredPlaylists = useMemo(() => {
    if (!allPlaylists.length) return [];

    let filtered = [...allPlaylists];

    optionGroups.forEach((group, groupIndex) => {
      const selectedOptionIndex = num[groupIndex] || 0;
      const selectedOption = group.options[selectedOptionIndex];

      switch (group.label) {
        case '정렬':
          if (selectedOption === '최신순') {
            filtered.sort(
              (a, b) =>
                new Date(b.regDate).getTime() - new Date(a.regDate).getTime()
            );
          } else if (selectedOption === '좋아요순') {
            filtered.sort((a, b) => b.likes - a.likes);
          } else if (selectedOption === '댓글순') {
            filtered.sort((a, b) => b.commentCount - a.commentCount);
          }
          break;
        case '공개여부':
          if (selectedOption === '공개') {
            filtered = filtered.filter((playlist) => playlist.isPublic);
          } else if (selectedOption === '비공개') {
            filtered = filtered.filter((playlist) => !playlist.isPublic);
          }
          break;
      }
    });

    return filtered;
  }, [allPlaylists, optionGroups, num]);

  return {
    playlists: filteredPlaylists,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    num,
    setNum,
    optionGroups,
    setOptionGroups,
  };
};
