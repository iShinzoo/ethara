'use client';

import { useState } from 'react';
import { Navbar } from './navbar';
import { Sidebar } from './sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background relative">
      {/* Decorative glow (kept subtle; never washes out content) */}
      <div className="pointer-events-none fixed inset-0 -z-10 app-gradient opacity-20" />
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex bg-background">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 md:ml-0 bg-background">
          <div className="p-4 md:p-8">
            <div className="mx-auto w-full max-w-6xl">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}
