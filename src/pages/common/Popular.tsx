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
            color={clickedBtn === tags[index] ? 'primary' : 'gray'}
          ></Button>
        ))}
      </div>
      <h1>{clickedBtn}</h1>
      <div css={playlistContainerStyle}>
        {playListCardData.map((playlistCard, index) => (
          <PlaylistCard key={index} playlistItem={playlistCard} size='large' />
        ))}
      </div>
    </div>
  );
};
const contentContainerStyle = css`
  display: flex;
  flex-direction: column;

  h1 {
    min-height: 10vh;
    display: flex;
    align-items: center;
    padding-left: 10px;
    font-size: ${fontSize.xxxl};
  }
`;
const tagContainerStyle = css`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 5px;
  padding-left: 5px;
  padding-right: 5px;
`;
const playlistContainerStyle = css`
  padding-left: 16px;
`;
// const modifiedButtonStyle = css`
//   background-color: ${colors.greenNormal};
// `;
