'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Calendar } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { ToolCard } from './ToolCard';

interface Tool {
  _id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  imageUrl: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

interface ToolDetailContentProps {
  tool: Tool;
  relatedTools: Tool[];
}

export function ToolDetailContent({ tool, relatedTools }: ToolDetailContentProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Dividir contenido por saltos de línea dobles o simples
  const contentParagraphs = tool.content
    .split(/\n\n+/)
    .map(p => p.trim())
    .filter(p => p.length > 0);

  return (
    <div className="w-full">
      {/* Hero Image */}
      <section className="relative w-full">
        <div className="relative aspect-[21/9] w-full">
          <Image
            src={tool.imageUrl}
            alt={tool.title}
            fill
            className="object-cover"
            sizes="100vw"
            priority
            unoptimized={tool.imageUrl.startsWith('/images/') || tool.imageUrl.startsWith('/')}
          />
          {/* Overlay degradado inferior */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1D194C]/60 via-transparent to-transparent pointer-events-none"></div>
        </div>
      </section>

      {/* Línea naranja brillante entre imagen y contenido */}
      <div className="w-full h-1 bg-[#E68956]"></div>

      {/* Contenido */}
      <Container>
        <div className="py-8 sm:py-12 lg:py-16">
          {/* Botón Regresar */}
          <Link
            href="/herramientas"
            prefetch={false}
            className="inline-flex items-center gap-2 text-[#1D194C] hover:text-[#6F74C9] transition-colors mb-8"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Regresar</span>
          </Link>

          {/* Título */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-tech font-extrabold text-[#1D194C] mb-6 text-center">
            {tool.title}
          </h1>

          {/* Meta info - Solo fecha */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-[#1D194C]/60 mb-8">
            <div className="flex items-center gap-1">
              <Calendar size={16} />
              <span>{formatDate(tool.date)}</span>
            </div>
          </div>

          {/* Descripción como resumen */}
          {tool.description && (
            <div className="max-w-3xl mx-auto mb-12">
              <p className="text-lg sm:text-xl text-[#1D194C]/80 leading-relaxed text-center italic">
                {tool.description}
              </p>
            </div>
          )}

          {/* Separador */}
          <div className="flex items-center justify-center mb-12 pb-8 border-b border-[#1D194C]/40">
            {/* Línea horizontal fina */}
          </div>

          {/* Contenido */}
          <div className="max-w-3xl mx-auto prose prose-lg">
            {contentParagraphs.length > 0 ? (
              contentParagraphs.map((paragraph, index) => (
                <p
                  key={index}
                  className="text-[#1D194C]/80 leading-relaxed mb-6 text-base sm:text-lg"
                >
                  {paragraph}
                </p>
              ))
            ) : (
              <p className="text-[#1D194C]/80 leading-relaxed mb-6 text-base sm:text-lg">
                {tool.content}
              </p>
            )}
          </div>

          {/* Herramientas relacionadas */}
          {relatedTools.length > 0 && (
            <section className="mt-16 pt-12 border-t border-[#1D194C]/40">
              <h2 className="text-2xl sm:text-3xl font-tech font-extrabold text-[#1D194C] mb-8">
                Herramientas relacionadas
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {relatedTools.map((relatedTool) => (
                  <ToolCard key={relatedTool._id} tool={relatedTool} />
                ))}
              </div>
            </section>
          )}
        </div>
      </Container>
    </div>
  );
}
