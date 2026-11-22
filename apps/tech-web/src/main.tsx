import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@uptime/shared';
import App from './App';
import { session } from './lib/api';
import { TechStoreProvider } from './store/techStore';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } },
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider session={session}>
        <TechStoreProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </TechStoreProvider>
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
