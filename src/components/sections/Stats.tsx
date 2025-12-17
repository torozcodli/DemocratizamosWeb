import { Container } from '@/components/ui/Container';
import { homeContent } from '@/content/home';

export function Stats() {
  return (
    <section className="py-20 sm:py-24 lg:py-32 bg-white/50">
      <Container>
        <div className="grid gap-8 sm:grid-cols-2 max-w-4xl mx-auto">
          {homeContent.stats.map((stat, index) => (
            <div
              key={index}
              className="text-center p-8 bg-white rounded-2xl shadow-soft border border-slate-100"
            >
              <div className="text-5xl sm:text-6xl font-bold text-primary-600 mb-2">
                {stat.value}
              </div>
              <div className="text-lg text-slate-700 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

