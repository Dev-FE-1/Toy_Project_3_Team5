import React from 'react';
import { css } from '@emotion/react';
import { UserMinus } from 'lucide-react';
import { useParams } from 'react-router-dom';
import Profile from '@/components/Profile';
import TabButton from '@/components/TabButton';
import { fontSize } from '@/constants/font';
import ROUTES from '@/constants/route';

const ProfileFollowing = () => {
  const { userId } = useParams();

  // mockdata 배열 정의
  const mockdata = [
    {
      src: '/src/assets/defaultThumbnail.jpg',
      alt: 'Profile Image',
      size: 'sm' as const,
      name: 'John Doe',
    },
    {
      src: '/src/assets/defaultThumbnail.jpg',
      alt: 'Profile Image',
      size: 'sm' as const,
      name: 'Jane Smith',
    },
    {
      src: '/src/assets/defaultThumbnail.jpg',
      alt: 'Profile Image',
      size: 'sm' as const,
      name: 'Emily Davis',
    },
  ];

  return (
    <>
      <div css={rootContainer}>
        <div css={tabBtnContainer}>
          <TabButton
            tabNames={['마이플리', '저장된플리']}
            tabLinks={[ROUTES.PLAYLIST, ROUTES.PLAYLIST_SAVED]} //페이지를 따로 보내서 라우팅? 아니면 그냥 페이지 안에서 useState로 조건부 렌더링?
          />
        </div>
        <div css={numberingContainer}>총 {mockdata.length} 명</div>
        <div css={profileListContainer}>
          {mockdata.map((data, index) => (
            <div key={index} css={profileItem}>
              <span css={profileContainerStyle}>
                <Profile src={data.src} alt={data.alt} size={data.size} />
                <span>{data.name}</span>
              </span>
              <button css={userMinusStyle}>
                <UserMinus css={userMinusStyle} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>hello {userId} 파라미터 체크중</div>
    </>
  );
};

const rootContainer = css`
  display: flex;
  flex-direction: column;
`;

const tabBtnContainer = css``;

const numberingContainer = css`
  padding-left: 20px;
  padding-top: 20px;
  font-size: ${fontSize.xs};
`;

const profileListContainer = css`
  display: flex;
  flex-direction: column;
  padding-left: 20px;
  padding-top: 20px;
`;

const profileItem = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
`;

const profileContainerStyle = css`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const userMinusStyle = css`
  margin-right: 10px;
  background: none;
  border: none;
`;

export default ProfileFollowing;
