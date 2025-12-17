import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { homeContent } from '@/content/home';
import { cn } from '@/lib/utils/cn';

export function Values() {
  return (
    <section className="py-20 sm:py-24 lg:py-32">
      <Container>
        <div className="text-center mb-12">
          <SectionHeading>Nuestros Valores</SectionHeading>
          <p className="mt-4 text-lg text-slate-600">
            Los pilares que guían nuestro trabajo
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {homeContent.values.map((value, index) => (
            <div
              key={index}
              className={cn(
                'rounded-xl p-6 border border-slate-200 bg-white shadow-soft transition-shadow hover:shadow-lg',
                'highlight' in value && value.highlight &&
                  'bg-gradient-to-br from-primary-50 to-purple-50 border-primary-200 ring-2 ring-primary-200'
              )}
            >
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                {value.title}
              </h3>
              <p className="text-slate-600">{value.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

