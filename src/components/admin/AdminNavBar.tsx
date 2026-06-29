'use client';

import { Link, usePathname } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

export function AdminNavBar() {
  const t = useTranslations('admin');
  const pathname = usePathname();

  const navItems = [
    { href: '/admin/programas', label: t('managePrograms') },
    { href: '/admin/blog', label: t('manageBlog') },
    { href: '/admin/herramientas', label: t('manageTools') },
  ] as const;

  return (
    <nav className="bg-white border-b border-[#C7CAE8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 xl:px-8 flex gap-1 py-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`px-4 py-2 text-sm font-medium text-[#1D194C] rounded-md transition-colors ${
                isActive
                  ? 'bg-[#E7E9FF] font-semibold'
                  : 'hover:bg-[#E7E9FF]'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
