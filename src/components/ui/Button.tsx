import { cn } from '@/lib/utils/cn';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  children,
  className,
  ...props
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center rounded-full focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none';

  const variants = {
    primary:
      'bg-[#1E1A49] text-white px-5 py-1.5 text-[19px] font-normal shadow-sm hover:bg-[#27225a] transition-colors focus-visible:ring-2 focus-visible:ring-[#6F74C9] focus-visible:ring-offset-2',
    secondary:
      'bg-slate-200 text-slate-900 hover:bg-slate-300 active:bg-slate-400',
    ghost:
      'bg-transparent text-slate-700 hover:bg-slate-100 active:bg-slate-200',
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
}

