'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Upload } from 'lucide-react';
import { createToolSchema, type CreateToolInput } from '@/modules/tools/validation/tool.validation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import Image from 'next/image';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>('');
  const [manualImageUrl, setManualImageUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEditMode = !!toolToEdit;

  // Schema para edición: imageUrl opcional
  const editToolSchema = createToolSchema.omit({ imageUrl: true }).passthrough();

  type FormInput = {
    title: string;
    description: string;
    content: string;
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
      ? {
          title: toolToEdit.title,
          description: toolToEdit.description,
          content: toolToEdit.content,
          date: toolToEdit.date ? new Date(toolToEdit.date).toISOString().split('T')[0] : '',
          isPublished: toolToEdit.isPublished,
        } as FormInput
      : {
        title: '',
        description: '',
        content: '',
        date: new Date().toISOString().split('T')[0],
        isPublished: true,
      },
  });

  // Cargar datos de la herramienta a editar cuando se abre el modal
  useEffect(() => {
    if (isOpen && toolToEdit) {
      unregister('imageUrl');
      reset({
        title: toolToEdit.title,
        description: toolToEdit.description,
        content: toolToEdit.content,
        date: toolToEdit.date ? new Date(toolToEdit.date).toISOString().split('T')[0] : '',
        isPublished: toolToEdit.isPublished,
      });
      setImagePreview(toolToEdit.imageUrl);
      setUploadedImageUrl('');
      setManualImageUrl('');
    } else if (isOpen && !toolToEdit) {
      reset({
        title: '',
        description: '',
        content: '',
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

      if (isEditMode && toolToEdit) {
        const imageUrlToUse = uploadedImageUrl
          ? uploadedImageUrl
          : (manualImageUrl && manualImageUrl.trim() !== '')
          ? manualImageUrl
          : toolToEdit.imageUrl;

        const { imageUrl: _, ...dataWithoutImageUrl } = data;
        finalData = {
          ...dataWithoutImageUrl,
          imageUrl: imageUrlToUse,
          date: data.date ? new Date(data.date) : undefined,
        } as Partial<CreateToolInput>;
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
          title: String(data.title || '').trim(),
          description: String(data.description || '').trim(),
          content: String(data.content || '').trim(),
          imageUrl: String(imageUrlToUse || '').trim(),
          date: dateString as any, // Zod convertirá el string a Date
          isPublished: data.isPublished ?? true,
        } as CreateToolInput;
        
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
            {isEditMode ? 'Editar Herramienta' : 'Crear Nueva Herramienta'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Cerrar"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-[#1D194C] mb-2">
              Título *
            </label>
            <Input
              {...register('title')}
              placeholder="Ej: Plataforma de Aprendizaje Online"
              className={errors.title ? 'border-red-500' : ''}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
            )}
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-[#1D194C] mb-2">
              Descripción *
            </label>
            <textarea
              {...register('description')}
              placeholder="Breve descripción para la card (10-200 caracteres)"
              rows={3}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6F74C9] ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
            )}
          </div>

          {/* Contenido */}
          <div>
            <label className="block text-sm font-medium text-[#1D194C] mb-2">
              Contenido *
            </label>
            <textarea
              {...register('content')}
              placeholder="Contenido completo de la herramienta (mínimo 20 caracteres)"
              rows={8}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6F74C9] ${
                errors.content ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.content && (
              <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>
            )}
          </div>

          {/* Fecha */}
          <div>
            <label className="block text-sm font-medium text-[#1D194C] mb-2">
              Fecha
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
              Imagen {!isEditMode && '*'}
            </label>
            
            {isEditMode && (
              <div className="mb-3">
                <Input
                  type="text"
                  placeholder="URL de la imagen"
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
                {isUploading ? 'Subiendo...' : 'Subir Imagen'}
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
              Publicar inmediatamente
            </label>
          </div>

          {/* Botones */}
          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-[#1D194C]"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="flex-1 bg-[#6F74C9] hover:bg-[#5A5FB8] text-white"
            >
              {isSubmitting
                ? (isEditMode ? 'Guardando...' : 'Creando...')
                : (isEditMode ? 'Guardar Cambios' : 'Crear Herramienta')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
