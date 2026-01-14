import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { isAdminEmail } from '@/lib/admin';
import { Container } from '@/components/ui/Container';
import { AdminProgramsList } from '@/components/admin/AdminProgramsList';

export const dynamic = 'force-dynamic';

export default async function AdminProgramasPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect('/auth/signin?callbackUrl=/admin/programas');
  }

  if (!isAdminEmail(session.user.email)) {
    redirect('/');
  }

  return (
    <Container>
      <div className="py-8">
        <h1 className="text-4xl font-tech font-extrabold text-[#1D194C] mb-8">
          Administrar Programas
        </h1>
        <AdminProgramsList />
      </div>
    </Container>
  );
}
