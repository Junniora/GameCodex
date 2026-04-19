'use client';
// components/ui/Button.tsx
import { ReactNode, ButtonHTMLAttributes } from 'react';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: string;
  children: ReactNode;
}

const variantMap = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost: 'px-4 py-2 rounded-xl text-sm font-medium text-muted hover:text-primary hover:bg-tertiary transition-all',
  danger: 'px-4 py-2 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-500/10 border border-red-500/20 transition-all active:scale-95',
};

const sizeMap = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  disabled,
  className = '',
  ...rest
}: Props) {
  const base = variant === 'primary' || variant === 'secondary'
    ? variantMap[variant]
    : `${variantMap[variant]} ${sizeMap[size]}`;

  return (
    <button
      disabled={disabled || loading}
      className={`${base} ${className} inline-flex items-center justify-center gap-2`}
      {...rest}
    >
      {loading ? (
        <span className="inline-block w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
      ) : icon ? (
        <span>{icon}</span>
      ) : null}
      {children}
    </button>
  );
}
