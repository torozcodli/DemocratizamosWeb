import { redirect } from 'next/navigation';
import { buildBaseMetadata } from '@/lib/seo/metadata';

export const metadata = buildBaseMetadata({
  title: 'Inicio',
  description: 'Transformamos vidas a través de la tecnología. Llevando habilidades digitales a quienes más las necesitan.',
  path: '/inicio', // Canonical points to /inicio since this redirects there
});

export default function Home() {
  redirect('/inicio');
}

