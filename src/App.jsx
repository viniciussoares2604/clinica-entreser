import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, ChevronLeft, ChevronRight, HeartHandshake, Instagram, MapPin, MessageCircle, UsersRound } from 'lucide-react'

const clinicImages = [
  '/principal.jpg',
  '/principal2.jpg',
  '/principal3.jpg',
  '/principal4.jpg',
  '/principal5.jpg',
]

const therapists = [
  {
    name: 'Psicóloga Lastênia Soares',
    role: 'CRP – 11/0998',
    image: '/Lastenia.jpg',
    description: 'Texto para descrever a formação, experiência e abordagem terapêutica da psicóloga Lastênia Soares.',
    whatsapp: 'https://wa.me/5585999990001',
    tags: ['Adulto', 'Casal']
  },
  {
    name: 'Psicóloga Silvia Barbosa Correia',
    role: 'CRP – 11/1269',
    image: '/Silvia.png',
    description: 'Olá, me chamo Silvia Barbosa Correia, sou psicóloga (CRP – 11/1269), Gestalt terapeuta, Doutora em Psicologia, Mestre em Avaliação de Políticas Públicas e Especialista em Psicologia Aplicada. A  Gestal Terapia, abordagem que fundamenta minha atuação, se apresenta pra mim, como possibilidade de um encontro entre terapeuta e paciente, que juntos através de uma relação pautada na presença e no diálogo, vão olhar para as questões trazidas pelo paciente que merecem cuidado e que, de alguma forma, estejam causando sofrimento psíquico, no sentido de construir novas possibilidades de existir. Também desenvolvo supervisão clínica na perspectiva gestáltica com profissionais de psicologia que tenham como demanda um olhar técnico, ético e reflexivo sobre casos clínicos e/ou situações de prática profissional.',
    whatsapp: 'https://wa.me/5585981417741',
    tags: ['Adulto', 'Casal']
  },
]

export default function App() {
  const [currentClinicImage, setCurrentClinicImage] = useState(0)

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCurrentClinicImage((current) => (current + 1) % clinicImages.length)
    }, 5000)

    return () => window.clearInterval(interval)
  }, [])

  const showPreviousClinicImage = () => {
    setCurrentClinicImage((current) => (current - 1 + clinicImages.length) % clinicImages.length)
  }

  const showNextClinicImage = () => {
    setCurrentClinicImage((current) => (current + 1) % clinicImages.length)
  }

  return (
    <div className="bg-[#F8F7F4] text-[#4E5C57] overflow-hidden">
      <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-white/70 border-b border-[#dce5dd]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.jpeg" className="w-12 h-12 rounded-full object-cover" />
            <div>
              <h1 className="font-['Playfair_Display'] text-2xl text-[#76A88E]">EntreSer</h1>
              <p className="text-xs tracking-[0.2em] uppercase text-[#7d8d87]">Clínica de Psicologia</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-10 text-sm font-medium">
            <a href="#inicio" className="hover:text-[#76A88E] transition">INÍCIO</a>
            <a href="#terapeutas" className="hover:text-[#76A88E] transition">TERAPEUTAS</a>
            <a href="#formacao" className="hover:text-[#76A88E] transition">FORMAÇÃO</a>
            <a href="#faca-parte" className="hover:text-[#76A88E] transition">FAÇA PARTE</a>
          </div>
        </div>
      </nav>

      <section id="inicio" className="min-h-screen flex items-center pt-32 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
            <span className="bg-[#EED9C8] text-[#7d8d87] px-4 py-2 rounded-full text-sm inline-block mb-6">
              Acolhimento • Cuidado • Transformação
            </span>

            <h1 className="font-['Playfair_Display'] text-5xl lg:text-7xl leading-tight text-[#5f746c] mb-6">
              Um espaço de acolhimento e cuidado emocional.
            </h1>

            <p className="text-lg leading-8 text-[#73827c] mb-10 max-w-xl">
              A clínica EntreSer nasce do compromisso de
mais de 30 anos como psicóloga de sua
diretora Lastênia Soares de Lima, tendo
como objetivo ser um espaço de escuta
acolhedora e encorajadora para mudanças
significativas na vida das pessoas que
buscam o suporte psicoterápico bem como
espaço de formação e supervisão para
profissionais de Psicologia

            </p>

            <div className="flex flex-wrap gap-4">
              <a href="#terapeutas" className="bg-[#76A88E] text-white px-7 py-4 rounded-full hover:scale-105 transition">
                Conheça os terapeutas
              </a>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }} className="relative">
            <div className="relative h-[700px] w-full overflow-hidden rounded-[40px] shadow-2xl">
              {clinicImages.map((image, index) => (
                <img
                  key={image}
                  src={image}
                  className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
                    index === currentClinicImage ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              ))}

              <button
                type="button"
                onClick={showPreviousClinicImage}
                aria-label="Imagem anterior"
                className="absolute left-5 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-3 text-[#5f746c] shadow-md backdrop-blur-sm hover:bg-white transition"
              >
                <ChevronLeft size={24} />
              </button>

              <button
                type="button"
                onClick={showNextClinicImage}
                aria-label="Próxima imagem"
                className="absolute right-5 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-3 text-[#5f746c] shadow-md backdrop-blur-sm hover:bg-white transition"
              >
                <ChevronRight size={24} />
              </button>

              <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
                {clinicImages.map((image, index) => (
                  <button
                    key={image}
                    type="button"
                    onClick={() => setCurrentClinicImage(index)}
                    aria-label={`Mostrar imagem ${index + 1}`}
                    className={`h-2.5 rounded-full transition-all ${
                      index === currentClinicImage ? 'w-8 bg-white' : 'w-2.5 bg-white/55'
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="terapeutas" className="py-20 px-6">
        <div className="max-w-7xl mx-auto text-center mb-14">
          <h2 className="font-['Playfair_Display'] text-5xl text-[#5f746c] mb-4">Nossos Terapeutas</h2>
          <p className="text-[#7a8782] max-w-2xl mx-auto text-lg">
            Profissionais preparados para oferecer um atendimento humano, ético e acolhedor.
          </p>
        </div>

        <div className="max-w-7xl mx-auto flex flex-col gap-7">
          {therapists.map((therapist) => (
            <motion.div
              whileHover={{ x: 8 }}
              key={therapist.name}
              className="flex flex-col md:flex-row md:items-center gap-5 md:gap-7"
            >
              <img
                src={therapist.image}
                className="w-44 h-44 md:w-52 md:h-52 mx-auto md:mx-0 rounded-full object-cover shadow-xl border-4 border-white/80"
              />

              <div className="flex-1 bg-white/70 backdrop-blur-md rounded-[26px] shadow-md border border-white/80 p-7 md:px-10 md:py-7 text-left">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                  <div>
                    <h3 className="font-['Playfair_Display'] text-3xl text-[#5f746c] mb-1">{therapist.name}</h3>
                    <p className="text-[#76A88E] mb-4">{therapist.role}</p>
                    <p className="text-[#7a8782] leading-7 max-w-3xl">{therapist.description}</p>
                  </div>

                  <a
                    href={therapist.whatsapp}
                    target="_blank"
                    rel="noreferrer"
                    className="w-fit shrink-0 bg-[#76A88E] text-white px-6 py-3 rounded-full flex items-center gap-3 hover:scale-105 transition"
                  >
                    <MessageCircle size={18} />
                    Agendar atendimento
                  </a>
                </div>

                <div className="flex flex-wrap gap-2 mt-5">
                  {therapist.tags.map((tag) => (
                    <span key={tag} className="bg-[#edf5ef] text-[#6d877a] px-4 py-2 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>

              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="formacao" className="py-24 px-6">
        <div className="max-w-7xl mx-auto text-center mb-14">
          <h2 className="font-['Playfair_Display'] text-5xl text-[#5f746c] mb-4">Formação Profissional</h2>
          <p className="text-[#7a8782] max-w-2xl mx-auto text-lg">
            Espaços de troca, aprofundamento e desenvolvimento para profissionais e estudantes de Psicologia.
          </p>
        </div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8">
          <motion.div
            whileHover={{ y: -6 }}
            className="bg-white/75 backdrop-blur-md rounded-[30px] border border-white/80 shadow-lg p-10 flex flex-col min-h-[360px]"
          >
            <div className="w-16 h-16 rounded-full bg-[#edf5ef] flex items-center justify-center mb-8">
              <UsersRound className="text-[#76A88E]" />
            </div>

            <h3 className="font-['Playfair_Display'] text-4xl text-[#5f746c] mb-4">Supervisão em Psicologia</h3>
            <p className="text-[#7a8782] leading-8 text-lg mb-8">
              Para profissionais de Psicologia que desejam ampliar sua escuta clínica, discutir casos e fortalecer sua prática em um ambiente cuidadoso e ético.
            </p>

            <a
              href="https://wa.me/5585996189558"
              target="_blank"
              rel="noreferrer"
              className="mt-auto w-fit bg-[#76A88E] text-white px-7 py-4 rounded-full flex items-center gap-3 hover:scale-105 transition"
            >
              <MessageCircle size={20} />
              Tenho interesse
            </a>
          </motion.div>

          <motion.div
            whileHover={{ y: -6 }}
            className="bg-white/75 backdrop-blur-md rounded-[30px] border border-white/80 shadow-lg p-10 flex flex-col min-h-[360px]"
          >
            <div className="w-16 h-16 rounded-full bg-[#edf5ef] flex items-center justify-center mb-8">
              <BookOpen className="text-[#76A88E]" />
            </div>

            <h3 className="font-['Playfair_Display'] text-4xl text-[#5f746c] mb-4">Grupos de Estudos e Cursos</h3>
            <p className="text-[#7a8782] leading-8 text-lg mb-8">
              Para quem busca participar de grupos de estudo, cursos e encontros formativos voltados ao aprofundamento teórico, clínico e profissional.
            </p>

            <a
              href="https://wa.me/5585996189558"
              target="_blank"
              rel="noreferrer"
              className="mt-auto w-fit bg-[#76A88E] text-white px-7 py-4 rounded-full flex items-center gap-3 hover:scale-105 transition"
            >
              <MessageCircle size={20} />
              Tenho interesse
            </a>
          </motion.div>
        </div>
      </section>

      <section id="faca-parte" className="py-28 px-6">
        <div className="max-w-7xl mx-auto bg-white rounded-[40px] overflow-hidden shadow-xl grid lg:grid-cols-2">
          <div className="p-14 flex flex-col justify-center">
            <div className="w-16 h-16 rounded-full bg-[#edf5ef] flex items-center justify-center mb-8">
              <HeartHandshake className="text-[#76A88E]" />
            </div>

            <h2 className="font-['Playfair_Display'] text-5xl text-[#5f746c] mb-6">
              Faça parte da Clínica EntreSer
            </h2>

            <p className="text-[#7a8782] text-lg leading-8 mb-10">
              Se você é psicólogo(a) e procura um ambiente acolhedor, elegante e profissional para realizar seus atendimentos, entre em contato conosco.
            </p>

            <a
              href="https://wa.me/5500000000000"
              className="w-fit bg-[#76A88E] text-white px-8 py-5 rounded-full flex items-center gap-3 hover:scale-105 transition"
            >
              <MessageCircle size={20} />
              Falar com a clínica
            </a>
          </div>

          <img
            src="/faça-parte.jpg"
            className="h-full w-full object-cover min-h-[500px]"
          />
        </div>
      </section>

      <footer className="bg-[#76A88E] text-white py-14 px-6">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between gap-10">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <img src="/logo.jpeg" className="w-14 h-14 rounded-full" />
              <div>
                <h3 className="font-['Playfair_Display'] text-3xl">EntreSer</h3>
                <p className="text-white/70 text-sm">Clínica de Psicologia</p>
              </div>
            </div>

            <p className="text-white/70 max-w-md leading-7">
              Um espaço pensado para acolher, cuidar e transformar através da psicologia.
            </p>
          </div>

          <div className="space-y-4 text-white/80">
            <a
              href="https://www.google.com/maps/place/Clinica+de+Psicologia+EntreSer/@-3.7436274,-38.5009661,17z/data=!3m1!4b1!4m6!3m5!1s0x7c749ad2ab1169b:0x402bd5b6cfe2eaa4!8m2!3d-3.7436274!4d-38.5009661!16s%2Fg%2F11njy6s6c7?entry=ttu&g_ep=EgoyMDI2MDUxMy4wIKXMDSoASAFQAw%3D%3D"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 hover:text-white transition"
            >
              <MapPin size={18} /> Av. Des. Moreira, 2120 - sala 702 
            </a>

            <a
              href="https://wa.me/5585996189558"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 hover:text-white transition"
            >
              <MessageCircle size={18} /> (85) 99618-9558
            </a>

            <a
              href="https://www.instagram.com/clinicaentreser/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 hover:text-white transition"
            >
              <Instagram size={18} /> @clinicaentreser
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
