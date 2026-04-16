import React from 'react';
import { Bell, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface HeaderProps {
  title: string;
  description?: string;
}

export const Header: React.FC<HeaderProps> = ({ title, description }) => {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center border-b border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-xl">
      <div className="flex flex-1 items-center gap-3 px-5">
        <div className="flex-1">
          <h1 className="text-lg font-semibold text-[var(--foreground)]">{title}</h1>
          {description && (
            <p className="text-xs text-[var(--muted-foreground)]">{description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--muted-foreground)]" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-56 pl-9 bg-[var(--secondary)] border-[var(--border)] rounded-lg text-[var(--foreground)]"
            />
          </div>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-4 w-4 text-[var(--muted-foreground)]" />
            <span className="absolute -top-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-[var(--theme-button-primary)] text-[9px] font-bold text-white flex items-center justify-center">3</span>
          </Button>
          <Button variant="ghost" size="icon" className="bg-gradient-to-br from-[var(--theme-button-primary)] to-[var(--theme-button-secondary)] text-white hover:shadow-md">
            <User className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};