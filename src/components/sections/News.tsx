import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { homeContent } from '@/content/home';

export function News() {
  return (
    <section className="py-20 sm:py-24 lg:py-32 bg-white/50">
      <Container>
        <div className="mb-12">
          <SectionHeading>{homeContent.news.title}</SectionHeading>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {homeContent.news.items.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 border border-slate-200 shadow-soft hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-semibold text-slate-900 mb-3">
                {item.title}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

