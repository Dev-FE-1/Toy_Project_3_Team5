import { css } from '@emotion/react';
import { UserMinus } from 'lucide-react';
import { useParams } from 'react-router-dom';
import IconButton from '@/components/IconButton';
import Modal from '@/components/Modal';
import Profile from '@/components/Profile';
import { fontSize } from '@/constants/font';
import useList from '@/hooks/useList';
import { useAuthStore } from '@/stores/useAuthStore';

const FollowerList = () => {
  const { userId } = useParams();
  const { userId: loggedInUserId } = useAuthStore();
  const isOwner = userId === loggedInUserId;
  const { list: followerList, handleUserMinusClick } = useList(
    userId || '',
    'follower'
  );

  return (
    <>
      <div css={rootContainer}>
        <div css={numberingContainer}>
          {followerList.length === 0
            ? '팔로워가 없습니다' // 팔로워 리스트가 비어 있을 경우
            : `총 ${followerList.length} 명`}{' '}
          {/* 팔로워 리스트가 있을 경우 */}
        </div>
        <div css={profileListContainer}>
          {followerList.length > 0 &&
            followerList.map((data, index) => (
              <div key={index} css={profileItem}>
                <span css={profileContainerStyle}>
                  <Profile src={data.src} alt={data.alt} size={data.size} />
                  <span>{data.channelName}</span>
                </span>

                {isOwner && (
                  <IconButton
                    IconComponent={UserMinus}
                    onClick={() => handleUserMinusClick(data.name)}
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

export default FollowerList;
