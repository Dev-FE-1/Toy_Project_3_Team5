import { css } from '@emotion/react';
import { ChevronLeft } from 'lucide-react';
import SearchBar from '@/components/SearchBar';
import colors from '@/constants/colors';
import { fontSize } from '@/constants/font';

type HeaderType = 'main' | 'sub' | 'detail';

interface HeaderProps {
  type: HeaderType;
  title?: string;
  profileImg?: string;
  onBack?: () => void;
  onSearch?: (query: string) => void;
}

const Header = ({ type, title, onBack, onSearch }: HeaderProps) => (
  <header css={headerStyle}>
    {type === 'main' && (
      <>
        <button>
          <img src='' alt='' />
        </button>
        {onSearch && <SearchBar onSearch={onSearch} />}
      </>
    )}
    {type === 'sub' && (
      <>
        <button css={iconButtonStyle} onClick={onBack}>
          <ChevronLeft size={24} />
        </button>
        {onSearch && <SearchBar onSearch={onSearch} />}
        <button>
          <img src='' alt='' />
        </button>
      </>
    )}
    {type === 'detail' && (
      <>
        <button css={iconButtonStyle} onClick={onBack}>
          <ChevronLeft size={24} />
        </button>
        <h1 css={titleStyle}>{title}</h1>
      </>
    )}
  </header>
);

const headerStyle = css`
  max-height: 932px;
  max-width: 430px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: ${colors.white};
  border-bottom: 1px solid ${colors.gray02};

  img {
    max-height: 600px;
  }
`;

const titleStyle = css`
  font-size: ${fontSize.md};
  font-weight: 600;
  flex: 1;
  text-align: center;
`;

const iconButtonStyle = css`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: ${colors.gray04};

  &:hover {
    color: ${colors.gray06};
  }
`;

export default Header;
