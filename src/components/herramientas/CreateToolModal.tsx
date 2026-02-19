'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { X, Upload } from 'lucide-react';
import { createToolSchema, type CreateToolInput } from '@/modules/tools/validation/tool.validation';
import { Input } from '@/components/ui/Input';
import { LocaleTabs } from '@/components/admin/LocaleTabs';
import { hasRealContent, toLocalizedEn, toLocalizedEs } from '@/lib/i18n/content';
import { Button } from '@/components/ui/Button';
import Image from 'next/image';

interface Tool {
  _id: string;
  title: string | { es: string; en?: string };
  slug: string;
  imageUrl: string;
  description: string | { es: string; en?: string };
  content: string | { es: string; en?: string };
  date: string;
  isPublished: boolean;
}

interface CreateToolModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  toolToEdit?: Tool | null;
}

export function CreateToolModal({
  isOpen,
  onClose,
  onSuccess,
  toolToEdit,
}: CreateToolModalProps) {
  const t = useTranslations('admin');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>('');
  const [manualImageUrl, setManualImageUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const lastLoadedRef = useRef<{ isOpen: boolean; toolId: string | null }>({ isOpen: false, toolId: null });
  const isEditMode = !!toolToEdit;
  const [activeLocaleTab, setActiveLocaleTab] = useState<'es' | 'en'>('es');

  const editToolSchema = createToolSchema.omit({ imageUrl: true }).passthrough();

  type FormInput = {
    title: { es: string; en: string };
    description: { es: string; en: string };
    content: { es: string; en: string };
    imageUrl?: string;
    date?: string;
    isPublished: boolean;
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
      ? zodResolver(editToolSchema) as any
      : zodResolver(createToolSchema) as any,
    mode: 'onSubmit',
    defaultValues: toolToEdit
      ? (() => {
          const t = toolToEdit.title;
          const d = toolToEdit.description;
          const c = toolToEdit.content;
          const title = typeof t === 'string' ? { es: t, en: '' } : { es: t?.es ?? '', en: t?.en ?? '' };
          const description = typeof d === 'string' ? { es: d, en: '' } : { es: d?.es ?? '', en: d?.en ?? '' };
          const content = typeof c === 'string' ? { es: c, en: '' } : { es: c?.es ?? '', en: c?.en ?? '' };
          return {
            title,
            description,
            content,
            date: toolToEdit.date ? new Date(toolToEdit.date).toISOString().split('T')[0] : '',
            isPublished: toolToEdit.isPublished,
          } as FormInput;
        })()
      : {
          title: { es: '', en: '' },
          description: { es: '', en: '' },
          content: { es: '', en: '' },
          date: new Date().toISOString().split('T')[0],
          isPublished: true,
        } as FormInput,
  });

  // Cargar datos solo al abrir el modal o al cambiar de herramienta; no al re-render (evita borrar lo que el usuario escribe en la pestaña EN).
  useEffect(() => {
    const toolId = toolToEdit?._id ?? null;
    const justOpened = isOpen && !lastLoadedRef.current.isOpen;
    const toolChanged = isOpen && toolId !== lastLoadedRef.current.toolId;
    if (!isOpen) {
      lastLoadedRef.current = { isOpen: false, toolId: null };
      return;
    }
    if (!justOpened && !toolChanged) return;
    lastLoadedRef.current = { isOpen: true, toolId };

    if (toolToEdit) {
      unregister('imageUrl');
      const t = toolToEdit.title;
      const d = toolToEdit.description;
      const c = toolToEdit.content;
      const title = typeof t === 'string' ? { es: t, en: '' } : { es: t?.es ?? '', en: t?.en ?? '' };
      const description = typeof d === 'string' ? { es: d, en: '' } : { es: d?.es ?? '', en: d?.en ?? '' };
      const content = typeof c === 'string' ? { es: c, en: '' } : { es: c?.es ?? '', en: c?.en ?? '' };
      reset({
        title,
        description,
        content,
        date: toolToEdit.date ? new Date(toolToEdit.date).toISOString().split('T')[0] : '',
        isPublished: toolToEdit.isPublished,
      });
      setImagePreview(toolToEdit.imageUrl);
      setUploadedImageUrl('');
      setManualImageUrl('');
    } else {
      reset({
        title: { es: '', en: '' },
        description: { es: '', en: '' },
        content: { es: '', en: '' },
        date: new Date().toISOString().split('T')[0],
        isPublished: true,
      });
      setImagePreview('');
      setUploadedImageUrl('');
      setManualImageUrl('');
    }
  }, [isOpen, toolToEdit, reset, unregister]);

  const handleFileUpload = async (file: File) => {
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
      setImagePreview(data.imageUrl);
      setManualImageUrl('');
      // Establecer el valor en el formulario
      setValue('imageUrl', data.imageUrl, { shouldValidate: true });
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
      let finalData: CreateToolInput | Partial<CreateToolInput>;

      const payloadTitle = { es: toLocalizedEs((data as FormInput).title.es), en: toLocalizedEn((data as FormInput).title.en) };
      const payloadDescription = { es: toLocalizedEs((data as FormInput).description.es), en: toLocalizedEn((data as FormInput).description.en) };
      const payloadContent = { es: toLocalizedEs((data as FormInput).content.es), en: toLocalizedEn((data as FormInput).content.en) };

      if (isEditMode && toolToEdit) {
        const imageUrlToUse = uploadedImageUrl
          ? uploadedImageUrl
          : (manualImageUrl && manualImageUrl.trim() !== '')
            ? manualImageUrl
            : toolToEdit.imageUrl;
        const { imageUrl: _, title: __, description: ___, content: ____, ...rest } = data as FormInput;
        finalData = {
          ...rest,
          title: payloadTitle,
          description: payloadDescription,
          content: payloadContent,
          imageUrl: imageUrlToUse,
          date: data.date ? new Date(data.date) : undefined,
        } as unknown as Partial<CreateToolInput>;
      } else {
        // Para crear, necesitamos imageUrl obligatorio
        const imageUrlToUse = uploadedImageUrl || manualImageUrl;
        if (!imageUrlToUse || imageUrlToUse.trim() === '') {
          alert('Por favor, sube una imagen o ingresa una URL de imagen');
          setIsSubmitting(false);
          return;
        }
        
        // Asegurar que todos los campos requeridos estén presentes
        // Manejar date que puede ser string o undefined
        let dateValue: Date;
        if (data.date && typeof data.date === 'string' && data.date.trim() !== '') {
          dateValue = new Date(data.date);
        } else {
          dateValue = new Date();
        }
        
        // Construir el objeto final asegurando que todos los campos requeridos estén presentes
        // Convertir date a ISO string para que Zod pueda procesarlo con z.coerce.date()
        const dateString = dateValue.toISOString();
        
        // Construir objeto final sin campos undefined
        // date se envía como string ISO, Zod lo convertirá con z.coerce.date()
        finalData = {
          title: payloadTitle,
          description: payloadDescription,
          content: payloadContent,
          imageUrl: String(imageUrlToUse || '').trim(),
          date: dateString as any,
          isPublished: data.isPublished ?? true,
        } as unknown as CreateToolInput;
        
        // Validar que todos los campos requeridos estén presentes
        if (!finalData.title || !finalData.description || !finalData.content || !finalData.imageUrl) {
          alert('Por favor, completa todos los campos requeridos');
          setIsSubmitting(false);
          return;
        }
        
      }

      const url = isEditMode
        ? `/api/admin/tools/${toolToEdit!._id}`
        : '/api/admin/tools';
      
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
        console.error('API Error:', error);
        // Si hay detalles de validación, mostrarlos
        if (error.details && Array.isArray(error.details)) {
          const errorMessages = error.details.map((d: any) => `${d.field}: ${d.message}`).join('\n');
          throw new Error(`Error de validación:\n${errorMessages}`);
        }
        throw new Error(error.error || `Error al ${isEditMode ? 'actualizar' : 'crear'} herramienta`);
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

      // Callback de éxito
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error('Error submitting form:', error);
      alert(error.message || `Error al ${isEditMode ? 'actualizar' : 'crear'} herramienta`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-[#1D194C]">
            {isEditMode ? t('editToolTitle') : t('createToolTitle')}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label={t('close')}
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <LocaleTabs
            activeTab={activeLocaleTab}
            onTabChange={setActiveLocaleTab}
            hasEnContent={hasRealContent((watch as (n: string) => unknown)('title.en')) || hasRealContent((watch as (n: string) => unknown)('description.en')) || hasRealContent((watch as (n: string) => unknown)('content.en'))}
          />

          <div>
            <label className="block text-sm font-medium text-[#1D194C] mb-2">
              {activeLocaleTab === 'es' ? t('titleEs') : t('titleEn')}
            </label>
            <Input
              {...(register as (name: string) => ReturnType<typeof register>)(activeLocaleTab === 'es' ? 'title.es' : 'title.en')}
              placeholder={activeLocaleTab === 'es' ? 'Ej: Plataforma de Aprendizaje Online' : 'e.g. Online Learning Platform'}
              className={(errors as any).title?.es || (errors as any).title?.en ? 'border-red-500' : ''}
            />
            {(errors as any).title?.es && <p className="text-red-500 text-sm mt-1">{(errors as any).title.es.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1D194C] mb-2">
              {activeLocaleTab === 'es' ? t('descriptionEs') : t('descriptionEn')}
            </label>
            <textarea
              {...(register as (name: string) => ReturnType<typeof register>)(activeLocaleTab === 'es' ? 'description.es' : 'description.en')}
              rows={3}
              placeholder={activeLocaleTab === 'es' ? 'Breve descripción para la card (10-200 caracteres)' : 'Brief description for the card (10-200 chars)'}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6F74C9] ${(errors as any).description?.es || (errors as any).description?.en ? 'border-red-500' : 'border-gray-300'}`}
            />
            {(errors as any).description?.es && <p className="text-red-500 text-sm mt-1">{(errors as any).description.es.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1D194C] mb-2">
              {activeLocaleTab === 'es' ? t('contentEs') : t('contentEn')}
            </label>
            <textarea
              {...(register as (name: string) => ReturnType<typeof register>)(activeLocaleTab === 'es' ? 'content.es' : 'content.en')}
              rows={8}
              placeholder={activeLocaleTab === 'es' ? t('placeholderToolContent') : t('placeholderToolContentEn')}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6F74C9] ${(errors as any).content?.es || (errors as any).content?.en ? 'border-red-500' : 'border-gray-300'}`}
            />
            {(errors as any).content?.es && <p className="text-red-500 text-sm mt-1">{(errors as any).content.es.message}</p>}
          </div>

          {/* Fecha */}
          <div>
            <label className="block text-sm font-medium text-[#1D194C] mb-2">
              {t('date')}
            </label>
            <Input
              type="date"
              {...register('date', { required: false })}
              defaultValue={new Date().toISOString().split('T')[0]}
              className={errors.date ? 'border-red-500' : ''}
            />
            {errors.date && (
              <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
            )}
          </div>

          {/* Imagen */}
          <div>
            <label className="block text-sm font-medium text-[#1D194C] mb-2">
              {t('image')} {!isEditMode && '*'}
            </label>
            
            {isEditMode && (
              <div className="mb-3">
                <Input
                  type="text"
                  placeholder={t('imageUrlAlt')}
                  value={manualImageUrl}
                  onChange={(e) => {
                    setManualImageUrl(e.target.value);
                    if (e.target.value.trim() !== '') {
                      setImagePreview(e.target.value);
                      setValue('imageUrl', e.target.value);
                      clearErrors('imageUrl');
                    }
                  }}
                  className="mb-2"
                />
              </div>
            )}

            {/* Upload de archivo */}
            <div className="flex items-center gap-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleFileUpload(file);
                  }
                }}
                className="hidden"
              />
              <Button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="flex items-center gap-2"
              >
                <Upload size={16} />
                {isUploading ? t('uploading') : t('uploadImage')}
              </Button>
            </div>

            {/* Preview */}
            {imagePreview && (
              <div className="mt-4 relative w-full h-48 rounded-lg overflow-hidden border border-gray-300">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  className="object-cover"
                  unoptimized={imagePreview.startsWith('/images/') || imagePreview.startsWith('/')}
                />
              </div>
            )}

            {errors.imageUrl && (
              <p className="text-red-500 text-sm mt-1">{errors.imageUrl.message}</p>
            )}
          </div>

          {/* Publicado */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              {...register('isPublished')}
              className="w-4 h-4 text-[#6F74C9] border-gray-300 rounded focus:ring-[#6F74C9]"
            />
            <label className="text-sm font-medium text-[#1D194C]">
              {t('publishImmediately')}
            </label>
          </div>

          {/* Botones */}
          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-[#1D194C]"
            >
              {t('cancel')}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="flex-1 bg-[#6F74C9] hover:bg-[#5A5FB8] text-white"
            >
              {isSubmitting
                ? (isEditMode ? t('saving') : t('creating'))
                : (isEditMode ? t('saveChanges') : t('createTool'))}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
