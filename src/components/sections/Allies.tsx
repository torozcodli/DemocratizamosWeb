import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { homeContent } from '@/content/home';

export function Allies() {
  return (
    <section className="py-20 sm:py-24 lg:py-32">
      <Container>
        <div className="text-center mb-12">
          <SectionHeading>{homeContent.allies.title}</SectionHeading>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            {homeContent.allies.subtitle}
          </p>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {homeContent.allies.items.map((ally, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-48 h-32 bg-white rounded-lg border border-slate-200 shadow-soft flex items-center justify-center"
            >
              <span className="text-sm font-medium text-slate-600">
                {ally.name}
              </span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

