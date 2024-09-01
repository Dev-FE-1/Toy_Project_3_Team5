import React, { useState } from 'react';
import { css } from '@emotion/react';
import PlaylistCard from '@/components/PlaylistCard';
import TextFilter from '@/components/TextFilter';

const Home: React.FC = () => {
  const [selectedIndex, setselectedIndex] = useState<number>(0);

  const options = ['최신순', '좋아요', '댓글순'];
  const dummyPlaylist = [
    {
      title: '[Playlist] 브리즈번 도시 산책',
      userName: 'LEEPLAY',
      tags: ['#팝송'],
      numberOfComments: 15,
      numberOfLikes: 221,
      publicity: false,
      links: [
        'https://i.ytimg.com/vi/Tz4DKO6BIwY/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLBVTHHAexsNORQm82qsgAKfgKGZhw',
      ],
    },
    {
      title: '[Playlist] 뉴욕 거리를 거닐며 듣던 앤더슨 팩의 음악',
      userName: 'LEEPLAY',
      tags: ['#팝송'],
      numberOfComments: 250,
      numberOfLikes: 1010,
      publicity: false,
      links: [
        'https://i.ytimg.com/vi/uIdJ3BjhkaU/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLDOjIY2I1A4SarbZqTLHlIXzHb5JQ',
      ],
    },
    {
      title: '[Playlist] 당신에게도 인생 공간이 있나요?',
      userName: 'LEEPLAY',
      tags: ['#팝송'],
      numberOfComments: 70,
      numberOfLikes: 751,
      publicity: false,
      links: [
        'https://i.ytimg.com/vi/BW8Fjueha8s/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAXPRcUbkcee6Vlo-u1h45egXLe_Q',
      ],
    },
    {
      title: '[Playlist] 어느 봄날의 망원동 산책',
      userName: 'LEEPLAY',
      tags: ['#팝송'],
      numberOfComments: 12,
      numberOfLikes: 99,
      publicity: false,
      links: [
        'https://i.ytimg.com/vi/wBWzGaxcsgY/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLCzSO3mzmW4WH4_R6Onw_VCLstmeg',
      ],
    },
    {
      title:
        '[Playlist] 여름에 향수 대신 뿌리는 플레이리스트 (Sunni Colón Playlist)',
      userName: 'LEEPLAY',
      tags: ['#팝송'],
      numberOfComments: 32,
      numberOfLikes: 447,
      publicity: false,
      links: [
        'https://i.ytimg.com/vi/QWmC_MDk5Jc/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLBx0CXzx6OA30JR0DZc9bsC90xtGA',
      ],
    },
  ];

  return (
    <div css={containerStyle}>
      <div css={textFilterWrapperStyle}>
        <TextFilter
          options={options}
          selectedIndex={selectedIndex}
          setSelectedIndex={setselectedIndex}
        />
      </div>
      <div css={playlistWrapperStyle}>
        {dummyPlaylist.map((list, idx) => (
          <PlaylistCard key={idx} playlistItem={list} size='large' />
        ))}
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

export default Home;
