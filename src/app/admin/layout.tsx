import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { NextIntlClientProvider } from 'next-intl';
import { authOptions } from '@/lib/auth';
import { isAdminEmail } from '@/lib/admin';
import { Navbar } from '@/components/sections/Navbar';
import { routing } from '@/i18n/routing';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nocache: true,
  },
};

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

  const locale = routing.defaultLocale;
  const messages = (await import(`@/messages/${locale}.json`)).default;

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <div className="min-h-screen w-full bg-[#E7E9FF]">
        <Navbar />
        <div className="pt-8">{children}</div>
      </div>
    </NextIntlClientProvider>
  );
}
