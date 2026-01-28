'use client';

import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { siteConfig } from '@/config/site';
import { Facebook, Instagram, Linkedin, Mail, Phone } from 'lucide-react';
import Image from 'next/image';
import { track } from '@/lib/analytics';
// import { useState } from 'react'; // Deshabilitado - newsletter desactivado

// Simple TikTok icon component
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M19.59 9.23a5.5 5.5 0 0 1-1.45-3.89v-4.5h-3.26a7.51 7.51 0 0 1 .14 1.59 5.15 5.15 0 0 1-2.86 4.83v-3.22a8.41 8.41 0 0 0-1-.05 8.27 8.27 0 0 0-8.27 8.27c0 .34 0 .67.05 1a8.27 8.27 0 0 1-4.64-1.42l.01 3.22a11.2 11.2 0 0 0 6.29 1.84 11.19 11.19 0 0 0 10.76-8.13v-7.27a13.76 13.76 0 0 0 4.41-.61v-3.4z" />
    </svg>
  );
}

export function Footer() {
  const currentYear = new Date().getFullYear();
  // Newsletter deshabilitado
  // const [email, setEmail] = useState('');

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   // Placeholder - no real submission logic
  //   console.log('Newsletter submission:', email);
  //   setEmail('');
  // };

  return (
    <footer className="relative bg-gradient-to-r from-[#090828] to-[#1D194C] text-[#E1E6FD] pt-20 pb-16 sm:pt-24 sm:pb-20 md:pt-28 md:pb-24">
      {/* Floating circular logo badge */}
      <div className="pointer-events-none absolute left-1/2 -top-12 sm:-top-14 md:-top-16 -translate-x-1/2 w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 lg:w-44 lg:h-44 z-10">
        <img
          src="/solar/icons/Demoinnlogo.svg"
          alt="Demoinn Logo"
          className="w-full h-full object-contain"
          draggable={false}
        />
      </div>

      <Container>
        <div className="grid gap-8 sm:gap-10 md:gap-12 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-[1.1fr_1.6fr_.75fr] xl:gap-x-16 xl:gap-y-0 items-start">
          {/* Column 1: Branding */}
          <div className="space-y-4 sm:col-span-2 md:col-span-1">
            <div className="w-full max-w-[200px] sm:max-w-[220px] md:max-w-[240px]">
              <Image
                src="/solar/icons/DemoinnBlanco.svg"
                alt="Demoinn Logo"
                width={240}
                height={240}
                className="object-contain w-full h-auto"
                style={{ width: 'auto', height: 'auto' }}
              />
            </div>
          </div>

          {/* Column 2: Social Media & Contact — más ancho para que el correo no se corte */}
          <div className="space-y-6 sm:space-y-8 min-w-0 xl:min-w-[320px]">
            <div>
              <h4 className="font-semibold text-[#E1E6FD] mb-4 sm:mb-6 text-base sm:text-lg">Redes sociales</h4>
              <div className="flex gap-3 sm:gap-4">
                <a
                  href={siteConfig.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 sm:w-8 sm:h-8 rounded-full border border-[#E1E6FD] flex items-center justify-center text-[#E1E6FD] hover:bg-white/10 transition-colors active:bg-white/20"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={16} className="sm:w-[14px] sm:h-[14px]" />
                </a>
                <a
                  href={siteConfig.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 sm:w-8 sm:h-8 rounded-full border border-[#E1E6FD] flex items-center justify-center text-[#E1E6FD] hover:bg-white/10 transition-colors active:bg-white/20"
                  aria-label="Instagram"
                >
                  <Instagram size={16} className="sm:w-[14px] sm:h-[14px]" />
                </a>
                <a
                  href={siteConfig.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 sm:w-8 sm:h-8 rounded-full border border-[#E1E6FD] flex items-center justify-center text-[#E1E6FD] hover:bg-white/10 transition-colors active:bg-white/20"
                  aria-label="Facebook"
                >
                  <Facebook size={16} className="sm:w-[14px] sm:h-[14px]" />
                </a>
              </div>
            </div>
            <div className="space-y-3 sm:space-y-4">
              <a
                href={`tel:${siteConfig.phone}`}
                className="flex items-center gap-2 text-sm sm:text-base text-[#E1E6FD] hover:text-white transition-colors active:text-white/80"
              >
                <Phone size={18} className="sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="break-all">{siteConfig.phone}</span>
              </a>
              <a
                href={`mailto:${siteConfig.email}`}
                className="flex items-center gap-2 text-sm sm:text-base text-[#E1E6FD] hover:text-white transition-colors active:text-white/80"
              >
                <Mail size={18} className="sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="break-all">{siteConfig.email}</span>
              </a>
            </div>
          </div>

          {/* Column 3: Explorar */}
          <div className="sm:col-start-1 sm:row-start-2 md:col-start-3 md:row-start-1">
            <h4 className="font-semibold text-[#E1E6FD] mb-4 sm:mb-6 text-base sm:text-lg">Explorar</h4>
            <ul className="space-y-3 sm:space-y-4">
              <li>
                <Link
                  href="/inicio"
                  onClick={() => {
                    track('footer_click', {
                      item: 'inicio',
                    });
                  }}
                  className="text-sm sm:text-base text-[#E1E6FD] hover:underline transition-colors active:text-white/80"
                >
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  href="/nosotros"
                  onClick={() => {
                    track('footer_click', {
                      item: 'nosotros',
                    });
                  }}
                  className="text-sm sm:text-base text-[#E1E6FD] hover:underline transition-colors active:text-white/80"
                >
                  Nosotros
                </Link>
              </li>
              <li>
                <Link
                  href="/programas"
                  onClick={() => {
                    track('footer_click', {
                      item: 'programas',
                    });
                  }}
                  className="text-sm sm:text-base text-[#E1E6FD] hover:underline transition-colors active:text-white/80"
                >
                  Programas
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  onClick={() => {
                    track('footer_click', {
                      item: 'blog',
                    });
                  }}
                  className="text-sm sm:text-base text-[#E1E6FD] hover:underline transition-colors active:text-white/80"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/herramientas"
                  onClick={() => {
                    track('footer_click', {
                      item: 'herramientas',
                    });
                  }}
                  className="text-sm sm:text-base text-[#E1E6FD] hover:underline transition-colors active:text-white/80"
                >
                  Herramientas
                </Link>
              </li>
              <li>
                <a
                  href="https://wa.me/+5216145871758"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    track('footer_click', {
                      item: 'contactanos',
                    });
                  }}
                  className="text-sm sm:text-base text-[#E1E6FD] hover:underline transition-colors active:text-white/80"
                >
                  Contáctanos
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter - Deshabilitado */}
          {/* <div className="w-full lg:justify-self-end lg:max-w-[520px]">
            <h4 className="font-semibold text-[#EFBE9F] mb-6 text-xl">
              ¡Déjanos tu correo y te escribimos en breve!
            </h4>
            <form onSubmit={handleSubmit} className="w-full">
              <div className="flex items-center h-14 sm:h-16 rounded-full border-2 border-[#AAB3FF] bg-[#6D73B3]/35 overflow-hidden w-full">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tucorreoaquí@correo.com"
                  className="flex-1 bg-transparent px-6 outline-none placeholder:text-[#E1E6FD]/35 text-[#E1E6FD]/80 text-sm sm:text-base h-full min-w-0"
                  aria-label="Email para newsletter"
                />
                <button
                  type="submit"
                  className="h-full px-6 sm:px-8 flex-shrink-0 rounded-full bg-[#E79A5A] text-white font-bold text-sm sm:text-base tracking-wide hover:bg-[#E79A5A]/90 transition-colors whitespace-nowrap"
                >
                  ENVIAR
                </button>
              </div>
            </form>
          </div> */}
        </div>
      </Container>

      {/* Separator line with circular node - Full width */}
      <div className="mt-8 sm:mt-10 md:mt-10 w-full h-12 sm:h-16 md:h-20 lg:h-24">
        <Image
          src="/solar/icons/footerLine.svg"
          alt="Footer separator line"
          width={1867}
          height={105}
          className="w-full h-full object-contain object-left"
        />
      </div>

      <Container>
        {/* Copyright */}
        <div className="mt-6 sm:mt-8 md:mt-8 text-center text-xs sm:text-sm text-[#E1E6FD]/70 space-y-2">
          <Link
            href="/aviso-de-privacidad"
            onClick={() => {
              track('footer_click', {
                item: 'aviso_privacidad',
              });
            }}
            className="text-[#E1E6FD]/70 hover:text-[#E1E6FD] hover:underline transition-colors inline-block"
          >
            Aviso de privacidad
          </Link>
          <p>© {currentYear}. Todos los derechos reservados</p>
        </div>
      </Container>
    </footer>
  );
}
