'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

interface AdminNavBarProps {
  locale: string;
}

export function AdminNavBar({ locale }: AdminNavBarProps) {
  const t = useTranslations('admin');
  const pathname = usePathname();

  const navItems = [
    { path: 'programas', label: t('managePrograms') },
    { path: 'herramientas', label: t('manageTools') },
    { path: 'blog', label: t('manageBlog') },
  ];

  return (
    <nav className="bg-white border-b border-[#C7CAE8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 xl:px-8 flex flex-wrap gap-1 py-1">
        {navItems.map(({ path, label }) => {
          const href = `/${locale}/admin/${path}`;
          const segment = `/admin/${path}`;
          const isActive =
            pathname === href ||
            pathname.startsWith(`${href}/`) ||
            pathname === segment ||
            pathname.startsWith(`${segment}/`);
          return (
            <Link
              key={path}
              href={href}
              className={`px-4 py-2 text-sm font-medium text-[#1D194C] rounded-md transition-colors ${
                isActive ? 'bg-[#E7E9FF] font-semibold' : 'hover:bg-[#E7E9FF]'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
