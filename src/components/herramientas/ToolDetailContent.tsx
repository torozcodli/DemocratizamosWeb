import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock } from 'lucide-react';
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
      {/* Hero con imagen blur y card flotante */}
      <section className="relative w-full h-[320px] md:h-[420px] lg:h-[520px] overflow-hidden">
        {/* Background image con blur */}
        <div className="absolute inset-0 z-0">
          <Image
            src={tool.imageUrl}
            alt={tool.title}
            fill
            className="object-cover"
            sizes="100vw"
            priority
            unoptimized={tool.imageUrl.startsWith('/images/') || tool.imageUrl.startsWith('/')}
            style={{
              filter: 'blur(14px)',
              transform: 'scale(1.1)',
              opacity: 0.65,
            }}
          />
        </div>

        {/* Overlay gradiente navy */}
        <div 
          className="absolute inset-0 z-10"
          style={{
            background: 'linear-gradient(90deg, rgba(17,18,61,0.75) 0%, rgba(17,18,61,0.65) 50%, rgba(17,18,61,0.75) 100%)',
          }}
        />

        {/* Card flotante */}
        <div className="absolute left-1/2 top-[55%] -translate-x-1/2 -translate-y-1/2 z-20 w-[92%] max-w-[980px] min-h-[220px] rounded-3xl shadow-xl overflow-hidden bg-white">
          <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
            {/* Columna izquierda - Info */}
            <div className="bg-[#484A88] p-8 lg:p-10 flex flex-col justify-between">
              {/* Meta info */}
              <div className="flex items-center gap-4 text-sm text-white/80 mb-4">
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  <span>{formatDate(tool.date)}</span>
                </div>
                <span className="text-white/40">•</span>
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  <span>— min</span>
                </div>
              </div>

              {/* Título */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-tech font-extrabold text-[#E68956] mb-4">
                {tool.title}
              </h1>

              {/* Resumen */}
              {tool.description && (
                <p className="text-white/90 text-sm sm:text-base leading-relaxed line-clamp-3 mb-6">
                  {tool.description}
                </p>
              )}

              {/* Divider */}
              <div className="border-t border-white/20 pt-4 mt-auto">
                {/* Espacio para futuro autor si se agrega */}
              </div>
            </div>

            {/* Columna derecha - Imagen nítida */}
            <div className="relative bg-white overflow-hidden border-l border-[#1D194C]/10 lg:border-l">
              <Image
                src={tool.imageUrl}
                alt={tool.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                unoptimized={tool.imageUrl.startsWith('/images/') || tool.imageUrl.startsWith('/')}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contenido principal con fondo morado */}
      <div className="w-full py-12 sm:py-16 lg:py-20 bg-[#E7E9FF] relative overflow-hidden">
        {/* Círculo decorativo - parte del fondo */}
        <div className="absolute top-[-80px] right-[-200px] w-[800px] h-[800px] bg-[#e1cef2] z-0 rounded-full pointer-events-none" />
        <Container className="relative z-10">
          {/* Link Regresar */}
          <Link
            href="/herramientas"
            prefetch={false}
            className="inline-block text-[#1D194C] hover:text-[#6F74C9] transition-colors mb-8 underline hover:no-underline text-sm"
          >
            ← Regresar a Herramientas
          </Link>

          {/* Separador */}
          <div className="max-w-4xl mx-auto border-t border-[#1D194C]/20 mb-12" />

          {/* Contenido largo */}
          <div className="max-w-4xl mx-auto px-4 md:px-8">
            <div className="space-y-4">
              {contentParagraphs.length > 0 ? (
                contentParagraphs.map((paragraph, index) => (
                  <p
                    key={index}
                    className="text-[#1D194C]/80 leading-relaxed text-base sm:text-lg"
                  >
                    {paragraph}
                  </p>
                ))
              ) : (
                <p className="text-[#1D194C]/80 leading-relaxed text-base sm:text-lg">
                  {tool.content}
                </p>
              )}
            </div>
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
        </Container>
      </div>
    </div>
  );
}
