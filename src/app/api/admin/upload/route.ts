import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { isAdminEmail } from '@/lib/admin';
import { cloudinary } from '@/lib/cloudinary';

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

    // Verificar que Cloudinary esté configurado
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      console.error('[Upload] Cloudinary configuration missing:', {
        hasCloudName: !!cloudName,
        hasApiKey: !!apiKey,
        hasApiSecret: !!apiSecret,
        allEnvKeys: Object.keys(process.env).filter(key => key.includes('CLOUDINARY')),
      });
      
      return NextResponse.json(
        { 
          error: 'Configuración de Cloudinary incompleta',
          details: process.env.NODE_ENV === 'development' 
            ? 'Verifica que las siguientes variables estén en .env.local: NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET'
            : 'Verifica que las siguientes variables de entorno estén configuradas en Vercel: NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET'
        },
        { status: 500 }
      );
    }

    // Asegurar que Cloudinary esté configurado correctamente
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });

    // Convertir File a Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Convertir buffer a base64 para Cloudinary
    const base64 = buffer.toString('base64');
    const dataUri = `data:${file.type};base64,${base64}`;

    // Generar nombre único para el archivo
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const publicId = `programas/${timestamp}-${sanitizedName.replace(/\.[^/.]+$/, '')}`;

    try {
      // Subir a Cloudinary
      const uploadResult = await cloudinary.uploader.upload(dataUri, {
        folder: 'programas',
        public_id: publicId,
        resource_type: 'image',
        overwrite: false,
        invalidate: true,
        use_filename: false,
        unique_filename: true,
      });

      const imageUrl = uploadResult.secure_url;
      return NextResponse.json({ imageUrl }, { status: 200 });
    } catch (uploadError: any) {
      console.error('[Upload] Error uploading to Cloudinary:', {
        message: uploadError.message,
        stack: uploadError.stack,
        error: uploadError,
      });
      throw new Error(`Error al subir la imagen a Cloudinary: ${uploadError.message}`);
    }
  } catch (error: any) {
    console.error('[Upload] Error uploading image:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
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
