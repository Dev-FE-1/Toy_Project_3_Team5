import { useEffect, useState } from 'react';

export interface PlayListDataProps {
  title: string;
  userName: string;
  tags: string[];
  numberOfComments: number;
  numberOfLikes: number;
  publicity: boolean;
  links: string[];
}

//전체 플레이리스트
const TestPlayListData: PlayListDataProps[] = [
  {
    title: '한 여름 코딩하며 듣는 로파이 😊',
    userName: 'user1',
    tags: ['#발라드', '#힙합'],
    numberOfComments: 20,
    numberOfLikes: 100,
    publicity: false,
    links: [
      '/src/assets/defaultThumbnail.jpg',
      '/src/assets/defaultThumbnail2.jpg',
      '/src/assets/defaultThumbnail.jpg',
    ],
  },
  {
    title: '프라하 여행가고 싶어지는 영상🍊',
    userName: 'user2',
    tags: ['#여행', '#프라하', '#귤'],
    publicity: true,
    numberOfComments: 2000,
    numberOfLikes: 1000,
    links: [
      '/src/assets/defaultThumbnail2.jpg',
      '/src/assets/defaultThumbnail.jpg',
    ],
  },
];

export const usePlaylist = () => {
  const [playList, setPlayList] = useState<PlayListDataProps[]>([]);

  useEffect(() => {
    setPlayList(TestPlayListData);
  }, []);

  return playList;
};
