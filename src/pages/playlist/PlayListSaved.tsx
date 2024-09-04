import { useMemo, useState } from 'react';
import { css } from '@emotion/react';
import { Plus } from 'lucide-react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useFetchSavedPlaylist } from '@/api/playlists';
import Button from '@/components/Button';
import LoadingSpinner from '@/components/LoadingSpinner';
import PlaylistCard from '@/components/PlaylistCard';
import PopupFilter from '@/components/PopupFilter';
import colors from '@/constants/colors';
import { fontSize } from '@/constants/font';
import ROUTES from '@/constants/route';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';

const PAGE_SIZE = 5;

export const PlayListSaved = () => {
  const navigate = useNavigate();
  const [num, setNum] = useState<number[]>([0, 0]);

  const optionGroups = [
    { label: '정렬', options: ['최신순', '좋아요순', '댓글순'] },
  ];

  const { data, fetchNextPage, hasNextPage, isFetching } =
    useFetchSavedPlaylist(PAGE_SIZE);

  const playlist = useMemo(
    () => (data ? data.pages.flatMap((page) => page.playlist) : []),
    [data]
  );

  const infiniteScrollRef = useInfiniteScroll(
    async (entry, observer) => {
      observer.unobserve(entry.target);
      if (hasNextPage && !isFetching) {
        fetchNextPage();
      }
    },
    {
      root: document.querySelector('.scroll-container'),
      rootMargin: '0px 0px -20px 0px',
      threshold: 0.5,
    }
  );

  const onAddBtnClick = (): void => {
    navigate(ROUTES.PLAYLIST_ADD());
  };

  const onPopularBtnClick = (): void => {
    navigate(ROUTES.POPULAR);
  };

  return (
    <>
      <section css={homeContainerStyles}>
        <div className='filter-area'>
          <PopupFilter
            optionGroups={optionGroups}
            selectedIndexes={num}
            setSelectedIndexes={setNum}
          />
          <Button
            label='플레이리스트 생성'
            IconComponent={Plus}
            shape='text'
            onClick={onAddBtnClick}
          />
        </div>
        {playlist.length > 0 && <p>총 {playlist.length}개의 플리</p>}
        {isFetching === false && playlist.length === 0 ? (
          <div css={emptyStateStyles}>
            <img src='/src/assets/folderIcon.png' alt='아이콘 이미지' />
            <div className='textContainer'>
              <p>아직 저장한 플리가 없네요.</p>
              <p>인기 플리로 채워볼까요?</p>
            </div>
            <Button label='인기 플리 구경하기' onClick={onPopularBtnClick} />
          </div>
        ) : (
          <ul className='scroll-container' css={cardContainerStyles}>
            {playlist.map((playlistItem, index) => (
              <li className='list' key={index}>
                <PlaylistCard
                  size='small'
                  playlistItem={playlistItem}
                  showAddButton={true}
                />
              </li>
            ))}
            {isFetching && playlist.length >= PAGE_SIZE && <LoadingSpinner />}
            <div
              ref={infiniteScrollRef}
              style={{
                minHeight: '72px',
                width: '100%',
              }}
            ></div>
          </ul>
        )}
        <Outlet />
      </section>
    </>
  );
};

const profileHeight = '140px';
const tabHeight = '41px';

const homeContainerStyles = css`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px 20px;
  height: calc(100% - ${profileHeight} - ${tabHeight});

  .filter-area {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  p {
    font-size: ${fontSize.sm};
    color: ${colors.gray05};
  }
`;

const cardContainerStyles = css`
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
  padding-bottom: 40px;
  align-items: center;
  -ms-overflow-style: none;
  scrollbar-width: none;

  .list {
    width: 100%;
  }
`;

const emptyStateStyles = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding-top: 80px;

  p {
    font-size: ${fontSize.md};
    line-height: 2.2rem;
  }

  .textContainer {
    text-align: center;
  }

  img {
    width: 50%;
  }
`;
