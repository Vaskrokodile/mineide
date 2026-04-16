import React from 'react';
import { clsx } from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'destructive' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(
          'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-primary)] focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50',
          {
            'bg-gradient-to-r from-[var(--theme-button-primary)] to-[var(--theme-button-secondary)] text-white shadow-sm hover:shadow-md active:scale-[0.98]': variant === 'primary',
            'bg-[var(--secondary)] text-[var(--secondary-foreground)] border border-[var(--border)] shadow-sm hover:bg-[var(--secondary)]/80 active:scale-[0.98]': variant === 'secondary',
            'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-sm hover:shadow-md active:scale-[0.98]': variant === 'destructive',
            'hover:bg-[var(--theme-primary)]/10 text-[var(--theme-primary)]': variant === 'ghost',
            'border border-[var(--theme-primary)] text-[var(--theme-primary)] hover:bg-[var(--theme-primary)]/10': variant === 'outline',
          },
          {
            'h-7 px-2.5 text-xs': size === 'sm',
            'h-8 px-3 text-sm': size === 'md',
            'h-10 px-5 text-sm': size === 'lg',
            'h-8 w-8': size === 'icon',
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';