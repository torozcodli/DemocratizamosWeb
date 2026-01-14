'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { createProgramSchema, type CreateProgramInput } from '@/modules/programs/validation/program.validation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

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
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEditMode = !!programToEdit;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<CreateProgramInput>({
    resolver: zodResolver(createProgramSchema),
    defaultValues: programToEdit
      ? {
          title: programToEdit.title,
          shortDescription: programToEdit.shortDescription,
          content: programToEdit.content.join('\n\n'),
          imageUrl: programToEdit.imageUrl,
          info: programToEdit.info,
          order: programToEdit.order,
          status: programToEdit.status,
        }
      : {
          status: 'published',
          content: '',
        },
  });

  // Cargar datos del programa a editar cuando se abre el modal
  useEffect(() => {
    if (isOpen && programToEdit) {
      reset({
        title: programToEdit.title,
        shortDescription: programToEdit.shortDescription,
        content: programToEdit.content.join('\n\n'),
        imageUrl: programToEdit.imageUrl,
        info: programToEdit.info,
        order: programToEdit.order,
        status: programToEdit.status,
      });
      setImagePreview(programToEdit.imageUrl);
      setUploadedImageUrl('');
    } else if (isOpen && !programToEdit) {
      reset({
        status: 'published',
        content: '',
      });
      setImagePreview('');
      setUploadedImageUrl('');
    }
  }, [isOpen, programToEdit, reset]);

  const imageUrl = watch('imageUrl');

  // Actualizar preview cuando cambia la URL o se sube una imagen
  useEffect(() => {
    if (uploadedImageUrl) {
      setImagePreview(uploadedImageUrl);
    } else if (imageUrl && (imageUrl.startsWith('http') || imageUrl.startsWith('/'))) {
      setImagePreview(imageUrl);
    } else {
      setImagePreview('');
    }
  }, [imageUrl, uploadedImageUrl]);

  // Manejar subida de archivo
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen');
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
        throw new Error(error.error || 'Error al subir la imagen');
      }

      const data = await response.json();
      setUploadedImageUrl(data.imageUrl);
      setValue('imageUrl', data.imageUrl);
    } catch (error: any) {
      console.error('Error uploading image:', error);
      alert(error.message || 'Error al subir la imagen');
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data: CreateProgramInput) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/admin/programas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al crear programa');
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
      console.error('Error creating program:', error);
      alert(error.message || 'Error al crear programa');
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
            {isEditMode ? 'Editar programa' : 'Crear nuevo programa'}
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
          <Input
            label="Título *"
            {...register('title')}
            error={errors.title?.message}
            placeholder="Ej: Inclusión digital"
          />

          {/* Descripción corta */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Descripción corta (para la card) *
            </label>
            <textarea
              {...register('shortDescription')}
              rows={2}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
              placeholder="Descripción breve que aparecerá en la card del carrusel"
            />
            {errors.shortDescription && (
              <p className="mt-1 text-sm text-red-600">{errors.shortDescription.message}</p>
            )}
          </div>

          {/* Contenido largo */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Contenido (párrafos separados por doble salto de línea) *
            </label>
            <textarea
              {...register('content')}
              rows={8}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
              placeholder="Escribe el contenido del programa. Separa los párrafos con doble salto de línea."
            />
            {errors.content && (
              <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
            )}
          </div>

          {/* Imagen - Subir archivo o URL */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Imagen del programa *
            </label>

            {/* Opción 1: Subir archivo */}
            <div className="mb-4">
              <label
                htmlFor="image-upload"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {isUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E68956] mb-2"></div>
                      <p className="text-sm text-slate-600">Subiendo imagen...</p>
                    </>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-slate-400 mb-2" />
                      <p className="text-sm text-slate-600">
                        <span className="font-semibold">Haz clic para subir</span> o arrastra y suelta
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
              <Input
                label="URL de la imagen (alternativa)"
                type="url"
                {...register('imageUrl')}
                error={errors.imageUrl?.message}
                placeholder="https://ejemplo.com/imagen.jpg"
                disabled={!!uploadedImageUrl && !isEditMode}
              />
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
                    aria-label="Eliminar imagen"
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
              label="Fecha *"
              {...register('info.date')}
              error={errors.info?.date?.message}
              placeholder="Ej: 7 de enero 2026"
            />
            <Input
              label="Hora *"
              {...register('info.time')}
              error={errors.info?.time?.message}
              placeholder="Ej: 5:00 pm"
            />
            <Input
              label="Ubicación *"
              {...register('info.location')}
              error={errors.info?.location?.message}
              placeholder="Ej: Tecnológico de Monterrey"
            />
            <Input
              label="Instructor *"
              {...register('info.instructor')}
              error={errors.info?.instructor?.message}
              placeholder="Ej: Juan Pérez"
            />
            <Input
              label="Duración *"
              {...register('info.duration')}
              error={errors.info?.duration?.message}
              placeholder="Ej: 2 horas"
            />
            <Input
              label="Nivel *"
              {...register('info.level')}
              error={errors.info?.level?.message}
              placeholder="Ej: Principiante"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Incluye *
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

          {/* Order y Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Orden (opcional)"
              type="number"
              {...register('order', { valueAsNumber: true })}
              error={errors.order?.message}
              placeholder="Dejar vacío para asignar automáticamente"
            />
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Estado *
              </label>
              <select
                {...register('status')}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
              >
                <option value="published">Publicado</option>
                <option value="draft">Borrador</option>
              </select>
            </div>
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
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1 bg-[#E68956] hover:bg-[#D67A45]"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? isEditMode
                  ? 'Actualizando...'
                  : 'Creando...'
                : isEditMode
                  ? 'Actualizar programa'
                  : 'Crear programa'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
