import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { isAdminEmail } from '@/lib/admin';
import { Navbar } from '@/components/sections/Navbar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect('/auth/signin?callbackUrl=/admin/programas');
  }

  if (!isAdminEmail(session.user.email)) {
    redirect('/');
  }

  return (
    <div className="min-h-screen w-full bg-[#E7E9FF]">
      <Navbar />
      <div className="pt-8">{children}</div>
    </div>
  );
}
