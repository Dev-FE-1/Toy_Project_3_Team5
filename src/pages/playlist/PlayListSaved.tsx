import { css } from '@emotion/react';
import { Plus } from 'lucide-react';
import { Outlet, useNavigate } from 'react-router-dom';
import Button from '@/components/Button';
import PlaylistCard from '@/components/PlaylistCard';
import PopupFilter from '@/components/PopupFilter';
import colors from '@/constants/colors';
import { fontSize } from '@/constants/font';
import ROUTES from '@/constants/route';
import { usePlaylist, PageType } from '@/queries/usePlaylist';

export const PlayListSaved = () => {
  const navigate = useNavigate();
  const {
    playlists,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    num,
    setNum,
    optionGroups,
  } = usePlaylist('savedPlaylist' as PageType);

  const onAddBtnClick = (): void => {
    navigate(ROUTES.PLAYLIST_ADD());
  };

  const onPopularBtnClick = (): void => {
    navigate(ROUTES.POPULAR);
  };

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  return (
    <>
      <section css={homeContainerStyles(playlists.length > 0)}>
        <div className='filter-area'>
          {playlists.length > 0 && (
            <PopupFilter
              optionGroups={optionGroups}
              selectedIndexes={num}
              setSelectedIndexes={setNum}
            />
          )}
          <Button
            label='플레이리스트 추가'
            IconComponent={Plus}
            shape='text'
            onClick={onAddBtnClick}
          />
        </div>
        {playlists.length > 0 && <p>총 {playlists.length}개의 플리</p>}
        {playlists.length === 0 ? (
          <div css={emptyStateStyles}>
            <img src='/src/assets/folderIcon.png' alt='아이콘 이미지' />
            <div className='textContainer'>
              <p>아직 저장한 플리가 없네요.</p>
              <p>인기 플리로 채워볼까요?</p>
            </div>
            <Button label='인기 플리 구경하기' onClick={onPopularBtnClick} />
          </div>
        ) : (
          <ul css={cardContainerStyles}>
            {playlists.map((playlistItem, index) => (
              <li key={index}>
                <PlaylistCard
                  size='small'
                  playlistItem={playlistItem}
                  showAddButton={true}
                />
              </li>
            ))}
          </ul>
        )}
        {isFetchingNextPage && <div>더 불러오는 중...</div>}
        {!hasNextPage && playlists.length > 0 && (
          <div>모든 플레이리스트를 불러왔습니다.</div>
        )}
        <Outlet />
      </section>
    </>
  );
};

const homeContainerStyles = (hasPlaylists: boolean) => css`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px 20px;

  .filter-area {
    display: flex;
    align-items: center;
    justify-content: ${hasPlaylists ? 'space-between' : 'flex-end'};
  }

  p {
    font-size: ${fontSize.sm};
    color: ${colors.gray05};
  }
`;

const cardContainerStyles = css`
  display: flex;
  flex-direction: column;
  gap: 16px;
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
