import { RouterProvider } from 'react-router-dom';
import { router } from '@/router/router';
import GlobalStyles from '@/styles/GlobalStyles';

export const App = () => (
  <>
    <GlobalStyles />
    <RouterProvider router={router} />
  </>
);

export default App;
