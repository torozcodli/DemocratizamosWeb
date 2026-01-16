'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { AddBlogButton } from '@/components/blog/AddBlogButton';
import { CreateBlogModal } from '@/components/blog/CreateBlogModal';
import { Edit, Trash2, Heart } from 'lucide-react';

interface Post {
  _id: string;
  title: string;
  slug: string;
  imageUrl: string;
  excerpt: string;
  authorName: string;
  readTime: string;
  likes: number;
  content: string[];
  status: 'published' | 'draft';
  createdAt: string;
}

export function AdminBlogsList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [postToEdit, setPostToEdit] = useState<Post | null>(null);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/admin/blog');
      if (response.ok) {
        const data = await response.json();
        // Asegurar que _id y createdAt sean strings
        const adaptedData = data.map((p: any) => ({
          ...p,
          _id: p._id?.toString() || p._id,
          createdAt: p.createdAt?.toString() || p.createdAt,
        }));
        setPosts(adaptedData);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleEdit = (post: Post) => {
    setPostToEdit(post);
    setIsModalOpen(true);
  };

  const handleDelete = async (post: Post) => {
    if (
      !confirm(
        `¿Estás seguro de que quieres eliminar "${post.title}"? Esta acción no se puede deshacer.`
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/blog/${post._id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al eliminar post');
      }

      // Refrescar lista
      fetchPosts();
    } catch (error: any) {
      console.error('Error deleting post:', error);
      alert(error.message || 'Error al eliminar post');
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setPostToEdit(null);
  };

  if (isLoading) {
    return <div className="text-center py-8">Cargando...</div>;
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-[#1D194C]/70">
          {posts.length} post{posts.length !== 1 ? 's' : ''} en total
        </p>
        <AddBlogButton
          onClick={() => {
            setPostToEdit(null);
            setIsModalOpen(true);
          }}
        />
      </div>

      {/* Lista de posts */}
      <div className="space-y-4">
        {posts.map((post) => (
          <div
            key={post._id}
            className="bg-white rounded-xl p-6 shadow-md border border-[#1D194C]/10 flex items-center justify-between gap-4"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h3 className="text-xl font-tech font-extrabold text-[#1D194C] truncate">
                  {post.title}
                </h3>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 ${
                    post.status === 'published'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {post.status === 'published' ? 'Publicado' : 'Borrador'}
                </span>
                <div className="flex items-center gap-1 text-sm text-[#1D194C]/60 shrink-0">
                  <Heart size={14} />
                  <span>{post.likes}</span>
                </div>
              </div>
              <p className="text-[#1D194C]/70 mb-2 line-clamp-2 break-words overflow-hidden">{post.excerpt}</p>
              <div className="flex items-center gap-4 text-sm text-[#1D194C]/60">
                <span>Por {post.authorName}</span>
                <span>•</span>
                <span>{post.readTime}</span>
              </div>
              <Link
                href={`/blog/${post.slug}`}
                className="text-sm text-[#6F74C9] hover:underline mt-2 inline-block"
              >
                Ver detalle →
              </Link>
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => handleEdit(post)}
                className="w-10 h-10 rounded-full bg-[#1D194C]/10 hover:bg-[#1D194C]/20 flex items-center justify-center transition-colors"
                aria-label={`Editar post: ${post.title}`}
              >
                <Edit size={18} className="text-[#1D194C]" />
              </button>
              <button
                onClick={() => handleDelete(post)}
                className="w-10 h-10 rounded-full bg-red-100 hover:bg-red-200 flex items-center justify-center transition-colors"
                aria-label={`Eliminar post: ${post.title}`}
              >
                <Trash2 size={18} className="text-red-600" />
              </button>
            </div>
          </div>
        ))}

        {posts.length === 0 && (
          <div className="text-center py-12 text-[#1D194C]/60">
            <p>No hay posts aún. Crea el primero usando el botón +</p>
          </div>
        )}
      </div>

      {/* Modal */}
      <CreateBlogModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={() => {
          fetchPosts();
        }}
        postToEdit={postToEdit}
      />
    </>
  );
}
