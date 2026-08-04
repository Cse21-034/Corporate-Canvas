import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { App } from './App';
import './index.css';
import { createRoot } from 'react-dom/client';
import { setBaseUrl } from '@workspace/api-client-react';

// When VITE_API_URL is set (e.g. on Vercel pointing at a Render backend),
// all API calls are directed there instead of the same-origin /api path.
const apiUrl = import.meta.env.VITE_API_URL as string | undefined;
if (apiUrl) {
  setBaseUrl(apiUrl);
}

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);
