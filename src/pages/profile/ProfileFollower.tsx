import { css } from '@emotion/react';
import { UserMinus } from 'lucide-react';
import { useParams } from 'react-router-dom';
import Modal from '@/components/Modal';
import Profile from '@/components/Profile';
import { fontSize } from '@/constants/font';
import { useAuthStore } from '@/stores/useAuthStore';
import useModalStore from '@/stores/useModalStore';

const ProfileFollower = () => {
  const { userId } = useParams();
  const { channelFollower, removeFollower } = useAuthStore.getState();
  const { openModal } = useModalStore();

  const handleRemoveFollower = async (uid: string) => {
    if (userId) {
      try {
        await removeFollower(userId, uid);
      } catch (error) {
        console.error('팔로워 제거 중 오류 발생:', error);
      }
    }
  };

  const handleUserMinusClick = (uid: string) => {
    openModal({
      type: 'confirm',
      title: '팔로워 삭제 확인',
      content: '정말로 이 유저를 팔로워에서 삭제하시겠습니까?',
      onAction: () => handleRemoveFollower(uid),
    });
  };

  return (
    <>
      <div css={rootContainer}>
        <div css={numberingContainer}>
          {channelFollower.length === 0
            ? '팔로워가 없습니다'
            : `총 ${channelFollower.length} 명`}
        </div>
        <div css={profileListContainer}>
          {channelFollower.length > 0 &&
            channelFollower.map((uid, index) => (
              <div key={index} css={profileItem}>
                <span css={profileContainerStyle}>
                  <Profile
                    src={'/src/assets/defaultThumbnail.jpg'}
                    alt='Profile Image'
                    size='sm'
                  />
                  <span>{uid}</span>
                </span>
                <button
                  css={userMinusStyle}
                  onClick={() => handleUserMinusClick(uid)}
                >
                  <UserMinus css={userMinusStyle} />
                </button>
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
`;

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

export default ProfileFollower;
