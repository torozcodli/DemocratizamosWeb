'use client';

import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface AddBlogButtonProps {
  onClick: () => void;
  className?: string;
}

export function AddBlogButton({ onClick, className }: AddBlogButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-12 h-12 rounded-full bg-[#FF6A00] text-white shadow-lg hover:shadow-xl hover:bg-[#FF7A1A] transition-all flex items-center justify-center',
        className
      )}
      aria-label="Agregar blog"
    >
      <Plus size={24} className="text-white" />
    </button>
  );
}
