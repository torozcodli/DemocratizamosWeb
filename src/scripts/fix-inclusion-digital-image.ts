/**
 * Script para corregir la URL de la imagen del programa "Inclusión Digital"
 * 
 * Ejecutar con: npx tsx src/scripts/fix-inclusion-digital-image.ts
 * O agregar al package.json: "fix-image": "tsx src/scripts/fix-inclusion-digital-image.ts"
 */

import dotenv from 'dotenv';
import path from 'path';

// Cargar variables de entorno
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import connectDB from '@/lib/mongoose';
import Program from '@/modules/programs/models/Program.model';

async function fixInclusionDigitalImage() {
  try {
    console.log('🔌 Conectando a la base de datos...');
    await connectDB();
    console.log('✅ Conectado a la base de datos');

    // Buscar el programa por slug
    const program = await Program.findOne({ slug: 'inclusion-digital' });

    if (!program) {
      console.error('❌ No se encontró el programa "inclusion-digital"');
      process.exit(1);
    }

    console.log('📋 Programa encontrado:');
    console.log(`   Título: ${program.title}`);
    console.log(`   URL actual: ${program.imageUrl}`);

    // La URL correcta debería ser /images/Proyecto_InclusionDigital.jpg
    const correctUrl = '/images/Proyecto_InclusionDigital.jpg';

    if (program.imageUrl === correctUrl) {
      console.log('✅ La URL ya está correcta, no se necesita actualizar');
      process.exit(0);
    }

    // Actualizar la URL
    program.imageUrl = correctUrl;
    await program.save();

    console.log(`✅ URL actualizada a: ${correctUrl}`);
    console.log('🎉 ¡Corrección completada!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fixInclusionDigitalImage();
