import React from 'react';
import { clsx } from 'clsx';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'destructive' | 'secondary' | 'outline';
}

export const Badge: React.FC<BadgeProps> = ({ className, variant = 'default', ...props }) => {
  return (
    <div
      className={clsx(
        'inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-medium transition-colors',
        {
          'bg-gradient-to-r from-[var(--theme-button-primary)] to-[var(--theme-button-secondary)] text-white': variant === 'default',
          'bg-[var(--theme-primary)]/10 text-[var(--theme-primary)]': variant === 'success',
          'bg-amber-100 text-amber-700': variant === 'warning',
          'bg-red-100 text-red-700': variant === 'destructive',
          'bg-[var(--secondary)] text-[var(--secondary-foreground)]': variant === 'secondary',
          'border border-[var(--theme-primary)]/30 text-[var(--theme-primary)] bg-[var(--theme-primary)]/5': variant === 'outline',
        },
        className
      )}
      {...props}
    />
  );
};