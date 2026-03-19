'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { createProgramSchema, type CreateProgramInput } from '@/modules/programs/validation/program.validation';
import { Input } from '@/components/ui/Input';
import { LocaleTabs } from '@/components/admin/LocaleTabs';
import { hasRealContent, toLocalizedEn, toLocalizedEs } from '@/lib/i18n/content';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface Program {
  _id: string;
  title: string | { es: string; en?: string };
  slug: string;
  shortDescription: string | { es: string; en?: string };
  content: string[] | { es: string[]; en?: string[] };
  imageUrl: string;
  externalWebsiteUrl?: string;
  info: {
    date: string;
    time: string;
    location: string;
    instructor: string;
    duration: string;
    level: string;
    includes: string;
  };
  order?: number;
  status: 'published' | 'draft';
}

interface CreateProgramModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  programToEdit?: Program | null;
}

export function CreateProgramModal({
  isOpen,
  onClose,
  onSuccess,
  programToEdit,
}: CreateProgramModalProps) {
  const t = useTranslations('admin');
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>('');
  const [manualImageUrl, setManualImageUrl] = useState<string>(''); // Para modo edición
  const fileInputRef = useRef<HTMLInputElement>(null);
  const lastLoadedRef = useRef<{ isOpen: boolean; programId: string | null }>({ isOpen: false, programId: null });
  const isEditMode = !!programToEdit;

  // Schema para edición: imageUrl NO se valida con Zod
  // Se omite completamente y se maneja en onSubmit
  // Usar passthrough() para permitir campos adicionales sin validar
  const editProgramSchema = createProgramSchema
    .omit({ imageUrl: true })
    .passthrough(); // Permitir campos adicionales (como imageUrl) sin validar

  type EditProgramInput = Omit<CreateProgramInput, 'imageUrl' | 'content'> & {
    imageUrl?: string;
    content: string | string[]; // Permitir string o array para el formulario
  };

  type FormInput = (CreateProgramInput & { content?: string | string[] }) | EditProgramInput;

  const [activeLocaleTab, setActiveLocaleTab] = useState<'es' | 'en'>('es');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
    clearErrors,
    trigger,
    getValues,
    unregister,
  } = useForm<FormInput>({
    // En modo edición, usar el schema de edición que omite imageUrl
    // En modo creación, usar el schema normal que requiere imageUrl
    resolver: isEditMode 
      ? zodResolver(editProgramSchema) as any
      : zodResolver(createProgramSchema) as any,
    mode: 'onSubmit', // Solo validar al enviar
    shouldUnregister: false, // Mantener valores al desregistrar
    defaultValues: programToEdit
      ? (() => {
          const t = programToEdit.title;
          const s = programToEdit.shortDescription;
          const c = programToEdit.content;
          const title = typeof t === 'string' ? { es: t, en: '' } : { es: t?.es ?? '', en: t?.en ?? '' };
          const shortDescription = typeof s === 'string' ? { es: s, en: '' } : { es: s?.es ?? '', en: s?.en ?? '' };
          const contentEs = Array.isArray(c) ? c : (c as any)?.es ?? [];
          const contentEn = Array.isArray(c) ? [] : (c as any)?.en ?? [];
          return {
            title,
            shortDescription,
            content: { es: contentEs.join('\n\n'), en: contentEn.join('\n\n') },
            externalWebsiteUrl: programToEdit.externalWebsiteUrl ?? '',
            info: programToEdit.info,
            order: programToEdit.order,
            status: programToEdit.status,
          } as FormInput;
        })()
      : {
          title: { es: '', en: '' },
          shortDescription: { es: '', en: '' },
          content: { es: '', en: '' },
          status: 'published',
        } as unknown as FormInput,
  });

  // Cargar datos solo al abrir el modal o al cambiar de programa; no al re-render (evita borrar lo que el usuario escribe en la pestaña EN).
  useEffect(() => {
    const programId = programToEdit?._id ?? null;
    const justOpened = isOpen && !lastLoadedRef.current.isOpen;
    const programChanged = isOpen && programId !== lastLoadedRef.current.programId;
    if (!isOpen) {
      lastLoadedRef.current = { isOpen: false, programId: null };
      return;
    }
    if (!justOpened && !programChanged) return;
    lastLoadedRef.current = { isOpen: true, programId };

    if (programToEdit) {
      unregister('imageUrl');
      const t = programToEdit.title;
      const s = programToEdit.shortDescription;
      const c = programToEdit.content;
      const title = typeof t === 'string' ? { es: t, en: '' } : { es: t?.es ?? '', en: t?.en ?? '' };
      const shortDescription = typeof s === 'string' ? { es: s, en: '' } : { es: s?.es ?? '', en: s?.en ?? '' };
      const contentEs = Array.isArray(c) ? c : (c as any)?.es ?? [];
      const contentEn = Array.isArray(c) ? [] : (c as any)?.en ?? [];
      reset({
        title,
        shortDescription,
        content: { es: contentEs.join('\n\n'), en: contentEn.join('\n\n') },
        externalWebsiteUrl: programToEdit.externalWebsiteUrl ?? '',
        info: programToEdit.info,
        order: programToEdit.order,
        status: programToEdit.status,
      });
      setImagePreview(programToEdit.imageUrl);
      setUploadedImageUrl('');
      setManualImageUrl(programToEdit.imageUrl);
      clearErrors('imageUrl');
      setTimeout(() => {
        clearErrors('imageUrl');
        unregister('imageUrl');
      }, 0);
    } else {
      reset({ status: 'published', content: '', externalWebsiteUrl: '' });
      setImagePreview('');
      setUploadedImageUrl('');
      setManualImageUrl('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, programToEdit, reset]);

  const imageUrl = watch('imageUrl');

  // En modo edición, desregistrar imageUrl y limpiar error constantemente
  useEffect(() => {
    if (isEditMode) {
      unregister('imageUrl');
      clearErrors('imageUrl');
    }
  }, [isEditMode, clearErrors, unregister]);

  // Actualizar preview cuando cambia la URL o se sube una imagen
  useEffect(() => {
    if (uploadedImageUrl) {
      setImagePreview(uploadedImageUrl);
    } else if (isEditMode && manualImageUrl && (manualImageUrl.startsWith('http') || manualImageUrl.startsWith('/'))) {
      setImagePreview(manualImageUrl);
    } else if (!isEditMode && imageUrl && (imageUrl.startsWith('http') || imageUrl.startsWith('/'))) {
      setImagePreview(imageUrl);
    } else if (isEditMode && programToEdit?.imageUrl && !manualImageUrl) {
      // En modo edición, si no hay manualImageUrl, mostrar la original
      setImagePreview(programToEdit.imageUrl);
    } else {
      setImagePreview('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageUrl, uploadedImageUrl, manualImageUrl, isEditMode, programToEdit?.imageUrl]);

  // Manejar subida de archivo
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      alert(t('selectImageFile'));
      return;
    }

    // Validar tamaño (5MB)
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
        throw new Error(error.error || t('uploadImageError'));
      }

      const data = await response.json();
      setUploadedImageUrl(data.imageUrl);
      // En modo edición, NO usar setValue para imageUrl (no está registrado)
      // Solo actualizar uploadedImageUrl que se usa en onSubmit
      if (!isEditMode) {
        setValue('imageUrl', data.imageUrl);
        // Limpiar cualquier error de validación después de establecer el valor
        clearErrors('imageUrl');
        // Trigger validation para asegurar que el campo se valide correctamente
        trigger('imageUrl');
      }
    } catch (error: any) {
      console.error('Error uploading image:', error);
      alert(error.message || t('uploadImageError'));
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data: FormInput) => {
    // En modo edición, limpiar cualquier error de imageUrl antes de procesar
    if (isEditMode) {
      clearErrors('imageUrl');
    }

    setIsSubmitting(true);
    try {
      // En modo edición, asegurar que imageUrl tenga un valor
      // Si no hay imagen subida nueva y no hay URL en el campo, usar la original
      let finalData: CreateProgramInput;
      
      const toContentArray = (v: unknown): string[] =>
        (typeof v === 'string' ? v : Array.isArray(v) ? (v as string[]).join('\n\n') : '')
          .split('\n\n')
          .filter((p) => p.trim().length > 0);
      const contentEs = toContentArray((data as any).content?.es ?? (data as any).content);
      const contentEnRaw = (data as any).content?.en;
      const contentEn = hasRealContent(contentEnRaw) ? toContentArray(typeof contentEnRaw === 'string' ? contentEnRaw : Array.isArray(contentEnRaw) ? contentEnRaw.join('\n\n') : '') : undefined;
      const payloadContent = { es: contentEs, en: contentEn };
      const payloadTitle = { es: toLocalizedEs((data as any).title?.es), en: toLocalizedEn((data as any).title?.en) };
      const payloadShortDescription = { es: toLocalizedEs((data as any).shortDescription?.es), en: toLocalizedEn((data as any).shortDescription?.en) };

      if (isEditMode && programToEdit) {
        const imageUrlToUse = uploadedImageUrl
          ? uploadedImageUrl
          : (manualImageUrl && manualImageUrl.trim() !== '')
            ? manualImageUrl
            : programToEdit.imageUrl;
        const { imageUrl: _, content: __, title: __t, shortDescription: __s, ...rest } = data as any;
        finalData = {
          ...rest,
          title: payloadTitle,
          shortDescription: payloadShortDescription,
          content: payloadContent,
          imageUrl: imageUrlToUse,
        } as CreateProgramInput;
      } else {
        const { content: __, title: __t, shortDescription: __s, ...rest } = data as any;
        finalData = { ...rest, title: payloadTitle, shortDescription: payloadShortDescription, content: payloadContent } as CreateProgramInput;
      }

      const url = isEditMode
        ? `/api/admin/programas/${programToEdit!._id}`
        : '/api/admin/programas';
      
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
        // Si el error es sobre imageUrl en modo edición, limpiar el error del formulario
        if (isEditMode && error.details) {
          const imageUrlError = error.details.find((e: any) => e.path?.includes('imageUrl'));
          if (imageUrlError) {
            clearErrors('imageUrl');
            // Si el error es de imageUrl, usar la imagen original automáticamente
            console.warn('Error de imageUrl en backend, usando imagen original:', imageUrlError);
          }
        }
        throw new Error(error.error || (isEditMode ? t('errorUpdateProgram') : t('errorCreateProgram')));
      }

      const program = await response.json();

      // Reset form
      reset();
      setImagePreview('');
      setUploadedImageUrl('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Cerrar modal
      onClose();

      // Refrescar datos
      if (onSuccess) {
        onSuccess();
      }

      // Refrescar la página actual para que aparezca el nuevo programa
      router.refresh();
    } catch (error: any) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} program:`, error);
      alert(error.message || (isEditMode ? t('errorUpdateProgram') : t('errorCreateProgram')));
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
            {isEditMode ? t('editProgramTitle') : t('createProgramTitle')}
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
        <form 
          onSubmit={async (e) => {
            e.preventDefault();
            // En modo edición, validar manualmente sin imageUrl
            if (isEditMode) {
              // Limpiar error de imageUrl múltiples veces para asegurar que se elimine
              clearErrors('imageUrl');
              // Esperar un tick para asegurar que el error se limpie
              await new Promise(resolve => setTimeout(resolve, 0));
              clearErrors('imageUrl');
              
              // Validar solo los campos necesarios (sin imageUrl)
              const fieldsToValidate = ['title.es', 'shortDescription.es', 'content.es', 'externalWebsiteUrl', 'info.date', 'info.time', 'info.location', 'info.instructor', 'info.duration', 'info.level', 'info.includes', 'status'];
              const isValid = await (trigger as (names: string[]) => Promise<boolean>)(fieldsToValidate);
              
              // Limpiar error de imageUrl después de validar también
              clearErrors('imageUrl');
              
              if (isValid) {
                // Si la validación pasa, obtener valores y excluir explícitamente imageUrl
                const formValues = getValues();
                // Excluir imageUrl explícitamente para evitar cualquier validación
                const { imageUrl: _, ...dataWithoutImageUrl } = formValues as any;
                // Limpiar error una vez más antes de enviar
                clearErrors('imageUrl');
                await onSubmit(dataWithoutImageUrl as any);
              } else {
                // Si hay errores, limpiar el de imageUrl específicamente
                clearErrors('imageUrl');
              }
            } else {
              // En modo creación, asegurar que imageUrl tenga valor si hay imagen subida
              const formValues = getValues();
              if (uploadedImageUrl && (!formValues.imageUrl || formValues.imageUrl.trim() === '')) {
                setValue('imageUrl', uploadedImageUrl);
                clearErrors('imageUrl');
              }
              // Validar normalmente
              handleSubmit(onSubmit)(e);
            }
          }} 
          className="p-6 space-y-6"
        >
          <LocaleTabs
            activeTab={activeLocaleTab}
            onTabChange={setActiveLocaleTab}
            hasEnContent={hasRealContent((watch as (n: string) => unknown)('title.en')) || hasRealContent((watch as (n: string) => unknown)('shortDescription.en')) || hasRealContent((watch as (n: string) => unknown)('content.en'))}
          />

          <Input
            label={activeLocaleTab === 'es' ? t('titleEs') : t('titleEn')}
            {...(register as (name: string) => ReturnType<typeof register>)(activeLocaleTab === 'es' ? 'title.es' : 'title.en')}
            error={activeLocaleTab === 'es' ? (errors as any).title?.es?.message : (errors as any).title?.en?.message}
            placeholder={activeLocaleTab === 'es' ? 'Ej: Inclusión digital' : 'e.g. Digital inclusion'}
          />

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {activeLocaleTab === 'es' ? t('shortDescCard') : t('shortDescCardEn')}
            </label>
            <textarea
              {...(register as (name: string) => ReturnType<typeof register>)(activeLocaleTab === 'es' ? 'shortDescription.es' : 'shortDescription.en')}
              rows={2}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
              placeholder={activeLocaleTab === 'es' ? t('placeholderShortDesc') : t('placeholderShortDescEn')}
            />
            {(errors.shortDescription as any)?.es && (
              <p className="mt-1 text-sm text-red-600">{(errors.shortDescription as any).es.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {activeLocaleTab === 'es' ? t('contentLabel') : t('contentLabelEn')}
            </label>
            <textarea
              {...(register as (name: string) => ReturnType<typeof register>)(activeLocaleTab === 'es' ? 'content.es' : 'content.en')}
              rows={8}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
              placeholder={activeLocaleTab === 'es' ? t('placeholderContent') : t('placeholderContentEn')}
            />
            {(errors.content as any)?.es && (
              <p className="mt-1 text-sm text-red-600">{(errors.content as any).es.message}</p>
            )}
          </div>

          <Input
            label={t('externalWebsiteUrlLabel')}
            type="url"
            {...(register as (name: string) => ReturnType<typeof register>)('externalWebsiteUrl')}
            error={(errors as any).externalWebsiteUrl?.message}
            placeholder={t('externalWebsiteUrlPlaceholder')}
          />
          <p className="-mt-4 text-xs text-slate-500">{t('externalWebsiteUrlHint')}</p>

          {/* Imagen - Subir archivo o URL */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {t('programImage')}
            </label>

            {/* Opci?n 1: Subir archivo */}
            <div className="mb-4">
              <label
                htmlFor="image-upload"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {isUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E68956] mb-2"></div>
                      <p className="text-sm text-slate-600">{t('uploadingImage')}</p>
                    </>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-slate-400 mb-2" />
                      <p className="text-sm text-slate-600">
                        <span className="font-semibold">{t('clickToUpload')}</span> {t('orDrag')}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        PNG, JPG, GIF hasta 5MB
                      </p>
                    </>
                  )}
                </div>
                <input
                  id="image-upload"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  disabled={isUploading}
                />
              </label>
            </div>

            {/* Opción 2: O ingresar URL */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">O</span>
              </div>
            </div>

            <div className="mt-4">
              {isEditMode ? (
                // En modo edición, usar input controlado manualmente (sin react-hook-form)
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {t('imageUrlOptional')}
                  </label>
                  <input
                    type="text"
                    value={manualImageUrl}
                    onChange={(e) => {
                      setManualImageUrl(e.target.value);
                      clearErrors('imageUrl');
                    }}
                    onFocus={() => clearErrors('imageUrl')}
                    placeholder={t('placeholderKeepImage')}
                    disabled={!!uploadedImageUrl}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors disabled:bg-slate-100 disabled:cursor-not-allowed"
                  />
                  <p className="mt-1 text-xs text-slate-500">
                    {t('keepImageHint')}
                  </p>
                  {/* NO mostrar error de imageUrl en modo edición - se maneja manualmente */}
                </div>
              ) : (
                // En modo creación, usar react-hook-form normalmente
                <Input
                  label={t('imageUrlAlt')}
                  type="text"
                  {...register('imageUrl', {
                    required: uploadedImageUrl ? false : t('imageRequired'),
                    validate: (value) => {
                      if (uploadedImageUrl) return true;
                      if (!value || value.trim() === '') return t('imageRequired');
                      const isValid = value.startsWith('http://') || value.startsWith('https://') || value.startsWith('/');
                      return isValid || t('invalidImageUrl');
                    },
                  })}
                  error={errors.imageUrl?.message}
                  placeholder="https://ejemplo.com/imagen.jpg"
                  disabled={!!uploadedImageUrl}
                />
              )}
            </div>

            {/* Preview de imagen */}
            {imagePreview && (
              <div className="mt-4 relative w-full h-48 rounded-lg overflow-hidden border border-slate-300">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  className="object-cover"
                  onError={() => {
                    setImagePreview('');
                    setUploadedImageUrl('');
                  }}
                />
                {uploadedImageUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      setUploadedImageUrl('');
                      setImagePreview('');
                      setValue('imageUrl', '');
                      if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                      }
                    }}
                    className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors shadow-md"
                    aria-label={t('removeImage')}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Información del programa */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label={t('date')}
              {...register('info.date')}
              error={errors.info?.date?.message}
              placeholder="Ej: 7 de enero 2026"
            />
            <Input
              label={t('time')}
              {...register('info.time')}
              error={errors.info?.time?.message}
              placeholder="Ej: 5:00 pm"
            />
            <Input
              label={t('location')}
              {...register('info.location')}
              error={errors.info?.location?.message}
              placeholder="Ej: Tecnológico de Monterrey"
            />
            <Input
              label={t('instructor')}
              {...register('info.instructor')}
              error={errors.info?.instructor?.message}
              placeholder="Ej: Juan Pérez"
            />
            <Input
              label={t('duration')}
              {...register('info.duration')}
              error={errors.info?.duration?.message}
              placeholder="Ej: 2 horas"
            />
            <Input
              label={t('level')}
              {...register('info.level')}
              error={errors.info?.level?.message}
              placeholder="Ej: Principiante"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('includes')}
            </label>
            <textarea
              {...register('info.includes')}
              rows={2}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
              placeholder="Ej: Material digital y acceso posterior"
            />
            {errors.info?.includes && (
              <p className="mt-1 text-sm text-red-600">{errors.info.includes.message}</p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t('status')}
            </label>
            <select
              {...register('status')}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
            >
              <option value="published">{t('published')}</option>
              <option value="draft">{t('draft')}</option>
            </select>
          </div>

          {/* Botones */}
          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              {t('cancel')}
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1 bg-[#E68956] hover:bg-[#D67A45]"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? isEditMode
                  ? t('updating')
                  : t('creating')
                : isEditMode
                  ? t('updateProgram')
                  : t('createProgram')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
