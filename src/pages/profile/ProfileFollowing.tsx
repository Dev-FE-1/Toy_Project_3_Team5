import { css } from '@emotion/react';
import { UserMinus } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import IconButton from '@/components/IconButton';
import Modal from '@/components/Modal';
import Profile from '@/components/Profile';
import { fontSize } from '@/constants/font';
import ROUTES from '@/constants/route';
import useList from '@/hooks/useList';
import { useAuthStore } from '@/stores/useAuthStore';
import useModalStore from '@/stores/useModalStore';

const FollowingList = () => {
  const { userId } = useParams();
  const { userId: loggedInUserId } = useAuthStore();
  const isOwner = userId === loggedInUserId;
  const { list: followingList, setList } = useList(userId || '', 'following');
  const { removeFollowing } = useAuthStore.getState();
  const { openModal } = useModalStore();

  const navigate = useNavigate();
  const onToChannel = (goToId: string): void => {
    navigate(ROUTES.PLAYLIST(goToId));
  };

  const onUnfollow = async (removeId: string) => {
    if (userId) {
      try {
        await removeFollowing(userId, removeId);
        setList((prevList) =>
          prevList.filter((user) => user.name !== removeId)
        );
      } catch (error) {
        console.error('Error unfollowing user:', error);
      }
    }
  };

  const onserMinusClick = (removeId: string) => {
    openModal({
      type: 'confirm',
      title: '언팔로우 확인',
      content: '정말로 이 유저를 언팔로우 하시겠습니까?',
      onAction: () => onUnfollow(removeId),
    });
  };

  return (
    <>
      <div css={rootContainer}>
        <div css={numberingContainer}>
          {followingList.length === 0
            ? '팔로우중인 채널이 없습니다'
            : `총 ${followingList.length} 명`}{' '}
        </div>
        <div css={profileListContainer}>
          {followingList.length > 0 &&
            followingList.map((data, index) => (
              <div key={index} css={profileItem}>
                <span css={profileContainerStyle}>
                  <Profile
                    src={data.src}
                    alt={data.alt}
                    size={data.size}
                    onClick={() => onToChannel(data.name)}
                  />
                  <span>{data.channelName}</span>
                </span>

                {isOwner && (
                  <IconButton
                    IconComponent={UserMinus}
                    onClick={() => onserMinusClick(data.name)}
                  />
                )}
              </div>
            ))}
        </div>
      </div>
      <Modal />
    </>
  );
};

const rootContainer = css`
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 8px;
`;

const numberingContainer = css`
  font-size: ${fontSize.md};
`;

const profileListContainer = css`
  display: flex;
  flex-direction: column;
  padding-bottom: 60px;
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

export default FollowingList;
