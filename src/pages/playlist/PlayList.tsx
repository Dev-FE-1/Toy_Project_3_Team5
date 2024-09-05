import { css } from '@emotion/react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { useChennelData } from '@/api/chennelInfo';
import Button from '@/components/Button';
import Profile from '@/components/Profile';
import TabButton from '@/components/TabButton';
import colors from '@/constants/colors';
import { fontSize, fontWeight } from '@/constants/font';
import ROUTES from '@/constants/route';
import { useFollowToggle } from '@/hooks/useFollowToggle';

export const PlayList = () => {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const { chennelData } = useChennelData(userId);
  const { isFollowing, handleFollowToggle } = useFollowToggle(userId);

  const INFO_LIST = [
    {
      label: '팔로워',
      count: chennelData?.channelFollower.length.toString(),
      onClick: () => {
        navigate(ROUTES.PROFILE_FOLLOWER(userId));
      },
    },
    {
      label: '팔로잉',
      count: chennelData?.channelFollowing.length.toString(),
      onClick: () => {
        navigate(ROUTES.PROFILE_FOLLOWING(userId));
      },
    },
  ];

  const TAB_NAMES = [
    '마이플리',
    '저장된 플리',
    ...(chennelData?.isMyChannel ? ['좋아요'] : []),
  ];

  const TAB_LINKS = [
    () => ROUTES.PLAYLIST(userId),
    () => ROUTES.PLAYLIST_SAVED(userId),
    ...(chennelData?.isMyChannel ? [() => ROUTES.PLAYLIST_LIKES(userId)] : []),
  ];

  return (
    <>
      <section css={myInfoStyles}>
        <Profile
          src={chennelData?.profileImg as string}
          alt='프로필 이미지'
          size='lg'
        />
        <div css={profileStyles}>
          <div className='username'>
            {chennelData?.channelName}
            {!chennelData?.isMyChannel && (
              <Button
                label={isFollowing ? '팔로우 취소' : '팔로우'}
                color={isFollowing ? 'gray' : 'black'}
                size='sm'
                onClick={handleFollowToggle}
              />
            )}{' '}
          </div>
          <ul className='info-list'>
            {INFO_LIST.map((info, index) => (
              <li key={index} onClick={info.onClick}>
                <span>{info.count}</span>
                <span>{info.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <TabButton tabNames={TAB_NAMES} tabLinks={TAB_LINKS} />
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
    display: flex;
    align-items: center;

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
      :hover {
        cursor: pointer;
      }

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
