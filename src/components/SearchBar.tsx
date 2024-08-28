import React, { useState } from 'react';
import { css } from '@emotion/react';
import { Search } from 'lucide-react';
import colors from '@/constants/colors';
import { fontSize } from '@/constants/font';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

const SearchBar = ({
  onSearch,
  placeholder = '검색어를 입력하세요',
}: SearchBarProps) => {
  const [query, setQuery] = useState('');

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form css={searchBarStyle} onSubmit={onSubmit}>
      <input
        type='text'
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        css={inputStyle}
      />
      <button type='submit' css={buttonStyle}>
        <Search size={20} />
      </button>
    </form>
  );
};

const searchBarStyle = css`
  display: flex;
  align-items: center;
  background-color: ${colors.gray01};
  border-radius: 20px;
  padding: 5px 10px;
  margin: 0 10px;
`;

const inputStyle = css`
  flex: 1;
  border: none;
  background: none;
  font-size: ${fontSize.md};
  padding: 5px;
  outline: none;

  &::placeholder {
    color: ${colors.gray03};
  }
`;

const buttonStyle = css`
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
  color: ${colors.gray04};

  &:hover {
    color: ${colors.gray06};
  }
`;

export default SearchBar;
