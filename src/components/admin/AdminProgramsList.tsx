'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { AddProgramButton } from '@/components/programas/AddProgramButton';
import { CreateProgramModal } from '@/components/programas/CreateProgramModal';
import { Edit, Trash2 } from 'lucide-react';

interface Program {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  content: string[];
  imageUrl: string;
  info: {
    date: string;
    time: string;
    location: string;
    instructor: string;
    duration: string;
    level: string;
    includes: string;
  };
  status: 'published' | 'draft';
  order: number;
}

export function AdminProgramsList() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [programToEdit, setProgramToEdit] = useState<Program | null>(null);

  const fetchPrograms = async () => {
    try {
      const response = await fetch('/api/admin/programas');
      if (response.ok) {
        const data = await response.json();
        setPrograms(data);
      }
    } catch (error) {
      console.error('Error fetching programs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  const handleEdit = (program: Program) => {
    setProgramToEdit(program);
    setIsModalOpen(true);
  };

  const handleDelete = async (program: Program) => {
    if (
      !confirm(
        `¿Estás seguro de que quieres eliminar "${program.title}"? Esta acción no se puede deshacer.`
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/programas/${program._id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al eliminar programa');
      }

      // Refrescar lista
      fetchPrograms();
    } catch (error: any) {
      console.error('Error deleting program:', error);
      alert(error.message || 'Error al eliminar programa');
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setProgramToEdit(null);
  };

  if (isLoading) {
    return <div className="text-center py-8">Cargando...</div>;
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-[#1D194C]/70">
          {programs.length} programa{programs.length !== 1 ? 's' : ''} en total
        </p>
        <AddProgramButton
          onClick={() => {
            setProgramToEdit(null);
            setIsModalOpen(true);
          }}
        />
      </div>

      {/* Lista de programas */}
      <div className="space-y-4">
        {programs.map((program) => (
          <div
            key={program._id}
            className="bg-white rounded-xl p-6 shadow-md border border-[#1D194C]/10 flex items-center justify-between"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl font-tech font-extrabold text-[#1D194C]">
                  {program.title}
                </h3>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    program.status === 'published'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {program.status === 'published' ? 'Publicado' : 'Borrador'}
                </span>
                <span className="text-sm text-[#1D194C]/60">Orden: {program.order}</span>
              </div>
              <p className="text-[#1D194C]/70">{program.shortDescription}</p>
              <Link
                href={`/programas/${program.slug}`}
                className="text-sm text-[#6F74C9] hover:underline mt-2 inline-block"
              >
                Ver detalle →
              </Link>
            </div>
            <div className="flex gap-2 ml-4">
              <button
                onClick={() => handleEdit(program)}
                className="w-10 h-10 rounded-full bg-[#1D194C]/10 hover:bg-[#1D194C]/20 flex items-center justify-center transition-colors"
                aria-label={`Editar programa: ${program.title}`}
              >
                <Edit size={18} className="text-[#1D194C]" />
              </button>
              <button
                onClick={() => handleDelete(program)}
                className="w-10 h-10 rounded-full bg-red-100 hover:bg-red-200 flex items-center justify-center transition-colors"
                aria-label={`Eliminar programa: ${program.title}`}
              >
                <Trash2 size={18} className="text-red-600" />
              </button>
            </div>
          </div>
        ))}

        {programs.length === 0 && (
          <div className="text-center py-12 text-[#1D194C]/60">
            <p>No hay programas aún. Crea el primero usando el botón +</p>
          </div>
        )}
      </div>

      {/* Modal */}
      <CreateProgramModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={() => {
          fetchPrograms();
        }}
        programToEdit={programToEdit}
      />
    </>
  );
}
