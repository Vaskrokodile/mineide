import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';
import {
  LayoutDashboard,
  Server,
  Users,
  Globe,
  HardDrive,
  Settings,
  LogOut,
  Box,
  Bot,
} from 'lucide-react';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/servers', icon: Server, label: 'Servers' },
  { to: '/minecraft', icon: Box, label: 'Minecraft' },
  { to: '/ai', icon: Bot, label: 'AI' },
  { to: '/users', icon: Users, label: 'Users' },
  { to: '/nodes', icon: HardDrive, label: 'Nodes' },
  { to: '/locations', icon: Globe, label: 'Locations' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-56 bg-[var(--card)] border-r border-[var(--border)]">
      <div className="flex h-full flex-col">
        <div className="flex h-14 items-center border-b border-[var(--border)] px-5">
          <div className="flex items-center gap-2">
            <div>
              <span className="text-base font-semibold text-[var(--card-foreground)]">MineIDE</span>
              <p className="text-[10px] text-[var(--theme-primary)] font-medium">Panel</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-0.5 p-2">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.to);
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={clsx(
                  'flex items-center gap-2.5 rounded-md px-3 py-2 text-xs font-medium transition-all duration-150',
                  isActive
                    ? 'bg-gradient-to-r from-[var(--theme-button-primary)] to-[var(--theme-button-secondary)] text-white shadow-md shadow-[var(--theme-button-primary)]/20'
                    : 'text-[var(--muted-foreground)] hover:bg-[var(--secondary)] hover:text-[var(--secondary-foreground)]'
                )}
              >
                <item.icon className={clsx('h-4 w-4', isActive ? 'text-white' : 'text-[var(--muted-foreground)]')} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t border-[var(--border)] p-2">
          <button className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-xs font-medium text-[var(--muted-foreground)] transition-colors hover:bg-[var(--secondary)] hover:text-[var(--secondary-foreground)]">
            <LogOut className="h-4 w-4 text-[var(--muted-foreground)]" />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
};