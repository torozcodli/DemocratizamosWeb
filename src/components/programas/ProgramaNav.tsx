import Link from 'next/link';
import type { Programa } from '@/data/programas';

interface ProgramaNavProps {
  currentSlug: string;
  previousPrograma: Programa | null;
  nextPrograma: Programa | null;
}

export function ProgramaNav({ currentSlug, previousPrograma, nextPrograma }: ProgramaNavProps) {
  return (
    <nav
      className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 pt-8 sm:pt-12"
      aria-label="Navegación entre programas"
    >
      {/* Anterior */}
      <div className="flex-1 w-full sm:w-auto text-center sm:text-left">
        {previousPrograma ? (
          <Link
            href={`/programas/${previousPrograma.slug}`}
            className="text-[#1D194C] hover:text-[#6F74C9] transition-colors font-medium text-base sm:text-lg inline-flex items-center gap-2"
            aria-label={`Ir al programa anterior: ${previousPrograma.title}`}
          >
            <span>←</span>
            <span>Anterior</span>
          </Link>
        ) : (
          <span
            className="text-[#1D194C]/40 cursor-not-allowed font-medium text-base sm:text-lg inline-flex items-center gap-2"
            aria-label="No hay programa anterior"
          >
            <span>←</span>
            <span>Anterior</span>
          </span>
        )}
      </div>

      {/* Ver todos */}
      <div className="flex-1 w-full sm:w-auto text-center">
        <Link
          href="/programas"
          className="text-[#1D194C] hover:text-[#6F74C9] transition-colors font-medium text-base sm:text-lg"
          aria-label="Ver todos los proyectos"
        >
          Ver todos los proyectos
        </Link>
      </div>

      {/* Siguiente */}
      <div className="flex-1 w-full sm:w-auto text-center sm:text-right">
        {nextPrograma ? (
          <Link
            href={`/programas/${nextPrograma.slug}`}
            className="text-[#1D194C] hover:text-[#6F74C9] transition-colors font-medium text-base sm:text-lg inline-flex items-center gap-2"
            aria-label={`Ir al programa siguiente: ${nextPrograma.title}`}
          >
            <span>Siguiente</span>
            <span>→</span>
          </Link>
        ) : (
          <span
            className="text-[#1D194C]/40 cursor-not-allowed font-medium text-base sm:text-lg inline-flex items-center gap-2"
            aria-label="No hay programa siguiente"
          >
            <span>Siguiente</span>
            <span>→</span>
          </span>
        )}
      </div>
    </nav>
  );
}
