import React from 'react';
import { css } from '@emotion/react';
import colors from '@/constants/colors';
import { fontSize, fontWeight } from '@/constants/font';

interface TextFilterProps {
  options: string[];
  selectedIndex: number;
  onFilterChange: (idx: number) => void;
}

const TextFilter: React.FC<TextFilterProps> = ({
  options,
  selectedIndex,
  onFilterChange,
}) => (
  <div css={textFilterStyle}>
    {options.map((option, idx) => (
      <React.Fragment key={idx}>
        <span
          css={optionStyle(idx, selectedIndex)}
          onClick={() => {
            onFilterChange(idx);
          }}
        >
          {option}
        </span>
        {idx < options.length - 1 && <span css={separatorStyle}>|</span>}
      </React.Fragment>
    ))}
  </div>
);

const textFilterStyle = css`
  display: flex;
  font-size: ${fontSize.sm};
  font-weight: ${fontWeight.semiBold};
`;

const optionStyle = (idx: number, selectedIndex: number) => css`
  color: ${idx === selectedIndex ? colors.primaryNormal : colors.black};

  &:hover {
    cursor: pointer;
    color: ${colors.primaryNormal};
  }
`;

const separatorStyle = css`
  color: ${colors.gray03};
  margin: 0 4px;
`;

export default TextFilter;
