import { useState, useEffect } from 'react';
import { css } from '@emotion/react';
import { signOut } from 'firebase/auth';
import { doc, deleteDoc } from 'firebase/firestore';
import { Trash2, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  getUserComments,
  getPlaylistTitle,
  getMyPlaylistCount,
} from '@/api/profileInfo';
import Button from '@/components/Button';
import CheckBox from '@/components/CheckBox';
import IconButton from '@/components/IconButton';
import Modal from '@/components/Modal';
import Profile from '@/components/Profile';
import colors from '@/constants/colors';
import { fontSize, fontWeight } from '@/constants/font';
import ROUTES from '@/constants/route';
import { auth, db } from '@/firebase/firbaseConfig';
import { useAuthStore } from '@/stores/useAuthStore';
import useModalStore from '@/stores/useModalStore';

interface Comment {
  id: string;
  content: string;
  playlistId: number;
  playlistTitle: string;
}

export const ProfileHome = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [myPlaylistCount, setMyPlaylistCount] = useState<number>(0);
  const [commentsPlus, setCommentsPlus] = useState<number>(7);
  const [checkedComments, setCheckedComments] = useState<string[]>([]);
  const [allChecked, setAllChecked] = useState<boolean>(false);

  const { openModal } = useModalStore();
  const navigate = useNavigate();

  const {
    userId,
    profileImage,
    channelName,
    channelFollower,
    channelFollowing,
    clearUser,
  } = useAuthStore();

  useEffect(() => {
    const fetchComments = async () => {
      const userComments = await getUserComments(userId);

      const commentWithTitle = await Promise.all(
        userComments.map(async (comment) => {
          const playlistTitle = await getPlaylistTitle(comment.playlistId);
          return {
            id: comment.commentsId,
            content: comment.content,
            playlistId: comment.playlistId,
            playlistTitle,
          };
        })
      );
      const playlistCount = await getMyPlaylistCount(userId);
      setMyPlaylistCount(playlistCount ?? 0);
      setComments(commentWithTitle);
    };

    fetchComments();
  }, []);

  const deleteComment = async (commentId: string) => {
    const commentRef = doc(db, 'comments', commentId);
    await deleteDoc(commentRef);
  };

  const commentSelection = (commentId: string, isChecked: boolean) => {
    setCheckedComments((prev) => {
      if (isChecked) {
        return [...prev, commentId];
      } else {
        return prev.filter((id) => id !== commentId);
      }
    });
  };

  const deleteSelectedComments = async () => {
    await Promise.all(
      checkedComments.map((commentId) => deleteComment(commentId))
    );
    setComments((prev) =>
      prev.filter((comment) => !checkedComments.includes(comment.id))
    );
    setCheckedComments([]);
  };

  const onCommentsPlus = () => {
    setCommentsPlus((prev) => prev + 5);
  };

  const onAllComments = () => {
    if (allChecked) {
      setCheckedComments([]);
    } else {
      const visibleComment = comments
        .slice(0, commentsPlus)
        .map((comment) => comment.id);

      setCheckedComments(visibleComment);
    }
    setAllChecked(!allChecked);
  };

  const logout = async () => {
    await signOut(auth).then(() => {
      clearUser();
      navigate(ROUTES.ROOT);
    });
  };

  const onDeleteButtonClick = () => {
    openModal({
      type: 'delete',
      title: '댓글 삭제',
      content: '댓글을 삭제하시겠습니까?',
      onAction: deleteSelectedComments,
    });
  };

  return (
    <div css={containerStyle}>
      <div css={profileContainerStyle}>
        <Profile src={profileImage} alt='프로필 이미지' size='xl' />
        <span css={profileNameStyle}>{channelName}</span>
        <button
          css={profileBtnStyle}
          onClick={() => navigate(ROUTES.PROFILE_MODIFY(userId))}
        >
          프로필 수정
        </button>
        <div css={infoContainerStyle}>
          <div
            css={infoStyle}
            onClick={() => navigate(ROUTES.PLAYLIST(userId))}
          >
            <div>{myPlaylistCount}</div>
            <div>플레이리스트</div>
          </div>
          <div
            css={infoStyle}
            onClick={() => navigate(ROUTES.PROFILE_FOLLOWER(userId))}
          >
            <div>{channelFollower.length}</div>
            <div>팔로워</div>
          </div>
          <div css={infoStyle} onClick={() => navigate(ROUTES.FOLLOWING)}>
            <div>{channelFollowing.length}</div>
            <div>팔로잉</div>
          </div>
        </div>
      </div>
      <div css={commentContainerStyle}>
        <div css={commentHeaderStyle}>내가 쓴 댓글 {comments.length}</div>
        <div css={deleteContainerStyle}>
          <button css={allSelectBtnStyle} onClick={onAllComments}>
            {allChecked ? '전체 해제' : '전체 선택'}
          </button>
          <IconButton
            IconComponent={Trash2}
            onClick={onDeleteButtonClick}
            size='md'
            color='red'
          />
        </div>
        <ul css={commentSelectStyle}>
          {comments
            .slice(0, commentsPlus)
            .map(({ id, playlistTitle, content }, index) => (
              <li key={index} css={commentStyle}>
                <CheckBox
                  checked={checkedComments.includes(id)}
                  onChange={(isChecked) => commentSelection(id, isChecked)}
                />
                <Profile src={profileImage} alt='프로필 이미지' size='sm' />
                <div css={commentDesStyle}>
                  <span>{playlistTitle}</span>
                  <div>{content}</div>
                </div>
              </li>
            ))}
        </ul>
        <Button
          label='더보기'
          onClick={onCommentsPlus}
          size='lg'
          fullWidth
          color='gray'
        />
      </div>
      <div css={logoutStyle} onClick={logout}>
        <IconButton
          IconComponent={LogOut}
          onClick={logout}
          size='md'
          color='gray'
        />
        로그아웃
      </div>
      <Modal />
    </div>
  );
};

const containerStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const profileContainerStyle = css`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid ${colors.gray02};
  margin-bottom: 20px;
`;

const profileNameStyle = css`
  margin: 6px 0;
  font-size: ${fontSize.xl};
  color: ${colors.black};
`;

const profileBtnStyle = css`
  background-color: ${colors.gray06};
  border-radius: 50px;
  font-size: ${fontSize.xs};
  color: ${colors.white};
  border: 1px solid ${colors.gray03};
  padding: 4px 12px;
  margin: 6px 0 20px 0;
  cursor: pointer;
`;

const infoContainerStyle = css`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const infoStyle = css`
  display: flex;
  flex-direction: column;
  width: 112px;
  text-align: center;
  cursor: pointer;

  & > div:first-of-type {
    font-weight: ${fontWeight.semiBold};
    height: 22px;
  }
`;

const commentContainerStyle = css`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 0 20px;
`;

const commentHeaderStyle = css`
  font-weight: ${fontWeight.medium};
`;

const deleteContainerStyle = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
`;

const allSelectBtnStyle = css`
  background-color: ${colors.white};
  font-size: ${fontSize.sm};
  color: ${colors.gray05};
  padding: 4px 12px;
  border-radius: 6px;
  border: 1px solid ${colors.gray03};
  cursor: pointer;
`;

const commentSelectStyle = css`
  width: 100%;
  margin-bottom: 12px;
`;

const commentStyle = css`
  display: flex;
  align-items: center;
  padding: 12px 0;
  font-size: ${fontSize.sm};
  border-bottom: 1.5px solid ${colors.gray02};

  & > *:not(:last-child) {
    margin-right: 12px;
  }

  span {
    color: ${colors.gray05};
    margin-bottom: 6px;
  }
`;

const commentDesStyle = css`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  line-height: 1.2;
  flex: 1;
  word-break: break-word;
`;

const logoutStyle = css`
  width: 100%;
  background-color: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  border: none;
  border-top: 1px solid ${colors.gray02};
  font-size: ${fontSize.sm};
  color: ${colors.gray05};
  padding: 14px;
  cursor: pointer;
  margin-bottom: 75px;
`;
