import React, { useState } from 'react';
import { css } from '@emotion/react';
import { useFetchHomePlaylists } from '@/api/homePlaylists';
import folderIcon from '@/assets/folderIcon.png';
import LoadingSpinner from '@/components/LoadingSpinner';
import PlaylistCard from '@/components/PlaylistCard';
import TextFilter from '@/components/TextFilter';
import { fontSize } from '@/constants/font';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';

const PAGE_SIZE = 5;
const SORT_OPTIONS = ['최신순', '좋아요순', '댓글순'];

const Home: React.FC = () => {
  const [selectedIndex, setselectedIndex] = useState<number>(0);
  const selectedOption = SORT_OPTIONS[selectedIndex];

  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } =
    useFetchHomePlaylists(selectedOption, PAGE_SIZE);

  const playlists = data?.pages.flatMap((page) => page.playlistsData) || [];

  const infiniteScrollRef = useInfiniteScroll(
    async (entry, observer) => {
      observer.unobserve(entry.target);
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    {
      root: null,
      rootMargin: '0px 0px -20px 0px',
      threshold: 0.5,
    }
  );

  return (
    <div css={containerStyle}>
      <div css={textFilterWrapperStyle}>
        <TextFilter
          options={SORT_OPTIONS}
          selectedIndex={selectedIndex}
          setSelectedIndex={setselectedIndex}
        />
      </div>
      <div css={playlistWrapperStyle}>
        {playlists.length === 0 && !isFetching ? (
          <div css={emptyWrapperStyle}>
            <img src={folderIcon} alt='폴더 아이콘' />
            <div>
              <p>정렬 조건에 해당하는 플리가 없습니다.</p>
            </div>
          </div>
        ) : (
          playlists.map((playlistItem) => (
            <PlaylistCard
              key={playlistItem.playlistId}
              size='large'
              playlistItem={playlistItem}
            />
          ))
        )}
        <div css={loadingWrapperStyle}>
          {isFetching && playlists.length >= PAGE_SIZE && <LoadingSpinner />}
        </div>
        <div
          ref={infiniteScrollRef}
          style={{ minHeight: '72px', width: '100%' }}
        />
      </div>
    </div>
  );
};

const containerStyle = css`
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 20px;
`;

const textFilterWrapperStyle = css`
  display: flex;
  flex-direction: row-reverse;
`;

const playlistWrapperStyle = css`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const emptyWrapperStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding-top: 80px;

  p {
    font-size: ${fontSize.md};
    line-height: 2.2rem;
  }

  div {
    text-align: center;
  }

  img {
    width: 50%;
  }
`;

const loadingWrapperStyle = css`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

export default Home;
