import { PlayListDataProps } from '@/hooks/usePlaylist';

interface ProfileProps {
  src: string;
  alt: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export interface TestProfileProps extends ProfileProps {
  name: string;
}

export interface TestDataProps {
  following: TestProfileProps[];
  playlist: PlayListDataProps[];
}

export const TEST_DATA: TestDataProps = {
  following: [
    {
      alt: '썸네일',
      src: '/src/assets/defaultThumbnail.jpg',
      size: 'md',
      name: '사용자1',
    },
    {
      alt: '썸네일',
      src: '/src/assets/defaultThumbnail2.jpg',
      size: 'md',
      name: '사용자2',
    },
    {
      alt: '썸네일',
      src: '/src/assets/defaultThumbnail.jpg',
      size: 'md',
      name: '사용자3',
    },
    {
      alt: '썸네일',
      src: '/src/assets/defaultThumbnail2.jpg',
      size: 'md',
      name: '사용자4',
    },
    {
      alt: '썸네일',
      src: '/src/assets/defaultThumbnail2.jpg',
      size: 'md',
      name: '사용자4',
    },
    {
      alt: '썸네일',
      src: '/src/assets/defaultThumbnail2.jpg',
      size: 'md',
      name: '사용자4',
    },
    {
      alt: '썸네일',
      src: '/src/assets/defaultThumbnail2.jpg',
      size: 'md',
      name: '사용자4',
    },
  ],
  playlist: [
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
  ],
};
