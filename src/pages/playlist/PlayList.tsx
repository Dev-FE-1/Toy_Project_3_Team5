import { useState } from 'react';
import { css } from '@emotion/react';
import { Outlet } from 'react-router-dom';
import Button from '@/components/Button';
import Profile from '@/components/Profile';
import TabButton from '@/components/TabButton';
import colors from '@/constants/colors';
import { fontSize, fontWeight } from '@/constants/font';
import ROUTES from '@/constants/route';

export const PlayList = () => {
  const [isFollow, setIsFollow] = useState(false);

  const INFOLIST = [
    {
      label: '팔로워',
      count: 12,
    },
    {
      label: '팔로잉',
      count: 8,
    },
  ];

  return (
    <>
      <section css={myInfoStyles}>
        <Profile
          src={'/src/assets/defaultThumbnail.jpg'}
          alt='프로필 이미지'
          size='lg'
        />
        <div css={profileStyles}>
          <div className='username'>
            dev.meryoung
            <Button
              label={isFollow ? '팔로우' : '팔로잉'}
              color={isFollow ? 'black' : 'gray'}
              size='sm'
              onClick={() => {
                setIsFollow(!isFollow);
              }}
            />
          </div>
          <ul className='info-list'>
            {INFOLIST.map((info, index) => (
              <li key={index}>
                <span>{info.count}</span>
                <span>{info.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <TabButton
        tabNames={['마이플리', '저장된플리', '좋아요']}
        tabLinks={[
          ROUTES.PLAYLIST,
          ROUTES.PLAYLIST_SAVED,
          ROUTES.PLAYLIST_LIKES,
        ]}
      />
      <Outlet />
    </>
  );
};

const myInfoStyles = css`
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 20px;
`;

const profileStyles = css`
  gap: 8px;
  display: flex;
  flex-direction: column;

  .username {
    font-size: ${fontSize.lg};
    font-weight: ${fontWeight.medium};

    button {
      margin-left: 8px;
    }
  }

  .info-list {
    display: flex;
    gap: 24px;

    li {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;

      span:nth-of-type(1) {
        font-weight: ${fontWeight.semiBold};
        font-size: ${fontSize.lg};
      }

      span:nth-of-type(2) {
        color: ${colors.gray06};
        font-size: ${fontSize.md};
      }
    }
  }
`;
