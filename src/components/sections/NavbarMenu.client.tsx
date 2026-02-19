'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link } from '@/i18n/navigation';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { siteConfig } from '@/config/site';
import { contactBtnClass } from '@/lib/styles/buttons';
import { cn } from '@/lib/utils/cn';
import { usePathname } from '@/i18n/navigation';
import { track } from '@/lib/analytics';
import { useTranslations } from 'next-intl';

export function NavbarMenuClient() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const t = useTranslations('nav');

  // Bloquear scroll del body cuando el menú está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      <div className="hidden 2xl:flex 2xl:items-center 2xl:gap-2 2xl:gap-4">
        {siteConfig.navigation.map((item, index) => {
          const isActive = item.href === pathname;
          const isDisabled = item.href === '#';
          return (
            <Link
              key={`${item.navKey}-${index}`}
              href={item.href}
              prefetch={false}
              onClick={(e) => {
                if (isDisabled) {
                  e.preventDefault();
                } else {
                  if (item.navKey === 'programs' || item.navKey === 'tools') {
                    track('cta_click', {
                      cta: item.navKey,
                      location: 'navbar',
                    });
                  }
                }
              }}
              className={cn(
                'text-base 2xl:text-[15px] 2xl:px-3 2xl:py-2 rounded-full font-medium transition-all relative px-2 py-1.5',
                isActive
                  ? 'text-navy-900 bg-lavender hover:ring-2 hover:ring-[#6F74C9] hover:ring-offset-2'
                  : isDisabled
                  ? 'text-navy-900/50 cursor-not-allowed'
                  : 'text-navy-900 hover:text-navy-900 hover:bg-lavender/50 hover:ring-2 hover:ring-[#6F74C9] hover:ring-offset-2'
              )}
            >
              {t(item.navKey)}
            </Link>
          );
        })}
        <a href={siteConfig.cta.href} target="_blank" rel="noopener noreferrer">
          <Button variant="primary" className={contactBtnClass + ' ml-1 2xl:px-5 2xl:py-2 2xl:ml-2 mr-2 2xl:mr-4 text-sm 2xl:text-base'}>
            {t(siteConfig.cta.navKey)}
          </Button>
        </a>
      </div>
      <button
        className="2xl:hidden h-12 w-12 rounded-full bg-indigo-200/60 hover:bg-indigo-200 flex items-center justify-center transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
        aria-expanded={isOpen}
      >
        {isOpen ? <X size={24} className="h-6 w-6 text-indigo-950/80" /> : <Menu size={24} className="h-6 w-6 text-indigo-950/80" />}
      </button>
      {isOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <>
            {/* Overlay full-screen: renderizado en body para que cubra toda la pantalla sin importar el scroll */}
            <div
              className="2xl:hidden fixed inset-0 bg-[#1E1A49]/95 backdrop-blur-md w-full h-full"
              style={{ zIndex: 99999, top: 0, left: 0, right: 0, bottom: 0 }}
            >
              <div className="absolute top-4 right-4">
                <button
                  onClick={() => setIsOpen(false)}
                  className="h-12 w-12 rounded-full bg-indigo-200/60 hover:bg-indigo-200 flex items-center justify-center transition-colors"
                  aria-label="Close menu"
                >
                  <X size={24} className="h-6 w-6 text-indigo-950/80" />
                </button>
              </div>

              <div className="flex flex-col items-center justify-center h-full px-4">
                <nav className="space-y-6 text-center">
                  {siteConfig.navigation.map((item, index) => {
                    const isActive = item.href === pathname;
                    const isDisabled = item.href === '#';
                    return (
                      <Link
                        key={`${item.navKey}-${index}`}
                        href={item.href}
                        prefetch={false}
                        onClick={(e) => {
                          if (isDisabled) {
                            e.preventDefault();
                          } else {
                            setIsOpen(false);
                            if (item.navKey === 'programs' || item.navKey === 'tools') {
                              track('cta_click', {
                                cta: item.navKey,
                                location: 'navbar_mobile',
                              });
                            }
                          }
                        }}
                        className={cn(
                          'block text-2xl md:text-3xl font-medium transition-colors',
                          isActive
                            ? 'text-white'
                            : isDisabled
                            ? 'text-[#E1E6FD]/50 cursor-not-allowed'
                            : 'text-[#E1E6FD] hover:text-white'
                        )}
                      >
                        {t(item.navKey)}
                      </Link>
                    );
                  })}
                  <a
                    href={siteConfig.cta.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block mt-8"
                    onClick={() => setIsOpen(false)}
                  >
                    <Button variant="primary" className={contactBtnClass + ' text-lg md:text-xl px-8 py-3 rounded-full'}>
                      {t(siteConfig.cta.navKey)}
                    </Button>
                  </a>
                </nav>
              </div>
            </div>
          </>,
          document.body
        )}
    </>
  );
}
