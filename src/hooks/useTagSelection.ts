import { useState } from 'react';

const useTagSelection = (initialSelectedTags: string[] = []) => {
  const [selectedTags, setSelectedTags] =
    useState<string[]>(initialSelectedTags);

  const onTagSelection = (label: string, removable: boolean) => {
    if (removable) return;

    setSelectedTags((prev) => {
      if (prev.includes(label)) {
        return prev.filter((tagLabel) => tagLabel !== label);
      } else {
        if (prev.length >= 10) {
          return prev;
        }
        return [...prev, label];
      }
    });
  };

  return {
    selectedTags,
    onTagSelection,
  };
};

export default useTagSelection;
