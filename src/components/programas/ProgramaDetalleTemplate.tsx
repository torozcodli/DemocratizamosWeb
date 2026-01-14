import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { ProgramaHero } from './ProgramaHero';
import { ProgramaInfoCard } from './ProgramaInfoCard';
import { ProgramaBody } from './ProgramaBody';
import type { Programa } from '@/data/programas';

interface ProgramaDetalleTemplateProps {
  programa: Programa;
  previousPrograma: Programa | null;
  nextPrograma: Programa | null;
}

/**
 * Plantilla reutilizable para la página de detalle de programas
 * 
 * Este componente es completamente independiente de la fuente de datos.
 * Solo recibe props y renderiza el diseño.
 * 
 * En el futuro, cuando venga BD, solo cambiamos cómo obtenemos los datos
 * pero este template se mantiene igual.
 */
export function ProgramaDetalleTemplate({
  programa,
  previousPrograma,
  nextPrograma,
}: ProgramaDetalleTemplateProps) {
  return (
    <div className="w-full bg-[#E7E9FF] min-h-screen">
      {/* Hero Section - Imagen grande expandida */}
      <ProgramaHero programa={programa} />

      {/* Contenido Principal */}
      <section className="relative w-full pb-12 sm:pb-16 lg:pb-20">
        <Container>
          {/* Grid de 2 columnas en desktop, stack en mobile */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16">
            {/* Columna Izquierda: Info Card */}
            <div className="order-1 lg:order-1">
              <ProgramaInfoCard programa={programa} />
            </div>

            {/* Columna Derecha: Texto del programa */}
            <div className="order-2 lg:order-2 relative">
              <ProgramaBody programa={programa} />
              
              {/* Línea decorativa posicionada manualmente - abajo a la izquierda */}
              <div className="absolute -left-[30rem] sm:-left-[34rem] md:-left-[38rem] lg:-left-[46rem] xl:-left-[54rem] bottom-0 flex items-center -translate-y-2 sm:-translate-y-3">
                {/* Línea horizontal */}
                <div className="h-0.5 bg-[#1D194C]/70 w-48 sm:w-64 md:w-80 lg:w-96 xl:w-[28rem]"></div>
                
                {/* Círculo con efecto de sombra/difusión */}
                <div className="relative -ml-1 flex items-center justify-center">
                  {/* Círculo exterior con borde/outline */}
                  <div className="absolute w-7 h-7 rounded-full border border-[#1D194C]/50"></div>
                  {/* Círculo medio (glow/difusión) */}
                  <div className="absolute w-6 h-6 rounded-full bg-[#1D194C]/20 blur-[2px]"></div>
                  {/* Círculo interior sólido */}
                  <div className="relative w-3.5 h-3.5 rounded-full bg-[#1D194C]/80"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Elementos decorativos */}
          <div className="relative mt-12 sm:mt-16 lg:mt-20">
            {/* Pixel blocks decorativos (derecha, arriba) */}
            <div className="hidden lg:block absolute right-8 top-0 z-0 opacity-60">
              <Image
                src="/solar/icons/pixel-squares-orange.svg"
                alt=""
                width={120}
                height={60}
                className="object-contain"
                aria-hidden="true"
              />
            </div>
          </div>

          {/* Navegación inferior */}
          <div className="relative mt-12 sm:mt-16 lg:mt-20">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
              {/* Anterior */}
              <div className="flex-1 w-full sm:w-auto text-center sm:text-left">
                {previousPrograma ? (
                  <Link
                    href={`/programas/${previousPrograma.slug}`}
                    className="text-[#1D194C] hover:text-[#6F74C9] transition-colors font-medium text-sm sm:text-base inline-flex items-center gap-2"
                    aria-label={`Ir al programa anterior: ${previousPrograma.title}`}
                  >
                    <span>←</span>
                    <span>Anterior</span>
                  </Link>
                ) : (
                  <span
                    className="text-[#1D194C]/40 cursor-not-allowed font-medium text-sm sm:text-base inline-flex items-center gap-2"
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
                  className="text-[#1D194C] hover:text-[#6F74C9] transition-colors font-medium text-sm sm:text-base"
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
                    className="text-[#1D194C] hover:text-[#6F74C9] transition-colors font-medium text-sm sm:text-base inline-flex items-center gap-2"
                    aria-label={`Ir al programa siguiente: ${nextPrograma.title}`}
                  >
                    <span>Siguiente</span>
                    <span>→</span>
                  </Link>
                ) : (
                  <span
                    className="text-[#1D194C]/40 cursor-not-allowed font-medium text-sm sm:text-base inline-flex items-center gap-2"
                    aria-label="No hay programa siguiente"
                  >
                    <span>Siguiente</span>
                    <span>→</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
