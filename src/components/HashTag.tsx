import { css } from '@emotion/react';
import colors from '@/constants/colors';
import { fontSize, fontWeight } from '@/constants/font';
import useTagSelection from '@/hooks/useTagSelection';

export interface Tag {
  id: number;
  label: string;
  removable: boolean;
}

interface TagProps {
  tags: Tag[];
  onRemove: (id: number) => void;
}

const HashTag: React.FC<TagProps> = ({ tags, onRemove }) => {
  const { selectedTags, onTagSelection } = useTagSelection();

  return (
    <div>
      {tags.map((tag) => (
        <div
          key={tag.id}
          css={tagStyle(selectedTags.includes(tag.id), tag.removable)}
          onClick={() => onTagSelection(tag.id, tag.removable)}
        >
          {tag.label}
          {tag.removable && (
            <button
              css={removeButtonStyle}
              onClick={(e) => {
                e.stopPropagation();
                onRemove(tag.id);
              }}
            >
              X
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

const tagStyle = (isSelected: boolean, removable: boolean) => css`
  display: inline-flex;
  align-items: center;
  margin-right: 3px;
  border: 1px solid ${colors.gray02};
  font-size: ${fontSize.sm};
  font-weight: ${fontWeight.medium};
  background-color: ${isSelected ? colors.primaryNormal : `none`};
  color: ${isSelected ? 'white' : 'black'};
  border-radius: 50px;
  padding: 8px 12px;
  cursor: ${removable ? 'default' : 'pointer'};
  transition: background-color 0.5s;

  &:hover {
    background-color: ${isSelected ? colors.primaryNormal : `none`};
  }
`;

const removeButtonStyle = css`
  font-size: ${fontSize.xs};
  margin-left: 10px;
  background: none;
  border: none;
  cursor: pointer;
`;

export default HashTag;
