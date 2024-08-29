import { useState } from 'react';
import { css } from '@emotion/react';
import { Plus } from 'lucide-react';
import { Outlet, useNavigate } from 'react-router-dom';
import Button from '@/components/Button';
import PlaylistCard from '@/components/PlaylistCard';
import PopupFilter from '@/components/PopupFilter';
import colors from '@/constants/colors';
import { fontSize } from '@/constants/font';
import ROUTES from '@/constants/route';
import { usePlaylist } from '@/hooks/usePlaylist';

export const PlayListHome = () => {
  const navigate = useNavigate();
  const [num, setNum] = useState<number[]>([0, 0]);
  const playlist = usePlaylist();

  const optionGroups = [
    { label: '정렬', options: ['최신순', '좋아요순', '댓글순'] },
    { label: '공개여부', options: ['전체', '공개', '비공개'] },
  ];

  const onAddBtnClick = (): void => {
    navigate(ROUTES.PLAYLIST_ADD());
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
            label='플레이리스트 추가'
            IconComponent={Plus}
            shape='text'
            onClick={onAddBtnClick}
          />
        </div>
        <p>총 12개의 플리</p>
        <ul css={cardContainerStyles}>
          {playlist.map((playlistItem, index) => (
            <li key={index}>
              <PlaylistCard
                size='small'
                playlistItem={playlistItem}
                showLockButton={true}
                showKebabMenu={true}
              />
            </li>
          ))}
        </ul>
        <Outlet />
      </section>
    </>
  );
};

const homeContainerStyles = css`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px 20px;

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
  gap: 16px;
`;
