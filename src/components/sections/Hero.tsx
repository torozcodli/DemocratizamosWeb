import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { homeContent } from '@/content/home';

export function Hero() {
  return (
    <section id="inicio" className="py-20 sm:py-24 lg:py-32">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          <div className="space-y-6">
            <SectionHeading as="h1">{homeContent.hero.title}</SectionHeading>
            <p className="text-lg text-slate-600 leading-relaxed">
              {homeContent.hero.description}
            </p>
            <Link href="#contacto">
              <Button variant="primary" className="mt-4">
                {homeContent.hero.cta}
              </Button>
            </Link>
          </div>
          <div className="relative h-64 sm:h-80 lg:h-96 rounded-2xl bg-gradient-to-br from-primary-100 via-primary-200 to-purple-200 flex items-center justify-center">
            <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
            <div className="relative z-10 text-center">
              <div className="w-32 h-32 mx-auto rounded-full bg-primary-500/20 blur-2xl"></div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

