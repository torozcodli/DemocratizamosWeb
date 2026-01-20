import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { isAdminEmail } from '@/lib/admin';
import { Container } from '@/components/ui/Container';
import { AdminToolsList } from '@/components/admin/AdminToolsList';

export const dynamic = 'force-dynamic';

export default async function AdminHerramientasPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect('/auth/signin?callbackUrl=/admin/herramientas');
  }

  if (!isAdminEmail(session.user.email)) {
    redirect('/');
  }

  return (
    <Container>
      <div className="py-8">
        <h1 className="text-4xl font-tech font-extrabold text-[#1D194C] mb-8">
          Administrar Herramientas
        </h1>
        <AdminToolsList />
      </div>
    </Container>
  );
}
