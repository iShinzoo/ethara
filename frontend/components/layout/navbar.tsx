'use client';

import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserMenu } from './user-menu';

interface NavbarProps {
  onMenuClick: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  return (
    <header className="bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/70 border-b border-border sticky top-0 z-50">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 hover:bg-muted rounded-full transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5 text-foreground" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-border flex items-center justify-center">
              <span className="text-primary font-semibold text-sm">千</span>
            </div>
            <h1 className="text-lg font-semibold text-foreground">Tasokio</h1>
          </div>
        </div>

        <UserMenu />
      </div>
    </header>
  );
}
