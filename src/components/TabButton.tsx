import { css } from '@emotion/react';
import { Tab } from '@headlessui/react';
import PlaylistCard from '@/components/PlaylistCard';
import colors from '@/constants/colors';
import { fontSize } from '@/constants/font';
import { PlayListDataProps } from '@/hooks/usePlaylist';

interface TabBtnProps {
  isOwner: boolean;
  profileId: string | number;
}

const TabButton = ({ isOwner, profileId }: TabBtnProps) => {
  let tabs: string[];
  let componentList: React.ElementType[];

  const SmallPlaylistCard = (props: any) => (
    <PlaylistCard {...props} size='small' />
  ); //임시로 any

  //id를 받아와서 dbfetch 후, playListDataProps형태로 props입력 따로 뻴 예정
  let fetchedPlayListData: PlayListDataProps[];

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
  ]; //테스트용 데이터입니다.

  if (isOwner) {
    tabs = ['마이플리', '저장 플리', '좋아요'];
    componentList = [SmallPlaylistCard, SmallPlaylistCard, SmallPlaylistCard];
  } else {
    tabs = ['마이플리', '저장 플리'];
    componentList = [SmallPlaylistCard, SmallPlaylistCard];
  }

  return (
    <Tab.Group>
      <Tab.List css={tabListStyle}>
        {tabs.map((tab, index) => (
          <Tab
            key={index}
            className={({ selected }) =>
              selected ? 'selectedTabStyle' : 'tabStyle'
            }
          >
            {tab}
          </Tab>
        ))}
      </Tab.List>
      <Tab.Panels>
        {componentList.map((Component, index) => (
          <Tab.Panel key={index}>
            <Component
              playlistItem={
                fetchedPlayListData !== undefined
                  ? fetchedPlayListData[index]
                  : TestPlayListData[index]
              }
            />
            {profileId}
          </Tab.Panel>
        ))}
      </Tab.Panels>
    </Tab.Group>
  );
};

const tabListStyle = css`
  display: flex;
  border-bottom: 1px solid ${colors.gray02};
  max-width: 430px;
  margin-bottom: 1rem;

  .selectedTabStyle {
    flex: 1;
    padding: 12px;
    font-size: ${fontSize.md};
    font-weight: 500;
    background: none;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    max-width: 430px;
    color: ${colors.black};
    border: none;
    border-bottom: 2px solid blue;
    outline: none;
  }

  .tabStyle {
    flex: 1;
    padding: 12px;
    font-size: ${fontSize.md};
    font-weight: 500;
    color: ${colors.gray04};
    background: none;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    max-width: 430px;

    &:hover {
      color: ${colors.gray06};
    }
    &:focus {
      outline: none;
    }
  }
`;

export default TabButton;
