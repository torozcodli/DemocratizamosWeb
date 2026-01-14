'use client';

import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface AddProgramButtonProps {
  onClick: () => void;
  className?: string;
}

export function AddProgramButton({ onClick, className }: AddProgramButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-12 h-12 rounded-full bg-[#FF6A00] text-white shadow-lg hover:shadow-xl hover:bg-[#FF7A1A] transition-all flex items-center justify-center',
        className
      )}
      aria-label="Agregar programa"
    >
      <Plus size={24} className="text-white" />
    </button>
  );
}
