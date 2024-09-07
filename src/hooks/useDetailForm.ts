import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addComment } from '@/api/comment';
import ROUTES from '@/constants/route';
import useToast from '@/hooks/useToast';
import { useAuthStore } from '@/stores/useAuthStore';
import { CommentProps } from '@/types/playlistType';

const useDetailForm = () => {
  const { playlistId } = useParams();
  const { userId } = useAuthStore();
  const { toastTrigger } = useToast();
  const navigate = useNavigate();

  interface VALUES {
    comment: string;
    currentVideoIndex: number;
  }

  const INIT_VALUES: VALUES = {
    comment: '',
    currentVideoIndex: 0,
  };

  const [values, setValues] = useState<VALUES>(INIT_VALUES);
  const onChanges = {
    comment: (e: React.ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, comment: e.target.value });
    },
  };
  const onKeydowns = {
    comment: (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') onClicks.comment();
    },
  };
  const onClicks = {
    comment: async () => {
      if (!!!validations.comment()) return;
      const commentData: CommentProps = {
        playlistId: Number(playlistId),
        content: values.comment,
        isEdited: false,
        regDate: new Date().toISOString(),
        userId,
      };

      const { status } = await addComment(commentData);
      if (status === 'success') {
        setValues({ ...values, comment: '' });
        toastTrigger('댓글이 등록되었습니다.');
      } else {
        toastTrigger('댓글등록이 실패했습니다.', 'fail');
      }
    },
    copy: () => {
      navigator.clipboard.writeText(window.location.href);
      toastTrigger('링크가 복사되었습니다.');
    },
    video: (index: number) => {
      setValues({ ...values, currentVideoIndex: index });
    },
    profile: (userId: string) => {
      navigate(ROUTES.PLAYLIST(userId));
    },
  };

  const validations = {
    comment: (): boolean => {
      if (isNaN(Number(playlistId))) return false;
      if (!!!userId || userId.trim() === '') {
        toastTrigger('로그인이 필요합니다.', 'fail');
        return false;
      }
      if (values.comment.trim().length < 1) {
        toastTrigger('댓글을 입력해주세요', 'fail');
        return false;
      }
      return true;
    },
  };

  return {
    values,
    onChanges,
    onKeydowns,
    onClicks,
    validations,
  };
};

export default useDetailForm;
