'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
  const [manualImageUrl, setManualImageUrl] = useState<string>(''); // Para modo edición
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  type FormInput = (CreateProgramInput & { content: string | string[] }) | EditProgramInput;

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
      ? {
          title: programToEdit.title,
          shortDescription: programToEdit.shortDescription,
          content: programToEdit.content.join('\n\n'),
          // NO incluir imageUrl en defaultValues en modo edición - se maneja manualmente
          info: programToEdit.info,
          order: programToEdit.order,
          status: programToEdit.status,
        } as FormInput
      : {
          status: 'published',
          content: '',
        } as FormInput,
  });

  // Cargar datos del programa a editar cuando se abre el modal
  useEffect(() => {
    if (isOpen && programToEdit) {
      // En modo edición, desregistrar imageUrl completamente para evitar validación
      unregister('imageUrl');
      
      reset({
        title: programToEdit.title,
        shortDescription: programToEdit.shortDescription,
        content: programToEdit.content.join('\n\n'),
        // NO incluir imageUrl en reset en modo edición - se maneja manualmente
        info: programToEdit.info,
        order: programToEdit.order,
        status: programToEdit.status,
      });
      setImagePreview(programToEdit.imageUrl);
      setUploadedImageUrl('');
      setManualImageUrl(programToEdit.imageUrl); // Inicializar el input manual en modo edición
      // Limpiar cualquier error de imageUrl al abrir en modo edición (múltiples veces para asegurar)
      clearErrors('imageUrl');
      // Esperar un tick y limpiar de nuevo
      setTimeout(() => {
        clearErrors('imageUrl');
        unregister('imageUrl'); // Desregistrar de nuevo por si acaso
      }, 0);
    } else if (isOpen && !programToEdit) {
      reset({
        status: 'published',
        content: '',
      });
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
      // En modo edición, NO usar setValue para imageUrl (no está registrado)
      // Solo actualizar uploadedImageUrl que se usa en onSubmit
      if (!isEditMode) {
        setValue('imageUrl', data.imageUrl);
      }
    } catch (error: any) {
      console.error('Error uploading image:', error);
      alert(error.message || 'Error al subir la imagen');
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
      
      if (isEditMode && programToEdit) {
        // En modo edición, usar uploadedImageUrl si existe, luego manualImageUrl si tiene valor, o la original
        const imageUrlToUse = uploadedImageUrl 
          ? uploadedImageUrl
          : (manualImageUrl && manualImageUrl.trim() !== '')
          ? manualImageUrl
          : programToEdit.imageUrl;
        
        // Crear el objeto final sin imageUrl primero, luego agregarlo
        const { imageUrl: _, ...dataWithoutImageUrl } = data;
        finalData = {
          ...dataWithoutImageUrl,
          imageUrl: imageUrlToUse,
        } as CreateProgramInput;
      } else {
        finalData = data as CreateProgramInput;
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
        throw new Error(error.error || `Error al ${isEditMode ? 'actualizar' : 'crear'} programa`);
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
      alert(error.message || `Error al ${isEditMode ? 'actualizar' : 'crear'} programa`);
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
              const fieldsToValidate = ['title', 'shortDescription', 'content', 'info.date', 'info.time', 'info.location', 'info.instructor', 'info.duration', 'info.level', 'info.includes', 'order', 'status'];
              const isValid = await trigger(fieldsToValidate as any);
              
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
              // En modo creación, validar normalmente
              handleSubmit(onSubmit)(e);
            }
          }} 
          className="p-6 space-y-6"
        >
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
              {isEditMode ? (
                // En modo edición, usar input controlado manualmente (sin react-hook-form)
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    URL de la imagen (opcional - dejar vacío para mantener la actual)
                  </label>
                  <input
                    type="text"
                    value={manualImageUrl}
                    onChange={(e) => {
                      setManualImageUrl(e.target.value);
                      // Limpiar cualquier error de imageUrl cuando el usuario escribe
                      clearErrors('imageUrl');
                    }}
                    onFocus={() => {
                      // Limpiar error cuando el usuario enfoca el campo
                      clearErrors('imageUrl');
                    }}
                    placeholder="Dejar vacío para mantener la imagen actual"
                    disabled={!!uploadedImageUrl}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors disabled:bg-slate-100 disabled:cursor-not-allowed"
                  />
                  <p className="mt-1 text-xs text-slate-500">
                    Si no cambias la imagen, se mantendrá la actual automáticamente
                  </p>
                  {/* NO mostrar error de imageUrl en modo edición - se maneja manualmente */}
                </div>
              ) : (
                // En modo creación, usar react-hook-form normalmente
                <Input
                  label="URL de la imagen (alternativa)"
                  type="url"
                  {...register('imageUrl', {
                    required: 'La URL de la imagen es requerida',
                    validate: (value) => {
                      if (!value || value.trim() === '') {
                        return 'La URL de la imagen es requerida';
                      }
                      const isValid = value.startsWith('http://') || value.startsWith('https://') || value.startsWith('/');
                      return isValid || 'Debe ser una URL válida o una ruta de imagen';
                    },
                  })}
                  error={errors.imageUrl?.message}
                  placeholder="https://ejemplo.com/imagen.jpg"
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
