'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { X, Upload } from 'lucide-react';
import { type CreatePostInput } from '@/modules/posts/validation/post.validation';
import { Input } from '@/components/ui/Input';
import { LocaleTabs } from '@/components/admin/LocaleTabs';
import { hasRealContent, toLocalizedEn, toLocalizedEs } from '@/lib/i18n/content';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

interface Post {
  _id: string;
  title: string | { es: string; en?: string };
  slug: string;
  imageUrl: string;
  readTime: string;
  authorName: string;
  excerpt?: string | { es: string; en?: string };
  content: string[] | { es: string[]; en?: string[] };
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
  const t = useTranslations('admin');
  const router = useRouter();
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>('');
  const [manualImageUrl, setManualImageUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const lastLoadedRef = useRef<{ isOpen: boolean; postId: string | null }>({ isOpen: false, postId: null });
  const isEditMode = !!postToEdit;
  const [activeLocaleTab, setActiveLocaleTab] = useState<'es' | 'en'>('es');

  /** Schema que coincide con el formulario: title/excerpt/content como { es, en } strings (content es texto con \n\n, no array). */
  const blogFormSchema = z.object({
    title: z.object({ es: z.string().trim().min(1, 'Título en español requerido'), en: z.string() }),
    excerpt: z.object({ es: z.string(), en: z.string() }),
    readTime: z.string().trim().min(1, 'Tiempo de lectura requerido'),
    authorName: z.string().optional(),
    content: z.object({ es: z.string().trim().min(1, 'Contenido en español requerido'), en: z.string() }),
    imageUrl: z.string().min(1, 'Imagen requerida').refine((v) => v.startsWith('http') || v.startsWith('/'), 'URL o ruta válida').optional(),
    status: z.enum(['published', 'draft']),
  });

  type FormInput = {
    title: { es: string; en: string };
    excerpt: { es: string; en: string };
    readTime: string;
    authorName?: string;
    content: { es: string; en: string };
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
    resolver: zodResolver(blogFormSchema),
    mode: 'onSubmit',
    defaultValues: postToEdit
      ? (() => {
          const t = postToEdit.title;
          const e = postToEdit.excerpt;
          const c = postToEdit.content;
          const title = typeof t === 'string' ? { es: t, en: '' } : { es: t?.es ?? '', en: t?.en ?? '' };
          const excerpt = typeof e === 'string' ? { es: e, en: '' } : { es: e?.es ?? '', en: e?.en ?? '' };
          const contentEs = Array.isArray(c) ? c : (c as any)?.es ?? [];
          const contentEn = Array.isArray(c) ? [] : (c as any)?.en ?? [];
          return {
            title,
            excerpt,
            readTime: postToEdit.readTime,
            authorName: postToEdit.authorName,
            content: { es: contentEs.join('\n\n'), en: contentEn.join('\n\n') },
            status: postToEdit.status,
          } as FormInput;
        })()
      : {
          title: { es: '', en: '' },
          excerpt: { es: '', en: '' },
          readTime: '',
          status: 'published',
          authorName: session?.user?.name || session?.user?.email?.split('@')[0] || '',
          content: { es: '', en: '' },
        } as FormInput,
  });

  // Cargar datos solo al abrir el modal o al cambiar de post; no al re-render (evita borrar lo que el usuario escribe en la pestaña EN).
  useEffect(() => {
    const postId = postToEdit?._id ?? null;
    const justOpened = isOpen && !lastLoadedRef.current.isOpen;
    const postChanged = isOpen && postId !== lastLoadedRef.current.postId;
    if (!isOpen) {
      lastLoadedRef.current = { isOpen: false, postId: null };
      return;
    }
    if (!justOpened && !postChanged) return;
    lastLoadedRef.current = { isOpen: true, postId };

    if (postToEdit) {
      unregister('imageUrl');
      const t = postToEdit.title;
      const e = postToEdit.excerpt;
      const c = postToEdit.content;
      const title = typeof t === 'string' ? { es: t, en: '' } : { es: t?.es ?? '', en: t?.en ?? '' };
      const excerpt = typeof e === 'string' ? { es: e, en: '' } : { es: e?.es ?? '', en: e?.en ?? '' };
      const contentEs = Array.isArray(c) ? c : (c as any)?.es ?? [];
      const contentEn = Array.isArray(c) ? [] : (c as any)?.en ?? [];
      reset({
        title,
        excerpt,
        readTime: postToEdit.readTime,
        authorName: postToEdit.authorName,
        content: { es: contentEs.join('\n\n'), en: contentEn.join('\n\n') },
        status: postToEdit.status,
      });
      setImagePreview(postToEdit.imageUrl);
      setUploadedImageUrl('');
      setManualImageUrl(postToEdit.imageUrl);
      clearErrors('imageUrl');
    } else {
      reset({
        title: { es: '', en: '' },
        excerpt: { es: '', en: '' },
        readTime: '',
        content: { es: '', en: '' },
        status: 'published',
        authorName: session?.user?.name || session?.user?.email?.split('@')[0] || '',
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
        
        const toContentArray = (v: string) => v.split('\n\n').filter((p) => p.trim().length > 0);
        const contentEs = toContentArray((data as FormInput).content?.es ?? '');
        const contentEn = hasRealContent((data as FormInput).content?.en) ? toContentArray((data as FormInput).content!.en!) : undefined;
        const { imageUrl: _, content: __, ...rest } = data as FormInput;
        finalData = {
          ...rest,
          title: { es: toLocalizedEs((data as FormInput).title.es), en: toLocalizedEn((data as FormInput).title.en) },
          excerpt: { es: toLocalizedEs((data as FormInput).excerpt?.es ?? ''), en: toLocalizedEn((data as FormInput).excerpt?.en) },
          content: { es: contentEs, en: contentEn },
          imageUrl: imageUrlToUse,
        } as unknown as Partial<CreatePostInput>;
      } else {
        const toContentArray = (v: string) => v.split('\n\n').filter((p) => p.trim().length > 0);
        const contentEs = toContentArray((data as FormInput).content?.es ?? '');
        const contentEn = hasRealContent((data as FormInput).content?.en) ? toContentArray((data as FormInput).content!.en!) : undefined;
        const { content: __, ...rest } = data as FormInput;
        finalData = {
          ...rest,
          title: { es: toLocalizedEs((data as FormInput).title.es), en: toLocalizedEn((data as FormInput).title.en) },
          excerpt: { es: toLocalizedEs((data as FormInput).excerpt?.es ?? ''), en: toLocalizedEn((data as FormInput).excerpt?.en) },
          content: { es: contentEs, en: contentEn },
          imageUrl: uploadedImageUrl || (data as any).imageUrl,
        } as unknown as CreatePostInput;
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
            {isEditMode ? t('editBlogTitle') : t('createBlogTitle')}
          </h2>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-[#1D194C]/10 hover:bg-[#1D194C]/20 flex items-center justify-center transition-colors"
            aria-label={t('close')}
          >
            <X size={20} className="text-[#1D194C]" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <LocaleTabs
            activeTab={activeLocaleTab}
            onTabChange={setActiveLocaleTab}
            hasEnContent={hasRealContent((watch as (n: string) => unknown)('title.en')) || hasRealContent((watch as (n: string) => unknown)('excerpt.en')) || hasRealContent((watch as (n: string) => unknown)('content.en'))}
          />

          <div>
            <label className="block text-sm font-semibold text-[#1D194C] mb-2">
              {activeLocaleTab === 'es' ? t('titleEs') : t('titleEn')}
            </label>
            <Input
              {...(register as (name: string) => ReturnType<typeof register>)(activeLocaleTab === 'es' ? 'title.es' : 'title.en')}
              placeholder={activeLocaleTab === 'es' ? t('blogTitlePlaceholder') : t('blogTitlePlaceholderEn')}
              className={(errors as any).title?.es || (errors as any).title?.en ? 'border-red-500' : ''}
            />
            {(errors as any).title?.es && <p className="text-red-500 text-sm mt-1">{(errors as any).title.es.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#1D194C] mb-2">
              {activeLocaleTab === 'es' ? t('excerptEs') : t('excerptEn')}
            </label>
            <textarea
              {...(register as (name: string) => ReturnType<typeof register>)(activeLocaleTab === 'es' ? 'excerpt.es' : 'excerpt.en')}
              rows={2}
              placeholder={activeLocaleTab === 'es' ? t('placeholderExcerptEs') : t('placeholderExcerptEn')}
              className="w-full px-4 py-3 border border-[#1D194C]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6F74C9] resize-y"
            />
          </div>

          {/* Duración y Autor en fila */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#1D194C] mb-2">
                {t('readTimeLabel')}
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
                {t('authorLabel')}
              </label>
              <Input
                {...register('authorName')}
                placeholder={t('placeholderAuthor')}
              />
            </div>
          </div>

          {/* Imagen */}
          <div>
            <label className="block text-sm font-semibold text-[#1D194C] mb-2">
              {t('imageRequiredStar')}
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
                  {isUploading ? t('uploading') : t('uploadImage')}
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
                  placeholder={t('imageUrlOrUpload')}
                  disabled={!!uploadedImageUrl}
                />
              ) : (
                <Input
                  type="text"
                  {...register('imageUrl')}
                  placeholder={t('imageUrlOrUpload')}
                  disabled={!!uploadedImageUrl}
                  className={errors.imageUrl ? 'border-red-500' : ''}
                />
              )}
              {errors.imageUrl && !isEditMode && (
                <p className="text-red-500 text-sm mt-1">{errors.imageUrl.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#1D194C] mb-2">
              {activeLocaleTab === 'es' ? t('contentBlogLabel') : t('contentBlogLabelEn')}
            </label>
            <textarea
              {...(register as (name: string) => ReturnType<typeof register>)(activeLocaleTab === 'es' ? 'content.es' : 'content.en')}
              rows={12}
              placeholder={activeLocaleTab === 'es' ? 'Escribe el contenido del blog aquí.' : 'Write blog content here.'}
              className="w-full px-4 py-3 border border-[#1D194C]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6F74C9] focus:border-transparent resize-y"
            />
            {(errors as any).content?.es && <p className="text-red-500 text-sm mt-1">{(errors as any).content.es.message}</p>}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-semibold text-[#1D194C] mb-2">
              {t('status')}
            </label>
            <select
              {...register('status')}
              className="w-full px-4 py-3 border border-[#1D194C]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6F74C9] focus:border-transparent"
            >
              <option value="published">{t('published')}</option>
              <option value="draft">{t('draft')}</option>
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
              {t('cancel')}
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting || isUploading}
            >
              {isSubmitting 
                ? (isEditMode ? t('updating') : t('creating')) 
                : (isEditMode ? t('updatePost') : t('createPost'))}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
