import { useState, useEffect } from 'react';
import { HASHTAGS } from '@/constants/hashtag';
import { useAuthStore } from '@/stores/useAuthStore';
import randomTags from '@/utils/randomTags';

const useGenerateTags = (fixedTag: string) => {
  const [tags, setTags] = useState<string[]>([fixedTag]);
  const { tags: userTags, userId } = useAuthStore();

  useEffect(() => {
    const neededTagsCount = 3 - userTags.length;
    let additionalTags: string[] = [];

    if (neededTagsCount > 0) {
      const availableTags = HASHTAGS.map((tag) => tag.label).filter(
        (tag) => !userTags.includes(tag)
      );
      additionalTags = randomTags(availableTags, neededTagsCount);
    }

    const allTags = [...userTags, ...additionalTags].slice(0, 3);
    const selectedTags = randomTags(allTags, 3);

    setTags([fixedTag, ...selectedTags]);
  }, [fixedTag, userTags, userId]);

  return tags;
};

export default useGenerateTags;
