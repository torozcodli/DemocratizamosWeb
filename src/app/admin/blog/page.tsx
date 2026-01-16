import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { isAdminEmail } from '@/lib/admin';
import { Container } from '@/components/ui/Container';
import { AdminBlogsList } from '@/components/admin/AdminBlogsList';

export const dynamic = 'force-dynamic';

export default async function AdminBlogPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect('/auth/signin?callbackUrl=/admin/blog');
  }

  if (!isAdminEmail(session.user.email)) {
    redirect('/');
  }

  return (
    <Container>
      <div className="py-8">
        <h1 className="text-4xl font-tech font-extrabold text-[#1D194C] mb-8">
          Administrar Blog
        </h1>
        <AdminBlogsList />
      </div>
    </Container>
  );
}
