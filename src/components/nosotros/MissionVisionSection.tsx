import { FlipCard } from './FlipCard';

export function MissionVisionSection() {
  return (
    <section className="relative w-full bg-[#1D194C] overflow-x-clip py-20 md:py-24 lg:py-28">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 md:px-10 xl:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-14 lg:gap-16">
          {/* Tarjeta Misión */}
          <FlipCard
            sealText="Misión"
            frontTitle="Impulsamos autonomía con tecnología."
            frontText="Fortalecemos a personas en contextos vulnerables con habilidades digitales para que accedan a mejores oportunidades y construyan una sociedad más justa."
            backText="Impulsamos a las personas hacia mejores oportunidades económicas, fortaleciendo su autonomía mediante habilidades digitales que potencian su desarrollo personal, profesional y social. Democratizamos la innovación y la tecnología como herramientas de inclusión, enfocándonos en quienes enfrentan mayores barreras, para construir una sociedad más equitativa, creativa y resiliente."
          />

          {/* Tarjeta Visión */}
          <FlipCard
            sealText="Visión"
            frontTitle="Un mundo donde innovar es un derecho."
            frontText="Queremos ser una fuerza global que inspira, transforma y abre caminos para que todas las personas puedan construir un futuro sostenible e inclusivo."
            backText="Democratizamos la Innovación se visualiza como una fuerza transformadora y revolucionaria, líder en la promoción del desarrollo humano y la innovación social. Buscamos trascender fronteras y barreras, siendo reconocidos por nuestro impacto radical y positivo en la vida de las personas y comunidades a nivel global. Aspiramos a ser pioneros en la creación de un mundo más sostenible, inclusivo y vibrante, donde cada individuo tenga la oportunidad y el poder de convertir sus sueños en realidad y contribuir activamente a la construcción de un futuro mejor para todos."
          />
        </div>
      </div>
    </section>
  );
}
