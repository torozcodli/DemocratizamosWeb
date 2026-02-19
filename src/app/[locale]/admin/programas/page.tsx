import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { isAdminEmail } from '@/lib/admin';
import { Container } from '@/components/ui/Container';
import { AdminProgramsList } from '@/components/admin/AdminProgramsList';

export const dynamic = 'force-dynamic';

export default async function AdminProgramasPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const session = await getServerSession(authOptions);
  const { locale } = await params;
  const t = await getTranslations('admin');

  if (!session || !session.user) {
    redirect(`/auth/signin?callbackUrl=/${locale}/admin/programas`);
  }

  if (!isAdminEmail(session.user.email)) {
    redirect('/');
  }

  return (
    <Container>
      <div className="py-8">
        <h1 className="text-4xl font-tech font-extrabold text-[#1D194C] mb-8">
          {t('managePrograms')}
        </h1>
        <AdminProgramsList />
      </div>
    </Container>
  );
}
