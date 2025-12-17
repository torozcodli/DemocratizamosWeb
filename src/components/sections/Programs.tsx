import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';

export function Programs() {
  return (
    <section id="programas" className="py-20 sm:py-24 lg:py-32 bg-white/50">
      <Container>
        <div className="text-center">
          <SectionHeading>Programas</SectionHeading>
          <p className="mt-4 text-lg text-slate-600">Próximamente</p>
        </div>
      </Container>
    </section>
  );
}

