import { PlayListDataProps } from '@/types/playlistType';

// 공개여부 필터링
export const filterPlaylistByVisibility = (
  playlist: PlayListDataProps[],
  visibilityOption: number
): PlayListDataProps[] => {
  if (visibilityOption === 0) return playlist;
  return playlist.filter((item) =>
    visibilityOption === 1 ? item.isPublic : !item.isPublic
  );
};

// 정렬 필터링 (좋아요순, 댓글순, 최신순)
export const sortPlaylistsByOption = (
  playlist: PlayListDataProps[],
  sortOption: number
): PlayListDataProps[] =>
  [...playlist].sort((a, b) => {
    switch (sortOption) {
      case 1:
        return b.likes - a.likes;
      case 2:
        return (b.commentCount ?? 0) - (a.commentCount ?? 0);
      default:
        return new Date(b.regDate).getTime() - new Date(a.regDate).getTime();
    }
  });
