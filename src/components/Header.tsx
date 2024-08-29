import { css } from '@emotion/react';
import { ChevronLeft } from 'lucide-react';
import Logo from '@/components/Logo';
import Profile from '@/components/Profile';
import SearchBar from '@/components/SearchBar';
import colors from '@/constants/colors';
import { fontSize } from '@/constants/font';

type HeaderType = 'main' | 'sub' | 'detail';

type ProfileProps = {
  src: string;
  alt: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
};
interface HeaderProps {
  type: HeaderType;
  title?: string;
  profileImg?: string;
  onBack?: () => void;
  onSearch?: (query: string) => void;
  profileProps: ProfileProps;
}

const Header = ({
  type,
  title,
  onBack,
  onSearch,
  profileProps = { src: 'srcid', alt: '동혁쓰플필', size: 'xs' },
}: HeaderProps) => (
  <header css={headerStyle}>
    {type === 'main' && (
      <>
        <Logo logoWidth={100} clickable={true}></Logo>
        {onSearch && <SearchBar onSearch={onSearch} />}
        <Profile
          src={profileProps.src}
          alt={profileProps.alt}
          size={profileProps.size}
        />
      </>
    )}
    {type === 'sub' && (
      <>
        <button css={iconButtonStyle} onClick={onBack}>
          <ChevronLeft size={24} />
        </button>
        {onSearch && <SearchBar onSearch={onSearch} />}
        <button>
          <Logo logoWidth={100} clickable={true}></Logo>
        </button>
        <Profile
          src={profileProps.src}
          alt={profileProps.alt}
          size={profileProps.size}
        />
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
  max-height: 5vh;
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
  font-size: 2rem;
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
