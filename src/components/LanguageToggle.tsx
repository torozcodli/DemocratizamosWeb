'use client';

import { useTransition } from 'react';
import { useLocale } from 'next-intl';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';

export function LanguageToggle() {
  const t = useTranslations('footer');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const nextLocale = locale === 'es' ? 'en' : 'es';
  const label =
    locale === 'es' ? t('switchToEnglish') : t('switchToSpanish');

  const handleClick = () => {
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className="text-xs sm:text-sm text-[#E1E6FD]/70 hover:text-[#E1E6FD] hover:underline transition-colors disabled:opacity-60"
      aria-label={label}
    >
      {label}
    </button>
  );
}
