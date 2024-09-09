import { useState } from 'react';
import useToast from '@/hooks/useToast';

export const useHashtagManage = () => {
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [hashtag, setHashtag] = useState<string>('');
  const { toastTrigger } = useToast();

  const addHashtag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();

      const invalidString = /[\s!@#$%^&*(),.?":{}|<>]/;
      if (invalidString.test(hashtag)) {
        toastTrigger(
          '해시태그에 공백이나 특수문자를 사용할 수 없습니다.',
          'fail'
        );
        return;
      }

      if (hashtags.length >= 10) {
        toastTrigger('해시태그는 최대 10개 제한입니다.', 'fail');
        return;
      }

      const formattedHashtag = hashtag.startsWith('#')
        ? hashtag
        : `#${hashtag}`;

      if (hashtag && hashtags.includes(formattedHashtag)) {
        toastTrigger('이미 있는 해시태그입니다.', 'fail');
        return;
      }

      if (hashtag) {
        setHashtags((prev) => [...prev, formattedHashtag]);
        setHashtag('');
      }
    }
  };

  const removeHashtag = (label: string) => {
    setHashtags((prevHashtags) => prevHashtags.filter((tag) => tag !== label));
  };

  return {
    hashtags,
    hashtag,
    setHashtag,
    setHashtags,
    addHashtag,
    removeHashtag,
  };
};
