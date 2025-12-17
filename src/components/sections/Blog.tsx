import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';

export function Blog() {
  return (
    <section id="blog" className="py-20 sm:py-24 lg:py-32">
      <Container>
        <div className="text-center">
          <SectionHeading>Blog / Publicaciones</SectionHeading>
          <p className="mt-4 text-lg text-slate-600">Próximamente</p>
        </div>
      </Container>
    </section>
  );
}

