'use client';

import { useState, useEffect } from 'react';
import { Session } from 'next-auth';
import { Container } from '@/components/ui/Container';
import { ToolCard } from './ToolCard';
import Link from 'next/link';
import { Plus } from 'lucide-react';

interface Tool {
  _id: string;
  title: string;
  slug: string;
  imageUrl: string;
  description: string;
  content: string;
  date: string;
  isPublished: boolean;
}

interface HerramientasPageContentProps {
  session: Session | null;
}

export function HerramientasPageContent({ session }: HerramientasPageContentProps) {
  const [tools, setTools] = useState<Tool[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTools();
  }, []);

  const fetchTools = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/tools', {
        cache: 'no-store',
      });
      
      if (response.ok) {
        const data = await response.json();
        // Asegurar que _id y date sean strings
        const adaptedData = data.map((t: any) => ({
          ...t,
          _id: t._id?.toString() || t._id,
          date: t.date ? new Date(t.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          isPublished: t.isPublished !== undefined ? t.isPublished : true,
        }));
        setTools(adaptedData);
      }
    } catch (error) {
      console.error('Error fetching tools:', error);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <section className="w-full py-14 md:py-16 bg-gradient-to-b from-[#1E1A49] to-[#2A2566]">
      <Container>
        {/* Título */}
        <h2 className="text-center text-3xl sm:text-4xl lg:text-5xl font-tech font-extrabold text-white mb-12">
          Herramientas que te acercan a tus{' '}
          <span className="text-[#E68956]">metas</span>
        </h2>

        {/* Grid de cards */}
        {isLoading ? (
          <div className="text-center py-12 text-white/60">
            <p>Cargando herramientas...</p>
          </div>
        ) : tools.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {tools.map((tool) => (
              <ToolCard
                key={tool._id}
                tool={tool}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-white/60">
            <p>No hay herramientas disponibles</p>
          </div>
        )}

        {/* Botón + para admin */}
        {session?.user?.isAdmin && (
          <div className="flex justify-center mt-8">
            <Link
              href="/admin/herramientas"
              className="w-12 h-12 rounded-full bg-[#FF6A00] text-white shadow-lg hover:shadow-xl hover:bg-[#FF7A1A] transition-all flex items-center justify-center"
              aria-label="Administrar herramientas"
            >
              <Plus size={24} className="text-white" />
            </Link>
          </div>
        )}
      </Container>
    </section>
  );
}
