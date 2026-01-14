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

    // Crear directorio si no existe
    const uploadDir = join(process.cwd(), 'public', 'images', 'programas');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Generar nombre único para el archivo
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${timestamp}-${sanitizedName}`;
    const filepath = join(uploadDir, filename);

    // Convertir File a Buffer y guardar
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    // Retornar la URL pública de la imagen
    const imageUrl = `/images/programas/${filename}`;

    return NextResponse.json({ imageUrl }, { status: 200 });
  } catch (error: any) {
    console.error('Error uploading image:', error);
    return NextResponse.json({ error: 'Error al subir la imagen' }, { status: 500 });
  }
}
