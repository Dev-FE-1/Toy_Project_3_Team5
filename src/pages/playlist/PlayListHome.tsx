import { useEffect, useMemo, useState } from 'react';
import { css } from '@emotion/react';
import { Plus } from 'lucide-react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { useChennelData } from '@/api/chennelInfo';
import { useFetchUserPlaylist } from '@/api/myplaylists';
import Button from '@/components/Button';
import LoadingSpinner from '@/components/LoadingSpinner';
import PlaylistCard from '@/components/PlaylistCard';
import PopupFilter from '@/components/PopupFilter';
import colors from '@/constants/colors';
import { fontSize } from '@/constants/font';
import ROUTES from '@/constants/route';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
import { PlayListDataProps } from '@/types/playlistType';
import {
  filterPlaylistByVisibility,
  sortPlaylistsByOption,
} from '@/utils/filterUtils';

const PAGE_SIZE = 5;

export const PlayListHome = () => {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const { chennelData } = useChennelData(userId);

  const [filterOptions, setFilterOptions] = useState<number[]>([0, 0]);
  const [localPlaylists, setLocalPlaylists] = useState<PlayListDataProps[]>([]);

  const optionGroups = [
    { label: '정렬', options: ['최신순', '좋아요순', '댓글순'] },
    { label: '공개여부', options: ['전체', '공개', '비공개'] },
  ];

  const { data, fetchNextPage, hasNextPage, isFetching } =
    useFetchUserPlaylist(PAGE_SIZE);

  useEffect(() => {
    if (data) {
      setLocalPlaylists(data.pages.flatMap((page) => page.playlist));
    }
  }, [data]);

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

  const filteredPlaylist = useMemo(() => {
    const filteredPlaylist = filterPlaylistByVisibility(
      localPlaylists,
      filterOptions[1]
    );
    return sortPlaylistsByOption(filteredPlaylist, filterOptions[0]);
  }, [localPlaylists, filterOptions]);

  const onPlaylistDelete = (deletedPlaylistId: number) => {
    setLocalPlaylists((prevPlaylists) =>
      prevPlaylists.filter(
        (playlist) => Number(playlist.playlistId) !== deletedPlaylistId
      )
    );
  };

  const onAddBtnClick = (): void => {
    navigate(ROUTES.PLAYLIST_ADD(userId));
  };

  return (
    <section css={homeContainerStyles}>
      <div className='filter-area'>
        <PopupFilter
          optionGroups={optionGroups}
          selectedIndexes={filterOptions}
          setSelectedIndexes={setFilterOptions}
        />
        {chennelData?.isMyChannel && (
          <Button
            label='플레이리스트 생성'
            IconComponent={Plus}
            shape='text'
            onClick={onAddBtnClick}
          />
        )}
      </div>
      {filteredPlaylist.length > 0 && (
        <p>총 {filteredPlaylist.length}개의 플리</p>
      )}
      {isFetching === false && filteredPlaylist.length === 0 ? (
        <div css={emptyStateStyles}>
          <img src='/src/assets/folderIcon.png' alt='아이콘 이미지' />
          <div className='textContainer'>
            <p>아직 플리가 없네요.</p>
            <p>나만의 플리로 채워볼까요?</p>
          </div>
        </div>
      ) : (
        <ul className='scroll-container' css={cardContainerStyles}>
          {filteredPlaylist.map((playlistItem) => (
            <li className='list' key={playlistItem.playlistId}>
              <PlaylistCard
                size='small'
                playlistItem={playlistItem}
                showLockButton={chennelData?.isMyChannel ? true : false}
                showKebabMenu={chennelData?.isMyChannel ? true : false}
                onDelete={onPlaylistDelete}
              />
            </li>
          ))}
          {isFetching && filteredPlaylist.length >= PAGE_SIZE && (
            <LoadingSpinner />
          )}
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
  );
};

const profileHeight = '140px';
const tabHeight = '41px';

const homeContainerStyles = css`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px 20px 0 20px;
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
