import { css } from '@emotion/react';
import colors from '@/constants/colors';

const LoadingSpinner = () => <div css={spinnerStyles}></div>;

const spinnerStyles = css`
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-top: 3px solid ${colors.primaryLight};
  border-radius: 50%;
  min-width: 24px;
  min-height: 24px;
  max-width: 24px;
  max-height: 24px;
  animation: spin 1s linear infinite;
  display: block;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export default LoadingSpinner;
