'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { CreateToolModal } from '@/components/herramientas/CreateToolModal';
import { Edit, Trash2, Plus } from 'lucide-react';

/** Admin API devuelve docs con title/description/content como { es, en? } o string legacy. */
function toDisplayString(v: string | { es: string; en?: string } | undefined): string {
  if (v == null) return '';
  if (typeof v === 'string') return v;
  return (v as { es?: string }).es ?? '';
}

interface Tool {
  _id: string;
  title: string | { es: string; en?: string };
  slug: string;
  imageUrl: string;
  description: string | { es: string; en?: string };
  content: string | { es: string; en?: string };
  date: string;
  isPublished: boolean;
  createdAt: string;
}

export function AdminToolsList() {
  const t = useTranslations('admin');
  const [tools, setTools] = useState<Tool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toolToEdit, setToolToEdit] = useState<Tool | null>(null);

  const fetchTools = async () => {
    try {
      const response = await fetch('/api/admin/tools');
      if (response.ok) {
        const data = await response.json();
        // Asegurar que _id y createdAt sean strings
        const adaptedData = data.map((t: any) => ({
          ...t,
          _id: t._id?.toString() || t._id,
          createdAt: t.createdAt?.toString() || t.createdAt,
          date: t.date ? new Date(t.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        }));
        setTools(adaptedData);
      }
    } catch (error) {
      console.error('Error fetching tools:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTools();
  }, []);

  const handleEdit = (tool: Tool) => {
    setToolToEdit(tool);
    setIsModalOpen(true);
  };

  const handleDelete = async (tool: Tool) => {
    if (
      !confirm(t('confirmDelete', { name: toDisplayString(tool.title) }))
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/tools/${tool._id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || t('errorDeleteTool'));
      }

      // Refrescar lista
      fetchTools();
    } catch (error: any) {
      console.error('Error deleting tool:', error);
      alert(error.message || t('errorDeleteTool'));
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setToolToEdit(null);
  };

  if (isLoading) {
    return <div className="text-center py-8">{t('loading')}</div>;
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-[#1D194C]/70">
          {tools.length} {tools.length !== 1 ? t('tools') : t('tool')} {t('inTotal')}
        </p>
        <button
          onClick={() => {
            setToolToEdit(null);
            setIsModalOpen(true);
          }}
          className="w-12 h-12 rounded-full bg-[#FF6A00] text-white shadow-lg hover:shadow-xl hover:bg-[#FF7A1A] transition-all flex items-center justify-center"
          aria-label={t('addTool')}
        >
          <Plus size={24} className="text-white" />
        </button>
      </div>

      {/* Lista de herramientas */}
      <div className="space-y-4">
        {tools.map((tool) => (
          <div
            key={tool._id}
            className="bg-white rounded-xl p-6 shadow-md border border-[#1D194C]/10 flex items-center justify-between gap-4"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h3 className="text-xl font-tech font-extrabold text-[#1D194C] truncate">
                  {toDisplayString(tool.title)}
                </h3>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 ${
                    tool.isPublished
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {tool.isPublished ? t('published') : t('draft')}
                </span>
              </div>
              <p className="text-[#1D194C]/70 mb-2 line-clamp-2 break-words overflow-hidden">{toDisplayString(tool.description)}</p>
              <div className="flex items-center gap-4 text-sm text-[#1D194C]/60">
                <span>{new Date(tool.date).toLocaleDateString('es-MX')}</span>
              </div>
              <Link
                href={`/herramientas/${tool.slug}`}
                className="text-sm text-[#6F74C9] hover:underline mt-2 inline-block"
              >
                {t('viewDetail')}
              </Link>
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => handleEdit(tool)}
                className="w-10 h-10 rounded-full bg-[#1D194C]/10 hover:bg-[#1D194C]/20 flex items-center justify-center transition-colors"
                aria-label={`${t('editTool')}: ${toDisplayString(tool.title)}`}
              >
                <Edit size={18} className="text-[#1D194C]" />
              </button>
              <button
                onClick={() => handleDelete(tool)}
                className="w-10 h-10 rounded-full bg-red-100 hover:bg-red-200 flex items-center justify-center transition-colors"
                aria-label={`${t('deleteTool')}: ${toDisplayString(tool.title)}`}
              >
                <Trash2 size={18} className="text-red-600" />
              </button>
            </div>
          </div>
        ))}

        {tools.length === 0 && (
          <div className="text-center py-12 text-[#1D194C]/60">
            <p>{t('emptyTools')}</p>
          </div>
        )}
      </div>

      {/* Modal */}
      <CreateToolModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={() => {
          fetchTools();
        }}
        toolToEdit={toolToEdit}
      />
    </>
  );
}
