import { useState } from 'react';

const useTagSelection = (initialSelectedTags: number[] = []) => {
  const [selectedTags, setSelectedTags] =
    useState<number[]>(initialSelectedTags);

  const onTagSelection = (id: number, removable: boolean) => {
    if (removable) return;
    setSelectedTags((prev) =>
      prev.includes(id) ? prev.filter((tagId) => tagId !== id) : [...prev, id]
    );
  };

  return {
    selectedTags,
    onTagSelection,
  };
};

export default useTagSelection;
