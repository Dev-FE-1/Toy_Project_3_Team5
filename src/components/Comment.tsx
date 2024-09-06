import { css } from '@emotion/react';
import KebabButton from '@/components/KebabButton';
import { fontSize, fontWeight } from '@/constants/font';
import useModalStore from '@/stores/useModalStore';

export interface CommentWithProfileProps {
  imgUrl: string;
  userName: string;
  content: string;
  showKebabMenu?: boolean;
  isEdited?: boolean;
  docId?: string;
  onDelete?: (commentId: string) => void;
}

const Comment: React.FC<CommentWithProfileProps> = ({
  imgUrl,
  userName,
  content,
  showKebabMenu = false,
  isEdited = false,
  docId,
  onDelete = () => {},
}) => {
  const { openModal } = useModalStore();

  const onDeleteBtnClick = () => {
    openModal({
      type: 'delete',
      title: '댓글 삭제',
      content: `댓글을 삭제하시겠습니까?`,
      onAction: () => {
        if (docId) onDelete(docId);
      },
    });
  };

  const menuItems = [
    {
      label: '삭제',
      onClick: onDeleteBtnClick,
    },
  ];

  return (
    <div css={commentStyles}>
      <img src={imgUrl} alt='프로필이미지' />
      <div css={contentStyles}>
        <span>{userName}</span>
        <span>{content}</span>
      </div>
      {showKebabMenu && <KebabButton menuItems={menuItems} />}
    </div>
  );
};

const commentStyles = css`
  display: flex;
  gap: 6px;
  align-items: center;

  img {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    object-fit: cover;
    :hover {
      cursor: pointer;
    }
  }
`;

const contentStyles = css`
  gap: 6px;
  display: flex;
  flex-direction: column;
  width: 100%;

  span {
    font-size: ${fontSize.md};
  }

  span:nth-of-type(1) {
    font-weight: ${fontWeight.semiBold};
  }
`;

export default Comment;
