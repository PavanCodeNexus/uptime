import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@uptime/shared';
import App from './App';
import { session } from './lib/api';
import { OwnerStoreProvider } from './store/ownerStore';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } },
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider session={session}>
        <OwnerStoreProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </OwnerStoreProvider>
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
