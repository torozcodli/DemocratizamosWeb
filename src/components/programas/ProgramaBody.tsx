import Link from 'next/link';
import type { Programa } from '@/data/programas';

interface ProgramaBodyProps {
  programa: Programa;
}

export function ProgramaBody({ programa }: ProgramaBodyProps) {
  const ctaText = programa.ctaText || 'Reserva mi lugar';
  const ctaHref = programa.ctaHref || 'https://wa.me/+5216145871758';

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Título */}
      <h1 className="text-[#1D194C] font-tech font-extrabold text-4xl sm:text-5xl lg:text-6xl leading-tight">
        {programa.title}
      </h1>

      {/* Descripción larga - párrafos */}
      <div className="space-y-4 sm:space-y-5">
        {programa.content.map((paragraph, index) => (
          <p
            key={index}
            className="text-[#1D194C]/80 leading-relaxed text-base sm:text-lg"
          >
            {paragraph}
          </p>
        ))}
      </div>

      {/* Botón CTA */}
      <div className="pt-4">
        <Link
          href={ctaHref}
          target={ctaHref.startsWith('http') ? '_blank' : undefined}
          rel={ctaHref.startsWith('http') ? 'noopener noreferrer' : undefined}
          className="inline-block rounded-full px-8 py-4 bg-[#E68956] text-white font-semibold text-lg hover:bg-[#D67A45] transition-colors shadow-lg hover:shadow-xl"
          aria-label={`${ctaText} - ${programa.title}`}
        >
          {ctaText}
        </Link>
      </div>
    </div>
  );
}
