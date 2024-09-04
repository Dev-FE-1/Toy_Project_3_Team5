import { useState } from 'react';

const useTagSelection = (initialSelectedTags: number[] = []) => {
  const [selectedTags, setSelectedTags] =
    useState<number[]>(initialSelectedTags);

  const onTagSelection = (id: number, removable: boolean) => {
    if (removable) return;

    setSelectedTags((prev) => {
      if (prev.includes(id)) {
        return prev.filter((tagId) => tagId !== id);
      } else {
        if (prev.length >= 10) {
          return prev;
        }
        return [...prev, id];
      }
    });
  };

  return {
    selectedTags,
    onTagSelection,
  };
};

export default useTagSelection;
