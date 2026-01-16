'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Upload } from 'lucide-react';
import { createPostSchema, type CreatePostInput } from '@/modules/posts/validation/post.validation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

interface Post {
  _id: string;
  title: string;
  slug: string;
  imageUrl: string;
  readTime: string;
  authorName: string;
  content: string[];
  status: 'published' | 'draft';
}

interface CreateBlogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  postToEdit?: Post | null;
}

export function CreateBlogModal({
  isOpen,
  onClose,
  onSuccess,
  postToEdit,
}: CreateBlogModalProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>('');
  const [manualImageUrl, setManualImageUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEditMode = !!postToEdit;

  // Schema para edición: imageUrl opcional
  const editPostSchema = createPostSchema.omit({ imageUrl: true }).passthrough();

  type FormInput = {
    title: string;
    readTime: string;
    authorName?: string;
    content: string; // Siempre string en el formulario
    imageUrl?: string;
    status: 'published' | 'draft';
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
    clearErrors,
    trigger,
    unregister,
  } = useForm<FormInput>({
    resolver: isEditMode 
      ? zodResolver(editPostSchema) as any
      : zodResolver(createPostSchema) as any,
    mode: 'onSubmit',
    defaultValues: postToEdit
      ? {
          title: postToEdit.title,
          readTime: postToEdit.readTime,
          authorName: postToEdit.authorName,
          content: postToEdit.content.join('\n\n'),
          status: postToEdit.status,
        } as FormInput
      : {
        status: 'published',
        authorName: session?.user?.name || session?.user?.email?.split('@')[0] || '',
        content: '',
      },
  });

  // Cargar datos del post a editar cuando se abre el modal
  useEffect(() => {
    if (isOpen && postToEdit) {
      unregister('imageUrl');
      reset({
        title: postToEdit.title,
        readTime: postToEdit.readTime,
        authorName: postToEdit.authorName,
        content: postToEdit.content.join('\n\n'),
        status: postToEdit.status,
      });
      setImagePreview(postToEdit.imageUrl);
      setUploadedImageUrl('');
      setManualImageUrl(postToEdit.imageUrl);
      clearErrors('imageUrl');
    } else if (isOpen && !postToEdit) {
      reset({
        status: 'published',
        authorName: session?.user?.name || session?.user?.email?.split('@')[0] || '',
        content: '',
      });
      setImagePreview('');
      setUploadedImageUrl('');
      setManualImageUrl('');
    }
  }, [isOpen, postToEdit, reset, session, clearErrors, unregister]);

  // Actualizar preview cuando cambia la URL
  useEffect(() => {
    if (uploadedImageUrl) {
      setImagePreview(uploadedImageUrl);
    } else if (isEditMode && manualImageUrl) {
      setImagePreview(manualImageUrl);
    } else if (!isEditMode) {
      const imageUrl = watch('imageUrl');
      if (imageUrl) {
        setImagePreview(imageUrl);
      }
    }
  }, [uploadedImageUrl, manualImageUrl, isEditMode, watch]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('El archivo debe ser una imagen');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen no puede ser mayor a 5MB');
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al subir la imagen');
      }

      const data = await response.json();
      setUploadedImageUrl(data.imageUrl);
      setValue('imageUrl', data.imageUrl);
      clearErrors('imageUrl');
      trigger('imageUrl');
    } catch (error: any) {
      console.error('Error uploading image:', error);
      alert(error.message || 'Error al subir la imagen');
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data: FormInput) => {
    setIsSubmitting(true);
    try {
      // En modo edición, usar uploadedImageUrl si existe, luego manualImageUrl, o la original
      let finalData: CreatePostInput | Partial<CreatePostInput>;
      
      if (isEditMode && postToEdit) {
        const imageUrlToUse = uploadedImageUrl 
          ? uploadedImageUrl
          : (manualImageUrl && manualImageUrl.trim() !== '')
          ? manualImageUrl
          : postToEdit.imageUrl;
        
        // Convertir content de string a array
        const contentArray = typeof data.content === 'string' 
          ? data.content.split('\n\n').filter((p) => p.trim().length > 0)
          : data.content;
        
        const { imageUrl: _, ...dataWithoutImageUrl } = data;
        finalData = {
          ...dataWithoutImageUrl,
          content: contentArray,
          imageUrl: imageUrlToUse,
        } as Partial<CreatePostInput>;
      } else {
        // Convertir content de string a array
        const contentArray = typeof data.content === 'string' 
          ? data.content.split('\n\n').filter((p) => p.trim().length > 0)
          : data.content;
        
        finalData = {
          ...data,
          content: contentArray,
          imageUrl: uploadedImageUrl || (data as any).imageUrl,
        } as CreatePostInput;
      }

      const url = isEditMode
        ? `/api/admin/blog/${postToEdit!._id}`
        : '/api/admin/blog';
      
      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `Error al ${isEditMode ? 'actualizar' : 'crear'} post`);
      }

      // Reset form
      reset();
      setImagePreview('');
      setUploadedImageUrl('');
      setManualImageUrl('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Cerrar modal
      onClose();

      // Refrescar datos
      if (onSuccess) {
        onSuccess();
      }

      // Refrescar la página
      router.refresh();
    } catch (error: any) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} post:`, error);
      alert(error.message || `Error al ${isEditMode ? 'actualizar' : 'crear'} post`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-[#1D194C]/10 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-tech font-extrabold text-[#1D194C]">
            {isEditMode ? 'Editar blog' : 'Crear nuevo blog'}
          </h2>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-[#1D194C]/10 hover:bg-[#1D194C]/20 flex items-center justify-center transition-colors"
            aria-label="Cerrar modal"
          >
            <X size={20} className="text-[#1D194C]" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Título */}
          <div>
            <label className="block text-sm font-semibold text-[#1D194C] mb-2">
              Título *
            </label>
            <Input
              {...register('title')}
              placeholder="Título del blog"
              className={errors.title ? 'border-red-500' : ''}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
            )}
          </div>

          {/* Duración y Autor en fila */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#1D194C] mb-2">
                Duración de lectura *
              </label>
              <Input
                {...register('readTime')}
                placeholder="Ej: 10 min"
                className={errors.readTime ? 'border-red-500' : ''}
              />
              {errors.readTime && (
                <p className="text-red-500 text-sm mt-1">{errors.readTime.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1D194C] mb-2">
                Autor
              </label>
              <Input
                {...register('authorName')}
                placeholder="Nombre del autor"
              />
            </div>
          </div>

          {/* Imagen */}
          <div>
            <label className="block text-sm font-semibold text-[#1D194C] mb-2">
              Imagen *
            </label>
            
            {/* Preview */}
            {imagePreview && (
              <div className="mb-4 relative h-48 rounded-lg overflow-hidden border-2 border-[#1D194C]/10">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  className="object-cover"
                  unoptimized={imagePreview.startsWith('/images/') || imagePreview.startsWith('/')}
                />
              </div>
            )}

            {/* Upload area */}
            <div className="border-2 border-dashed border-[#1D194C]/20 rounded-lg p-6 text-center">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="flex flex-col items-center gap-2 text-[#1D194C]/60 hover:text-[#1D194C] transition-colors"
              >
                <Upload size={24} />
                <span className="text-sm">
                  {isUploading ? 'Subiendo...' : 'Subir imagen'}
                </span>
              </button>
            </div>

            {/* URL input */}
            <div className="mt-4">
              {isEditMode ? (
                <Input
                  type="text"
                  value={manualImageUrl}
                  onChange={(e) => {
                    setManualImageUrl(e.target.value);
                    if (e.target.value) {
                      setImagePreview(e.target.value);
                    }
                  }}
                  placeholder="O ingresa una URL de imagen"
                  disabled={!!uploadedImageUrl}
                />
              ) : (
                <Input
                  type="text"
                  {...register('imageUrl')}
                  placeholder="O ingresa una URL de imagen"
                  disabled={!!uploadedImageUrl}
                  className={errors.imageUrl ? 'border-red-500' : ''}
                />
              )}
              {errors.imageUrl && !isEditMode && (
                <p className="text-red-500 text-sm mt-1">{errors.imageUrl.message}</p>
              )}
            </div>
          </div>

          {/* Contenido */}
          <div>
            <label className="block text-sm font-semibold text-[#1D194C] mb-2">
              Contenido * (Separa párrafos con doble salto de línea)
            </label>
            <textarea
              {...register('content')}
              rows={12}
              placeholder="Escribe el contenido del blog aquí. Separa los párrafos con doble salto de línea."
              className="w-full px-4 py-3 border border-[#1D194C]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6F74C9] focus:border-transparent resize-y"
            />
            {errors.content && (
              <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-semibold text-[#1D194C] mb-2">
              Estado
            </label>
            <select
              {...register('status')}
              className="w-full px-4 py-3 border border-[#1D194C]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6F74C9] focus:border-transparent"
            >
              <option value="published">Publicado</option>
              <option value="draft">Borrador</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-4 justify-end pt-4 border-t border-[#1D194C]/10">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting || isUploading}
            >
              {isSubmitting 
                ? (isEditMode ? 'Actualizando...' : 'Creando...') 
                : (isEditMode ? 'Actualizar publicación' : 'Crear publicación')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
