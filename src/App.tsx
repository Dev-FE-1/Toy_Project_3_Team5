import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { router } from '@/router/router';
import GlobalStyles from '@/styles/GlobalStyles';

const queryClient = new QueryClient();

export const App = () => (
  <QueryClientProvider client={queryClient}>
    <GlobalStyles />
    <RouterProvider router={router} />
  </QueryClientProvider>
);

export default App;
