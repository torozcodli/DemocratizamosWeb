export function Ribbon() {
  const text = "Creemos en el poder de la tecnología para todos. ";
  const repetitions = 15; // Número de repeticiones para efecto continuo

  // Función para renderizar el texto con los colores correctos
  const renderColoredText = () => {
    return (
      <>
        <span className="text-[#E1E6FD]">Creemos en el </span>
        <span className="text-[#BDC4FA] tech-word">poder</span>
        <span className="text-[#E1E6FD]"> de la </span>
        <span className="text-[#EFBE9F] tech-word">tecnología</span>
        <span className="text-[#E1E6FD]"> para todos. </span>
      </>
    );
  };

  return (
    <section className="relative w-full bg-[#1E1A49] overflow-hidden isolate py-3 sm:py-4 my-0 border-y border-[#E1E6FD]/15">
      <div className="whitespace-nowrap text-lg sm:text-xl md:text-2xl font-bold tracking-wide flex">
        {Array.from({ length: repetitions }).map((_, index) => (
          <span key={index} className="inline-block mx-2 sm:mx-3">
            {renderColoredText()}
          </span>
        ))}
      </div>
    </section>
  );
}

