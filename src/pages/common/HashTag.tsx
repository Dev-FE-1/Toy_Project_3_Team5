import React, { useState } from 'react';
import { css } from '@emotion/react';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import HashTagComponent, { Tag } from '@/components/HashTag';
import IconButton from '@/components/IconButton';
import colors from '@/constants/colors';
import { fontSize, fontWeight } from '@/constants/font';
import { HASHTAGS } from '@/constants/hashtag';
import ROUTES from '@/constants/route';

const HashTag: React.FC = () => {
  const [tags, setTags] = useState<Tag[]>(HASHTAGS);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const navigate = useNavigate();

  const onTagRemove = (id: number) => {
    setTags(tags.filter((tag) => tag.id !== id));
  };

  const onSelected = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    } else {
      setSelectedTags(
        selectedTags.filter((selectedTag) => selectedTag !== tag)
      );
    }
  };

  const onSkip = () => {
    navigate(ROUTES.ROOT);
  };

  return (
    <div css={hashtagConainerStyle}>
      <div css={titleStyle}>해시태그</div>
      <span css={desStyle}>관심 있는 태그를 선택해주세요 (최대 10개)</span>
      <div css={hashtagStyle}>
        <HashTagComponent tags={tags} onRemove={onTagRemove} margin='8px' />
      </div>
      <div css={skipContainerStyle}>
        <div onClick={onSkip} css={skipStyle}>
          {selectedTags.length > 0 ? 'NEXT' : 'SKIP'}
          <IconButton
            IconComponent={ChevronRight}
            onClick={() => {}}
            size='md'
            color='black'
          />
        </div>
      </div>
    </div>
  );
};

const hashtagConainerStyle = css`
  width: 100%;
  height: calc(100vh - 75px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const titleStyle = css`
  font-size: 32px;
  margin-bottom: 20px;
  font-weight: ${fontWeight.medium};
`;

const desStyle = css`
  color: ${colors.primaryNormal};
  font-size: ${fontSize.sm};
  margin-bottom: 20px;
`;

const hashtagStyle = css`
  margin: 0 44px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const skipContainerStyle = css`
  width: 100%;
  position: fixed;
  padding: 24px;
  bottom: 0px;
  right: 0px;
  font-size: ${fontSize.lg};
  display: flex;
  justify-content: flex-end;
  align-items: center;
  background-color: transparent;
  border: none;
  border-top: 1px solid ${colors.gray02};
`;

const skipStyle = css`
  cursor: pointer;
  display: flex;
  justify-content: flex-end;
  align-items: center;

  &:hover {
    color: ${colors.primaryNormal};
  }
`;

export default HashTag;
