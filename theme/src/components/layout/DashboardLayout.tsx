import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export const DashboardLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Sidebar />
      <main className="pl-56">
        <Outlet />
      </main>
    </div>
  );
};