import { useState, useEffect } from 'react';
import { css } from '@emotion/react';
import Button from '@/components/Button';
import PlaylistCard from '@/components/PlaylistCard';
import { fontSize } from '@/constants/font';
import { PlayListDataProps } from '@/hooks/usePlaylist';
import { playlistsDummyData } from '@/mock/popularPlaylist-test';

export const Popular = () => {
  const tagMapper: { [key: string]: string } = {
    '인기 급상승 동영상': 'hot',
    Developer: 'develop',
    먹방: 'mukbang',
    Vlog: 'vlog',
  };
  const tags: string[] = ['인기 급상승 동영상', 'Developer', '먹방', 'Vlog']; //fetch 해올꺼 시작할때 useEffect
  const [clickedBtn, setClickedBtn] = useState(tags[0]);

  const onButtonClick = (tag: string) => () => {
    setClickedBtn(tag);
  };

  const selectedKey = tagMapper[clickedBtn];
  const playListCardData: PlayListDataProps[] = playlistsDummyData[selectedKey];
  return (
    <div css={contentContainerStyle}>
      <div css={tagContainerStyle}>
        {tags.map((tag, index) => (
          <Button
            key={tags[index]}
            label={`#${tags[index]}`}
            onClick={onButtonClick(tags[index])}
            size='lg'
            color={clickedBtn === tags[index] ? 'primary' : 'lightGray'}
          ></Button>
        ))}
      </div>
      <div css={titleContainerStyle}>{clickedBtn}</div>
      <div css={playlistContainerStyle}>
        {playListCardData.map((playlistCard, index) => (
          <PlaylistCard key={index} playlistItem={playlistCard} size='large' />
        ))}
      </div>
    </div>
  );
};
const contentContainerStyle = css`
  box-sizing: border-box;
  height: calc(100vh - 64px - 64px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const tagContainerStyle = css`
  height: 10vh;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  padding-left: 15px;
  padding-right: 15px;
`;

const titleContainerStyle = css`
  height: 20vh;
  display: flex;
  align-items: center;
  padding-top: 10px;
  padding-left: 15px;
  font-size: ${fontSize.xxxl};
`;

const playlistContainerStyle = css`
  flex-grow: 1;
  padding: 10px;
  overflow-y: auto;
  overflow-x: hidden;
  gap: 20px;
`;
