export type HeaderType = 'main' | 'searchResult' | 'detail';

export interface HeaderProps {
  type: HeaderType;
  headerTitle?: string;
}
