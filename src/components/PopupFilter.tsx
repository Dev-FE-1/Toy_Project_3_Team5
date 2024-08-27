import React, { useEffect, useRef, useState } from 'react';
import { css } from '@emotion/react';
import { ListFilter } from 'lucide-react';
import colors from '@/constants/colors';
import { fontWeight } from '@/constants/font';

interface PopupFilterProps {
  options: string[];
  selectedIndex: number;
  onFilterChange: (idx: number) => void;
}

const PopupFilter: React.FC<PopupFilterProps> = ({
  options,
  selectedIndex,
  onFilterChange,
}) => {
  const [filterActive, setFilterActive] = useState<boolean>(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setFilterActive(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div css={containerStyle}>
      <button
        css={filterButtonStyle(filterActive)}
        onClick={() => {
          setFilterActive(!filterActive);
        }}
        ref={buttonRef}
      >
        <ListFilter size={16} /> 필터
      </button>
      <div css={popupFilterStyle(filterActive)} ref={popupRef}>
        <p>정렬</p>
        <div css={optionWrapperStyle}>
          {options.map((option, idx) => (
            <span
              key={idx}
              css={optionStyle(idx, selectedIndex)}
              onClick={() => {
                onFilterChange(idx);
              }}
            >
              {option}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

const containerStyle = css`
  display: flex;
  position: relative;
`;

const filterButtonStyle = (filterActive: boolean) => css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  outline: none;
  color: ${filterActive ? colors.white : colors.gray05};
  border: 1px solid ${filterActive ? colors.primaryNormal : colors.gray03};
  border-radius: 50px;
  padding: 8px 12px;
  gap: 6px;
  background-color: ${filterActive ? colors.primaryNormal : 'transparent'};

  &:hover {
    cursor: pointer;
    color: ${filterActive ? colors.white : colors.primaryLight};
    border-color: ${filterActive ? 'none' : colors.primaryLight};
  }
`;

const popupFilterStyle = (filterActive: boolean) => css`
  display: ${filterActive ? 'inline-flex' : 'none'};
  position: absolute;
  justify-content: center;
  flex-direction: column;
  padding: 20px;
  border-radius: 4px;
  gap: 10px;
  top: 45px;
  box-shadow:
    0px 8px 10px -5px rgba(0, 0, 0, 0.2),
    0px 16px 24px 2px rgba(0, 0, 0, 0.14),
    0px 6px 30px 5px rgba(0, 0, 0, 0.12);
  background-color: ${colors.white};

  p {
    font-weight: ${fontWeight.semiBold};
  }
`;

const optionWrapperStyle = css`
  display: flex;
  gap: 4px;
`;

const optionStyle = (idx: number, selectedIndex: number) => css`
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid
    ${idx === selectedIndex ? colors.primaryLight : colors.gray02};
  border-radius: 50px;
  padding: 4px 12px;
  color: ${idx === selectedIndex ? colors.primaryNormal : colors.gray05};
  background-color: ${idx === selectedIndex
    ? `${colors.primaryLight}1A`
    : 'transparent'};

  &:hover {
    cursor: pointer;
  }
`;

export default PopupFilter;
