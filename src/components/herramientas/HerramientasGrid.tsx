'use client';

import { Container } from '@/components/ui/Container';
import { ToolCard } from './ToolCard';

interface Tool {
  _id: string;
  title: string;
  slug: string;
  imageUrl: string;
  description: string;
  date: string;
}

interface HerramientasGridProps {
  tools: Tool[];
}

export function HerramientasGrid({ tools }: HerramientasGridProps) {
  return (
    <section className="w-full py-14 md:py-16 bg-gradient-to-b from-[#1E1A49] to-[#2A2566]">
      <Container>
        {/* Título */}
        <h2 className="text-center text-3xl sm:text-4xl lg:text-5xl font-tech font-extrabold text-white mb-12">
          Herramientas que te acercan a tus{' '}
          <span className="text-[#E68956]">metas</span>
        </h2>

        {/* Grid de cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {tools.map((tool) => (
            <ToolCard key={tool._id} tool={tool} />
          ))}
        </div>
      </Container>
    </section>
  );
}
