/**
 * Script para verificar que los meta tags de Open Graph se generen correctamente
 * 
 * Uso:
 * 1. Inicia tu servidor de desarrollo: npm run dev
 * 2. Ejecuta este script: npx tsx scripts/check-og-meta.ts
 */

import { Metadata } from 'next';

async function checkOGMeta() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const pages = [
    '/',
    '/blog',
    '/aviso-de-privacidad',
    '/programas',
    '/herramientas',
    '/nosotros',
  ];

  console.log('🔍 Verificando meta tags de Open Graph...\n');
  console.log(`Base URL: ${baseUrl}\n`);

  for (const page of pages) {
    try {
      const url = `${baseUrl}${page}`;
      console.log(`📄 Verificando: ${url}`);
      
      const response = await fetch(url);
      const html = await response.text();
      
      // Buscar meta tags de Open Graph
      const ogTitle = html.match(/<meta\s+property="og:title"\s+content="([^"]+)"/)?.[1];
      const ogDescription = html.match(/<meta\s+property="og:description"\s+content="([^"]+)"/)?.[1];
      const ogImage = html.match(/<meta\s+property="og:image"\s+content="([^"]+)"/)?.[1];
      const ogUrl = html.match(/<meta\s+property="og:url"\s+content="([^"]+)"/)?.[1];
      
      if (ogTitle) {
        console.log(`  ✅ og:title: ${ogTitle}`);
      } else {
        console.log(`  ❌ og:title: NO ENCONTRADO`);
      }
      
      if (ogDescription) {
        console.log(`  ✅ og:description: ${ogDescription.substring(0, 60)}...`);
      } else {
        console.log(`  ❌ og:description: NO ENCONTRADO`);
      }
      
      if (ogImage) {
        console.log(`  ✅ og:image: ${ogImage}`);
        // Verificar que la imagen sea URL absoluta
        if (ogImage.startsWith('http')) {
          console.log(`  ✅ og:image es URL absoluta`);
        } else {
          console.log(`  ⚠️  og:image es URL relativa: ${ogImage}`);
        }
      } else {
        console.log(`  ❌ og:image: NO ENCONTRADO`);
      }
      
      if (ogUrl) {
        console.log(`  ✅ og:url: ${ogUrl}`);
      }
      
      console.log('');
    } catch (error) {
      console.error(`  ❌ Error al verificar ${page}:`, error);
      console.log('');
    }
  }
  
  console.log('✅ Verificación completada');
  console.log('\n💡 Para probar con herramientas de depuración:');
  console.log('   1. Instala un túnel: npx localtunnel --port 3000');
  console.log('   2. Usa la URL del túnel en:');
  console.log('      - https://developers.facebook.com/tools/debug/');
  console.log('      - https://www.linkedin.com/post-inspector/');
}

checkOGMeta().catch(console.error);
