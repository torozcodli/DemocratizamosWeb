import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { homeContent } from '@/content/home';

export function About() {
  return (
    <section id="nosotros" className="py-20 sm:py-24 lg:py-32 bg-white/50">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-start">
          <div className="bg-white rounded-2xl p-8 shadow-soft border border-slate-100">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">
              {homeContent.about.card.title}
            </h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              {homeContent.about.card.text}
            </p>
            <p className="text-slate-600 leading-relaxed">
              {homeContent.about.card.additional}
            </p>
          </div>
          <div className="space-y-6">
            <SectionHeading>{homeContent.about.heading}</SectionHeading>
          </div>
        </div>
      </Container>
    </section>
  );
}

