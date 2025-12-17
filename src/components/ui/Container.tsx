import { cn } from '@/lib/utils/cn';
import type { ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

export function Container({ children, className }: ContainerProps) {
  return (
    <div className={cn('mx-auto max-w-7xl pl-0 pr-4 sm:pr-6 lg:pr-8', className)}>
      {children}
    </div>
  );
}

