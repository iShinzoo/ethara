'use client';

import { MainLayout } from '@/components/layout/main-layout';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { LoadingSpinner } from '@/components/common/loading-spinner';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isProtected, isLoading } = useProtectedRoute();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <LoadingSpinner text="Loading..." />
      </div>
    );
  }

  if (!isProtected) {
    return null;
  }

  return <MainLayout>{children}</MainLayout>;
}
