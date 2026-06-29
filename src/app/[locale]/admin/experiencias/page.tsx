import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { getTranslations } from 'next-intl/server';
import { authOptions } from '@/lib/auth';
import { isAdminEmail } from '@/lib/admin';
import { Container } from '@/components/ui/Container';

export const dynamic = 'force-dynamic';

export default async function AdminExperienciasPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const session = await getServerSession(authOptions);
  const { locale } = await params;
  const t = await getTranslations('admin');

  if (!session || !session.user) {
    redirect(`/auth/signin?callbackUrl=/${locale}/admin/experiencias`);
  }

  if (!isAdminEmail(session.user.email)) {
    redirect('/');
  }

  return (
    <Container>
      <div className="py-8">
        <h1 className="text-4xl font-tech font-extrabold text-[#1D194C] mb-4">
          {t('manageExperiencias')}
        </h1>
        <p className="text-[#1D194C]/60 text-base max-w-xl">
          Las experiencias son gestionadas desde la plataforma Suma Impacto. Esta sección está lista para configurarse.
        </p>
      </div>
    </Container>
  );
}
