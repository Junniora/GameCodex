'use client';
// components/ui/GlassCard.tsx
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg';
  rounded?: 'xl' | '2xl' | '3xl';
}

const paddingMap = { sm: 'p-3', md: 'p-5', lg: 'p-8' };
const roundedMap = { xl: 'rounded-xl', '2xl': 'rounded-2xl', '3xl': 'rounded-3xl' };

export default function GlassCard({
  children,
  className = '',
  hover = false,
  padding = 'md',
  rounded = '2xl',
}: Props) {
  return (
    <div
      className={`
        glass
        ${roundedMap[rounded]}
        ${paddingMap[padding]}
        ${hover ? 'card-hover cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
