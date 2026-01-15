import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { isAdminEmail } from '@/lib/admin';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    if (!isAdminEmail(session.user.email)) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No se proporcionó ningún archivo' }, { status: 400 });
    }

    // Validar que sea una imagen
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'El archivo debe ser una imagen' }, { status: 400 });
    }

    // Validar tamaño (máximo 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'La imagen no puede ser mayor a 5MB' },
        { status: 400 }
      );
    }

    // IMPORTANTE: En Vercel (serverless), el sistema de archivos es read-only
    // NO se pueden escribir archivos de forma persistente
    // Para producción, necesitas usar un servicio de almacenamiento en la nube:
    // - Vercel Blob Storage
    // - Cloudinary
    // - AWS S3
    // - Uploadthing
    // 
    // Por ahora, este código fallará en Vercel. Es solo para desarrollo local.
    
    const isVercel = process.env.VERCEL === '1';
    
    if (isVercel) {
      console.error('[Upload] Attempting to write file in Vercel (not allowed)');
      return NextResponse.json(
        { 
          error: 'Upload de archivos no está disponible en Vercel. Se requiere un servicio de almacenamiento en la nube.',
          details: 'Por favor, usa una URL de imagen externa o integra un servicio como Cloudinary, S3, o Vercel Blob Storage.'
        },
        { status: 501 } // Not Implemented
      );
    }

    // Solo para desarrollo local
    const uploadDir = join(process.cwd(), 'public', 'images', 'programas');
    
    try {
      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true });
      }
    } catch (mkdirError: any) {
      console.error('[Upload] Error creating directory:', mkdirError.message);
      throw new Error(`No se pudo crear el directorio de upload: ${mkdirError.message}`);
    }

    // Generar nombre único para el archivo
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${timestamp}-${sanitizedName}`;
    const filepath = join(uploadDir, filename);

    try {
      // Convertir File a Buffer y guardar
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filepath, buffer);

      const imageUrl = `/images/programas/${filename}`;
      console.log('[Upload] Image saved successfully:', { filepath, imageUrl });

      return NextResponse.json({ imageUrl }, { status: 200 });
    } catch (writeError: any) {
      console.error('[Upload] Error writing file:', writeError.message, writeError.stack);
      throw new Error(`Error al guardar el archivo: ${writeError.message}`);
    }
  } catch (error: any) {
    console.error('[Upload] Error uploading image:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      vercel: process.env.VERCEL,
      cwd: process.cwd(),
    });
    return NextResponse.json(
      { 
        error: 'Error al subir la imagen',
        details: process.env.NODE_ENV === 'development' ? error.message : 'Revisa los logs del servidor'
      },
      { status: 500 }
    );
  }
}
