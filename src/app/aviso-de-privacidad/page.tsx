import { Container } from '@/components/ui/Container';

export default function AvisoPrivacidadPage() {
  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-gradient-to-br from-[#E7E9FF] via-[#F5F6FF] to-[#E1E6FD]">
      {/* Círculos decorativos con blur */}
      <div className="absolute top-[-100px] right-[-150px] w-[600px] h-[600px] bg-gradient-to-br from-[#6F74C9]/20 to-[#484A88]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-200px] left-[-200px] w-[700px] h-[700px] bg-gradient-to-tr from-[#E1CEF2]/30 to-[#AAB3FF]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-[#484A88]/15 to-[#6F74C9]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-[20%] right-[10%] w-[400px] h-[400px] bg-gradient-to-bl from-[#E79A5A]/10 to-[#E68956]/10 rounded-full blur-3xl pointer-events-none" />

      <Container className="relative z-10 pt-36 sm:pt-40 lg:pt-44 pb-12 sm:pb-16 lg:pb-20">
        {/* Card principal */}
        <div className="max-w-5xl mx-auto bg-white/70 backdrop-blur-md border border-white/50 rounded-2xl shadow-sm p-6 sm:p-8 md:p-12 lg:p-16">
          {/* Header */}
          <div className="mb-8 sm:mb-12">
            <p className="text-sm sm:text-base text-[#1D194C]/70 mb-4">
              Última actualización: <strong>19 de Septiembre de 2025</strong>
            </p>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-tech font-extrabold text-[#1D194C] uppercase tracking-tight">
              AVISO DE PRIVACIDAD BENEFICIARIOS DE PROGRAMAS
            </h1>
          </div>

          {/* Índice de navegación */}
          <nav className="mb-8 sm:mb-12 p-4 sm:p-6 bg-[#E7E9FF]/50 rounded-xl border border-[#6F74C9]/20">
            <h3 className="text-sm font-semibold text-[#1D194C] mb-3 uppercase tracking-wide">
              Índice
            </h3>
            <ul className="space-y-2 text-sm sm:text-base">
              <li>
                <a href="#responsable" className="text-[#484A88] hover:text-[#1D194C] hover:underline transition-colors">
                  1. Responsable de datos personales
                </a>
              </li>
              <li>
                <a href="#finalidades-primarias" className="text-[#484A88] hover:text-[#1D194C] hover:underline transition-colors">
                  2. Finalidades primarias
                </a>
              </li>
              <li>
                <a href="#finalidades-secundarias" className="text-[#484A88] hover:text-[#1D194C] hover:underline transition-colors">
                  3. Finalidades secundarias
                </a>
              </li>
              <li>
                <a href="#transferencias" className="text-[#484A88] hover:text-[#1D194C] hover:underline transition-colors">
                  4. Transferencias de datos
                </a>
              </li>
              <li>
                <a href="#limitar-uso" className="text-[#484A88] hover:text-[#1D194C] hover:underline transition-colors">
                  5. Limitar el uso o divulgación
                </a>
              </li>
              <li>
                <a href="#derechos-arco" className="text-[#484A88] hover:text-[#1D194C] hover:underline transition-colors">
                  6. Derechos ARCO
                </a>
              </li>
              <li>
                <a href="#cambios" className="text-[#484A88] hover:text-[#1D194C] hover:underline transition-colors">
                  7. Cambios en el aviso
                </a>
              </li>
            </ul>
          </nav>

          {/* Contenido */}
          <div className="prose prose-slate max-w-none space-y-8 sm:space-y-10">
            {/* Introducción */}
            <div className="text-[#1D194C]/80 leading-relaxed space-y-4 text-sm sm:text-base">
              <p>
                <strong>Democratizamos la Innovación, A.C.</strong> es una organización civil fundada en 2024 en el estado de Chihuahua, con la misión de impulsar la autonomía de las personas mediante el desarrollo de habilidades digitales, el emprendimiento y la innovación tecnológica. Surge como una iniciativa de Inndech ante la necesidad de brindar soluciones formativas accesibles y de alto impacto para poblaciones con acceso limitado a oportunidades tecnológicas.
              </p>
              <p>
                Nuestro enfoque se centra en reducir la brecha digital, fortalecer las capacidades de iniciativas económicas populares, empoderar a mujeres, niñas, niños y jóvenes, y promover el uso ético de la tecnología como herramienta de transformación social. Lo hacemos a través de programas de capacitación, sensibilización, orientación y acompañamiento, con un fuerte compromiso por la inclusión, la equidad y el desarrollo económico sostenible.
              </p>
              <p>
                En cumplimiento y apego a lo establecido en la <strong>Ley Federal de Protección de Datos Personales en Posesión de Particulares</strong> y su Reglamento damos a conocer los siguientes puntos:
              </p>
            </div>

            {/* Sección 1: Responsable */}
            <section id="responsable" className="scroll-mt-8">
              <h2 className="text-2xl sm:text-3xl font-tech font-bold text-[#1D194C] mb-4 sm:mb-6">
                1. RESPONSABLE DE DATOS PERSONALES
              </h2>
              <div className="space-y-3 text-[#1D194C]/80 text-sm sm:text-base">
                <p>
                  Para la protección de datos personales de titulares <strong>Democratizamos la Innovación, A.C</strong> es responsable del uso y manejo de estos, teniendo como domicilio para oír y recibir notificaciones en el domicilio: Hacienda de la luz, 2036, Haciendas del Valle II, Chihuahua, Chihuahua, 31217.
                </p>
              </div>
            </section>

            {/* Sección 2: Finalidades Primarias */}
            <section id="finalidades-primarias" className="scroll-mt-8">
              <h2 className="text-2xl sm:text-3xl font-tech font-bold text-[#1D194C] mb-4 sm:mb-6">
                2. FINALIDADES PRIMARIAS
              </h2>
              <div className="space-y-4 text-[#1D194C]/80 text-sm sm:text-base">
                <p>
                  Sus datos personales serán utilizados para las siguientes finalidades necesarias para el desarrollo y cumplimiento de los objetivos del programa que implementa <strong>Democratizamos la Innovación A.C.</strong>:
                </p>
                <ul className="space-y-2 ml-4" style={{ listStyle: 'none' }}>
                  <li className="flex items-start gap-2">
                    <span className="text-[#484A88] mt-1">●</span>
                    <span>Identificarle legalmente como participante de nuestros programas sociales o de formación.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#484A88] mt-1">●</span>
                    <span>Inscribir al beneficiario en el programa solicitado.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#484A88] mt-1">●</span>
                    <span>Integrar un expediente individual para el seguimiento, control y evaluación de su participación.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#484A88] mt-1">●</span>
                    <span>Elaboración de un diagnóstico para la identificación del tipo de beneficiario solicitante.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#484A88] mt-1">●</span>
                    <span>Elaboración de reportes, toma de fotografía y video para comprobación ante instancias financiadoras o entidades donantes que los apoyos o beneficios fueron entregados de manera transparente y conforme a los criterios establecidos.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#484A88] mt-1">●</span>
                    <span>Establecer comunicación directa y personalizada para brindar información relevante sobre el programa en el que se ha inscrito.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#484A88] mt-1">●</span>
                    <span>Generar una base de datos de personas beneficiarias y participantes.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#484A88] mt-1">●</span>
                    <span>Emitir certificados, constancias de participación o cualquier otro documento derivado de su participación.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#484A88] mt-1">●</span>
                    <span>Realizar trámites administrativos y de seguimiento relacionados con su proceso formativo y de acompañamiento.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#484A88] mt-1">●</span>
                    <span>Selección como candidato(a) para otros apoyos o programas</span>
                  </li>
                </ul>

                <p className="mt-4">
                  Para lo cual es necesario recabar los siguientes datos personales:
                </p>

                <div className="mt-4 p-4 sm:p-6 bg-[#F5F6FF] rounded-lg border border-[#6F74C9]/20">
                  <h3 className="font-semibold text-[#1D194C] mb-3 text-base sm:text-lg">
                    Datos del participante:
                  </h3>
                  <ul className="space-y-2 text-sm sm:text-base ml-4" style={{ listStyle: 'none' }}>
                    <li className="flex items-start gap-2">
                      <span className="text-[#484A88] mt-1">●</span>
                      <span><strong>Datos de identificación:</strong> Nombre completo, domicilio, fecha de nacimiento, nacionalidad, identificación oficial.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#484A88] mt-1">●</span>
                      <span><strong>Datos de contacto:</strong> Teléfono celular, correo electrónico</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#484A88] mt-1">●</span>
                      <span><strong>Datos de autenticación:</strong> Firma autógrafa, firma electrónica</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#484A88] mt-1">●</span>
                      <span><strong>Datos patrimoniales y/o financieros:</strong> Facturas, Recibos de pago, líneas de captura, información fiscal.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#484A88] mt-1">●</span>
                      <span><strong>Datos laborales:</strong> Puesto o perfil, nombre de empresa/proyecto, Domicilio del lugar de trabajo.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#484A88] mt-1">●</span>
                      <span><strong>Datos escolares:</strong> Boleta de calificaciones, grado de estudios,</span>
                    </li>
                  </ul>
                  <p className="mt-4 text-sm sm:text-base text-[#484A88]">
                    Hacemos de su conocimiento que <strong>Democratizamos la Innovación, A.C</strong> no solicita datos considerados como <strong>sensibles</strong> de acuerdo a la ley federal de protección de datos personales.
                  </p>
                </div>
              </div>
            </section>

            {/* Sección 3: Finalidades Secundarias */}
            <section id="finalidades-secundarias" className="scroll-mt-8">
              <h2 className="text-2xl sm:text-3xl font-tech font-bold text-[#1D194C] mb-4 sm:mb-6">
                3. FINALIDADES SECUNDARIAS
              </h2>
              <div className="space-y-4 text-[#1D194C]/80 text-sm sm:text-base">
                <p>
                  <strong>Democratizamos la Innovación, A.C.</strong> hace de su conocimiento que los datos podrán ser usados para las siguientes finalidades secundarias:
                </p>
                <ul className="space-y-2 ml-4" style={{ listStyle: 'none' }}>
                  <li className="flex items-start gap-2">
                    <span className="text-[#484A88] mt-1">●</span>
                    <span>Uso para fines estadísticos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#484A88] mt-1">●</span>
                    <span>Captura de imagen, video y voz con fines promocionales</span>
                  </li>
                </ul>
                <p className="mt-4">
                  Para las finalidades establecidas en el párrafo anterior, el titular de los datos puede manifestar su negativa en cualquier momento del tratamiento a través del correo{' '}
                  <a href="mailto:administracion@democratizamoslainnovacion.org" className="text-[#484A88] hover:text-[#1D194C] font-semibold underline">
                    administracion@democratizamoslainnovacion.org
                  </a>.
                </p>
              </div>
            </section>

            {/* Sección 4: Transferencias */}
            <section id="transferencias" className="scroll-mt-8">
              <h2 className="text-2xl sm:text-3xl font-tech font-bold text-[#1D194C] mb-4 sm:mb-6">
                4. TRANSFERENCIAS DE DATOS
              </h2>
              <div className="space-y-4 text-[#1D194C]/80 text-sm sm:text-base">
                <p>
                  Los datos personales solicitados podrán ser transferidos a entidades públicas y privadas a efecto de hacer posible la prestación del servicio solicitado y/o con el fin de cumplir obligaciones legales aplicables a esta organización.
                </p>
                
                {/* Tabla responsive */}
                <div className="overflow-x-auto -mx-4 sm:mx-0">
                  <div className="inline-block min-w-full align-middle">
                    <table className="min-w-full divide-y divide-[#6F74C9]/20 border border-[#6F74C9]/20 rounded-lg overflow-hidden">
                      <thead className="bg-[#484A88] text-white">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs sm:text-sm font-semibold">Destinatario<br />¿A quién?</th>
                          <th className="px-4 py-3 text-left text-xs sm:text-sm font-semibold">Motivo<br />¿Para qué?</th>
                          <th className="px-4 py-3 text-left text-xs sm:text-sm font-semibold">Datos<br />Compartidos</th>
                          <th className="px-4 py-3 text-left text-xs sm:text-sm font-semibold">Requiere<br />Consentimiento</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-[#6F74C9]/20">
                        <tr>
                          <td className="px-4 py-3 text-xs sm:text-sm">Instituciones de gobierno (SAT) y de organizaciones civiles (CLUNI)</td>
                          <td className="px-4 py-3 text-xs sm:text-sm">Para dar cumplimiento a las obligaciones fiscales y de información</td>
                          <td className="px-4 py-3 text-xs sm:text-sm">identificación y financieros</td>
                          <td className="px-4 py-3 text-xs sm:text-sm">No</td>
                        </tr>
                        <tr className="bg-[#F5F6FF]">
                          <td className="px-4 py-3 text-xs sm:text-sm">Aliados estratégicos</td>
                          <td className="px-4 py-3 text-xs sm:text-sm">Emitir certificados, constancias de participación o cualquier otro documento derivado de su participación.</td>
                          <td className="px-4 py-3 text-xs sm:text-sm">Datos de contacto e identificación</td>
                          <td className="px-4 py-3 text-xs sm:text-sm">No</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-xs sm:text-sm">Donantes</td>
                          <td className="px-4 py-3 text-xs sm:text-sm">Para la comprobación de donativos y ejecución de programas</td>
                          <td className="px-4 py-3 text-xs sm:text-sm">Contacto e identificación</td>
                          <td className="px-4 py-3 text-xs sm:text-sm">No</td>
                        </tr>
                        <tr className="bg-[#F5F6FF]">
                          <td className="px-4 py-3 text-xs sm:text-sm">Proveedores de servicios</td>
                          <td className="px-4 py-3 text-xs sm:text-sm">Toma de fotografía y video para la promoción de programas</td>
                          <td className="px-4 py-3 text-xs sm:text-sm">Identificación</td>
                          <td className="px-4 py-3 text-xs sm:text-sm">No</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <p className="mt-4">
                  En caso de que no obtengamos una oposición expresa de su parte para que sus datos personales sean transferidos en la forma y términos antes descritos, entenderemos que ha otorgado su consentimiento para ello.
                </p>
                <p>
                  En ningún caso <strong>Democratizamos la Innovación, A.C.</strong> utilizará o compartirá sus datos personales para fines distintos a los establecidos en el presente aviso, salvo que cuente con el consentimiento expreso del titular o en los casos previstos en el artículo 36 de la "Ley", es decir, cuando así lo establezca una Ley o tratado en el que México sea parte, sea necesaria para prevención o el diagnóstico médico, la prestación de asistencia sanitaria, tratamiento médico, la gestión de servicios sanitarios, sea efectuada a sociedades controladoras, subsidiarias o afiliadas bajo el control común del responsable, en virtud de un contrato celebrado o por celebrarse en interés del titular, por el responsable y un tercero, tenga por objeto cumplir las obligaciones y responsabilidades que dieron lugar a la relación jurídica entre el responsable y el titular, o sean necesarias o legalmente exigidas para la salvaguarda de un interés público, o para la procuración o administración de justicia.
                </p>
                <p>
                  Los receptores de los datos personales, encargados y/o terceros, asumen las mismas obligaciones del responsable de conformidad con los términos definidos en el presente aviso de privacidad y de acuerdo con el artículo 35 de la "Ley".
                </p>
              </div>
            </section>

            {/* Sección 5: Limitar Uso */}
            <section id="limitar-uso" className="scroll-mt-8">
              <h2 className="text-2xl sm:text-3xl font-tech font-bold text-[#1D194C] mb-4 sm:mb-6">
                5. LIMITAR EL USO O DIVULGACIÓN DE SUS DATOS.
              </h2>
              <div className="space-y-3 text-[#1D194C]/80 text-sm sm:text-base">
                <p>
                  Para que el titular pueda, en todo momento, limitar el uso y divulgación de sus datos personales puede obtener más información al respecto en{' '}
                  <a href="mailto:administracion@democratizamoslainnovacion.org" className="text-[#484A88] hover:text-[#1D194C] font-semibold underline">
                    administracion@democratizamoslainnovacion.org
                  </a>
                </p>
              </div>
            </section>

            {/* Sección 6: Derechos ARCO */}
            <section id="derechos-arco" className="scroll-mt-8">
              <h2 className="text-2xl sm:text-3xl font-tech font-bold text-[#1D194C] mb-4 sm:mb-6">
                6. DERECHOS ARCO
              </h2>
              <div className="space-y-4 text-[#1D194C]/80 text-sm sm:text-base">
                <p>
                  Usted tiene derecho a conocer qué datos personales tenemos de usted, para qué los utilizamos y las condiciones del uso que les damos (<strong>Acceso</strong>). Asimismo, es su derecho solicitar la corrección de su información personal en caso de que esté desactualizada, sea inexacta o incompleta (<strong>Rectificación</strong>); que la eliminemos de nuestros registros o bases de datos cuando considere que la misma no está siendo utilizada conforme a los principios, deberes y obligaciones previstas en la normativa (<strong>Cancelación</strong>); así como oponerse al uso de sus datos personales para fines específicos (<strong>Oposición</strong>).
                </p>
                <p>
                  Para el ejercicio de cualquiera de los derechos ARCO, usted deberá presentar la solicitud e información respectiva directamente en nuestras oficinas ubicadas en la calle Francisco Xavier Mina #1000 Int. 9, Col. Zona Centro, Chihuahua, Chih. México, C.P. 31000 o si lo prefiere a través del envío de un correo electrónico a la cuenta{' '}
                  <a href="mailto:administracion@democratizamoslainnovacion.org" className="text-[#484A88] hover:text-[#1D194C] underline">
                    administracion@democratizamoslainnovacion.org
                  </a>{' '}
                  en donde daremos respuesta a su solicitud.
                </p>

                <p className="font-semibold">
                  Los requisitos y procedimiento para el ejercicio de sus Derechos ARCO es el siguiente:
                </p>

                <div className="mt-4 space-y-4">
                  <div>
                    <h4 className="font-medium text-[#484A88] mb-2">a) Información y/o documentos necesarios para el ejercicio de derechos ARCO.</h4>
                    <ul className="ml-4 space-y-1 text-sm" style={{ listStyle: 'none' }}>
                      <li className="flex items-start gap-2">
                        <span className="text-[#484A88] mt-1">•</span>
                        <span>Solicitud de ejercicio de derechos.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#484A88] mt-1">•</span>
                        <span>Copia de los documentos de acreditación del titular o del representante. (En caso del representante poder simple con copia de identificación)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#484A88] mt-1">•</span>
                        <span>Datos de contacto (Nombre, domicilio, correo electrónico y/o teléfono) Del titular.</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-[#484A88] mb-2">b) La solicitud para el ejercicio de derechos ARCO deberá contener:</h4>
                    <ul className="ml-4 space-y-1 text-sm" style={{ listStyle: 'none' }}>
                      <li className="flex items-start gap-2">
                        <span className="text-[#484A88] mt-1">•</span>
                        <span>Nombre y domicilio del titular</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#484A88] mt-1">•</span>
                        <span>Dato del medio por el cual se estará en contacto para las notificaciones de la solicitud.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#484A88] mt-1">•</span>
                        <span>Descripción clara y precisa de los datos personales respecto de los que se busca ejercer alguno de los derechos antes mencionados.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#484A88] mt-1">•</span>
                        <span>Datos que ayuden para la localización de los datos.</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-[#484A88] mb-2">c) Procedimiento de ejercicio de derechos ARCO y/o revocación del consentimiento.</h4>
                    <ul className="ml-4 space-y-1 text-sm" style={{ listStyle: 'none' }}>
                      <li className="flex items-start gap-2">
                        <span className="text-[#484A88] mt-1">●</span>
                        <span>Al recibir la solicitud y en caso de que la información proporcionada sea insuficiente o errónea, o bien, no la acompañen los documentos requeridos, por única vez podremos requerirlos durante los cinco días hábiles siguientes a la recepción de su solicitud y sean agregados los elementos o documentos necesarios para dar trámite a la misma.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#484A88] mt-1">●</span>
                        <span>Como titular de los datos, contará con diez días hábiles para atender el requerimiento, contados a partir del día siguiente en que lo haya recibido. De no dar respuesta en dicho plazo, se tendrá por no presentada la solicitud correspondiente. De atenderse el requerimiento el plazo para la respuesta empezará a correr al día siguiente de su recepción.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#484A88] mt-1">●</span>
                        <span>Al recibir su solicitud y encontrarse completa, realizaremos un análisis de procedencia teniendo veinte días hábiles para ello y quince días hábiles más para en caso de proceder, realizar las actividades operativo-administrativas correspondientes para atender tu solicitud.</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <p className="mt-4">
                  Para más información al respecto se puede comunicar al{' '}
                  <a href="tel:6141418003" className="text-[#484A88] hover:text-[#1D194C] underline">
                    6141418003
                  </a>{' '}
                  y al correo{' '}
                  <a href="mailto:administracion@democratizamoslainnovacion.org" className="text-[#484A88] hover:text-[#1D194C] underline">
                    administracion@democratizamoslainnovacion.org
                  </a>
                </p>
              </div>
            </section>

            {/* Sección 7: Cambios */}
            <section id="cambios" className="scroll-mt-8">
              <h2 className="text-2xl sm:text-3xl font-tech font-bold text-[#1D194C] mb-4 sm:mb-6">
                7. CAMBIOS EN EL AVISO DE PRIVACIDAD
              </h2>
              <div className="space-y-3 text-[#1D194C]/80 text-sm sm:text-base">
                <p>
                  El presente aviso de privacidad puede sufrir modificaciones, cambios o actualizaciones derivadas de nuevos requerimientos legales; de nuestras propias necesidades por los servicios que ofrecemos; de nuestras prácticas de privacidad o por otras causas.
                </p>
                <p>
                  Nos comprometemos a mantenerlo informado sobre los cambios que pueda sufrir el presente aviso de privacidad, mediante su exhibición en nuestras Instalaciones citadas previamente y a través de su publicación en nuestra página de internet{' '}
                  <a href="https://www.democratizamoslainnovación.org" target="_blank" rel="noopener noreferrer" className="text-[#484A88] hover:text-[#1D194C] underline">
                    www.democratizamoslainnovación.org
                  </a>.
                </p>
              </div>
            </section>
          </div>
        </div>
      </Container>
    </div>
  );
}
