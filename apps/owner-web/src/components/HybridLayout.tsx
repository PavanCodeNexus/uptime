import { useAuth } from '@uptime/shared';
import { Outlet } from 'react-router-dom';
import { OwnerLayout } from './OwnerLayout';
import { PublicFooter, PublicHeader } from './PublicHeaderFooter';

/** Renders inside the full signed-in OwnerLayout when authenticated, or the Public website header/footer when browsing as a guest. */
export function HybridLayout() {
  const { status } = useAuth();
  if (status === 'authenticated') {
    return <OwnerLayout />;
  }
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <PublicHeader />
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 py-8">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
}
