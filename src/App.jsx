import React from "react";
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Copy,
  Clock,
  CreditCard,
  HeartHandshake,
  Instagram,
  LogIn,
  MapPin,
  MessageCircle,
  RefreshCw,
  Send,
  UserPlus,
  UsersRound,
} from 'lucide-react'
import {
  createMonthlyPixEnrollment,
  createStudyGroupEnrollment,
  createStudyGroup,
  deleteStudyGroup,
  listActiveStudyGroups,
  updateStudyGroup,
  uploadStudyGroupImage,
} from './services/studyGroupsService'
import { login } from './services/authService'

const clinicImages = [
  '/principal.jpg',
  '/principal2.jpg',
  '/principal3.jpg',
  '/principal4.jpg',
  '/principal5.jpg',
]

const therapists = [
  {
    name: 'Psicóloga Lastênia Soares de Lima',
    role: 'CRP – 11/0998',
    image: '/Lastenia.jpg',
    description: 'Olá, sou Lastênia Soares de Lima, psicóloga, gestalt-terapeuta, mestre em Educação, especialista em mediação de conflitos e diretora da Clínica EntreSer. Formei-me em Psicologia em 1993 e, desde então, meu trabalho sempre foi orientado pela abordagem gestáltica, entendendo-a como um modo de compreender o mundo, as pessoas e os vínculos sociais constituídos. Com formação também especializada nesse público, atendo adolescentes, jovens, adultos, idosos, casais e famílias. Sou facilitadora de processos grupais, professora em institutos de formação em Gestalt-terapia, supervisora clínica e consultora em Psicologia Social na área de prevenção e proteção de crianças, adolescentes e famílias em situações de vulnerabilidade social. Um dos aspectos centrais para mim sobre o processo psicoterápico é a relação estabelecida entre as pessoas envolvidas nesse processo (psicoterapeuta e paciente), compreendendo esse ENTRE como uma dinâmica fluida de contatos para a construção de ajustamentos saudáveis na relação eu-outro e eu-mundo.',
    whatsapp: 'https://wa.me/5585996189558',
    tags: ['Adultos', 'Jovens', 'Idosos', 'Casais', 'Famílias']
  },
  {
    name: 'Psicóloga Silvia Barbosa Correia',
    role: 'CRP – 11/1269',
    image: '/Silvia.png',
    description: 'Olá, me chamo Silvia Barbosa Correia, sou psicóloga (CRP 11/1269), gestalt-terapeuta, doutora em Psicologia, mestre em Avaliação de Políticas Públicas e especialista em Psicologia Aplicada. A Gestalt-terapia, abordagem que fundamenta minha atuação, apresenta-se para mim como a possibilidade de um encontro entre terapeuta e paciente, que, juntos, por meio de uma relação pautada na presença e no diálogo, irão olhar para as questões trazidas pelo paciente que merecem cuidado e que, de alguma forma, estejam causando sofrimento psíquico, buscando construir novas possibilidades de existir. Também desenvolvo supervisão clínica na perspectiva gestáltica com profissionais de Psicologia que tenham como demanda um olhar técnico, ético e reflexivo sobre casos clínicos e/ou situações da prática profissional.',
    whatsapp: 'https://wa.me/5585981417741',
    tags: ['Jovens a partir de 18 anos', 'Adultos', 'Idosos']
  },
  {
    name: 'Psicóloga Paloma Roberta Silva Souza',
    role: 'CRP – 11/13762',
    image: '/Paloma.jpeg',
    description: 'Me chamo Paloma Roberta, graduada em Psicologia pela Universidade de Fortaleza. Aprofundei meus estudos por meio da formação em Gestalt-Terapia com crianças e adolescentes pelo Centro Gestáltico de Fortaleza e da especialização em Gestalt-Terapia pelo Instituto Gestalt do Ceará. Em paralelo à clínica, também estive dedicada à área escolar como psicóloga educacional. Sou psicoterapeuta há 7 anos, e foi através da Gestalt-Terapia e do trabalho com crianças e adolescentes que consegui aperfeiçoar minha prática e olhar para além do que está na superfície. Por meio de uma maneira mais autêntica e consciente, é possível perceber o quão significativo é o aqui e agora, a genuinidade das nossas experiências e como elas podem traduzir nossa forma de ser no mundo. Esses aspectos apenas reafirmam o quanto esse suporte é potente dentro do processo de desenvolvimento. A infância é um chão que pisamos a vida inteira!',
    whatsapp: 'https://wa.me/5585986321467',
    tags: ['Crianças a partir de 3 anos', 'Adolescentes', 'Jovens']
  },
  {
    name: 'Psicólogo Antonio Joelmir Portela da Silva',
    role: 'CRP – 11/20926',
    image: '/Joelmir.jpeg',
    description: 'Olá! Eu sou Joelmir, psicólogo formado pela Universidade Federal do Piauí (UFPI), doutorando em Psicologia pela Universidade Federal do Ceará (UFC) e mestre em Psicologia pela Universidade Federal do Delta do Parnaíba (UFDPAR). Tenho formação clínica em Gestalt-terapia com casais e famílias, além de formação em Gestalt-terapia com crianças e adolescentes. A Psicologia e a Gestalt-terapia sempre me fizeram perceber o mundo com uma curiosidade singular, suficiente para despertar em mim o interesse em estudar, pesquisar e ensinar esse ofício tão delicado que é a escuta e a clínica psicológica. A Gestalt-terapia é um convite ao reconhecimento das nossas singularidades, facilitando que possamos assumir quem somos, reverenciando nossa experiência de vida e percebendo as possibilidades de futuro a partir do presente. Sou professor universitário, com interesse em estudos relacionados à Saúde Coletiva, Saúde Mental, Psicologia da Saúde, vínculos íntimos, saúde voltada a grupos em situação de vulnerabilidade e intervenções psicossociais. Na clínica, atendo adolescentes a partir dos 16 anos, adultos, casais e famílias. Também facilito supervisão individual e em grupo para psicoterapeutas.',
    whatsapp: 'https://wa.me/5585999698889',
    tags: ['Jovens a partir de 16 anos', 'Adultos', 'Casais', 'Famílias']
  },
]

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
})

const clinicWhatsappNumber = '5585996189558'
const clinicPixKey = '85996189558'

function formatPrice(priceInCents) {
  return currencyFormatter.format(priceInCents / 100)
}

function formatDate(date) {
  return dateFormatter.format(new Date(`${date}T12:00:00`))
}

function getInstallmentCount(group) {
  if (group?.installmentCount) return group.installmentCount
  if (group?.id === 'self-da-situacao-gestalt-2026') return 5
  if (group?.id === 'psicopatologia-critica-gestalt-fenomenologia-2026') return 5
  return 1
}

function getCardTotalInCents(group) {
  return group.priceInCents * getInstallmentCount(group)
}

function formatInstallmentLabel(group) {
  const installments = getInstallmentCount(group)

  return `até ${installments}x`
}

function slugify(text) {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function buildStudyGroupId(title, startsAt) {
  const baseSlug = slugify(title) || 'curso'
  const dateSlug = startsAt ? startsAt.replace(/-/g, '') : Date.now()

  return `${baseSlug}-${dateSlug}`
}

export default function App() {
  const [currentClinicImage, setCurrentClinicImage] = useState(0)
  const [expandedTherapists, setExpandedTherapists] = useState({})
  const [currentPath, setCurrentPath] = useState(window.location.pathname)
  const [authenticated, setAuthenticated] = useState(() => {
    try {
      return Boolean(window.localStorage.getItem('entreser-admin-token'))
    } catch {
      return false
    }
  })

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCurrentClinicImage((current) => (current + 1) % clinicImages.length)
    }, 5000)

    return () => window.clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleNavigation = () => setCurrentPath(window.location.pathname)
    window.addEventListener('popstate', handleNavigation)

    return () => window.removeEventListener('popstate', handleNavigation)
  }, [])

  useEffect(() => {
    if (currentPath.startsWith('/admin-grupos') && !authenticated) {
      window.history.replaceState({}, '', '/login')
      setCurrentPath('/login')
      return
    }

    if (currentPath === '/login' && authenticated) {
      window.history.replaceState({}, '', '/admin-grupos')
      setCurrentPath('/admin-grupos')
    }
  }, [currentPath, authenticated])

  const navigateTo = (path) => {
    window.history.pushState({}, '', path)
    setCurrentPath(path)
  }

  if (currentPath === '/grupos-de-estudos') {
    return <StudyGroupsPage />
  }

  if (currentPath === '/login') {
    return (
      <LoginPage
        onSuccess={() => {
          setAuthenticated(true)
          navigateTo('/admin-grupos')
        }}
      />
    )
  }

  if (currentPath === '/admin-grupos') {
    if (!authenticated) {
      return null
    }

    return <StudyGroupsAdminPage onLogout={() => {
      window.localStorage.removeItem('entreser-admin-token')
      window.localStorage.removeItem('entreser-admin-auth')
      setAuthenticated(false)
      navigateTo('/login')
    }} />
  }

  if (currentPath === '/inscricao-confirmada') {
    return <EnrollmentConfirmationPage />
  }

  if (currentPath === '/pagamento-pix-mensal') {
    return <MonthlyPixPaymentPage />
  }

  const showPreviousClinicImage = () => {
    setCurrentClinicImage((current) => (current - 1 + clinicImages.length) % clinicImages.length)
  }

  const showNextClinicImage = () => {
    setCurrentClinicImage((current) => (current + 1) % clinicImages.length)
  }

  const toggleTherapistDescription = (name) => {
    setExpandedTherapists((current) => ({
      ...current,
      [name]: !current[name],
    }))
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
            <a href="#terapeutas" className="hover:text-[#76A88E] transition">PSICOTERAPEUTAS</a>
            <a href="#formacao" className="hover:text-[#76A88E] transition">FORMAÇÃO</a> 
            <a href="#faca-parte" className="hover:text-[#76A88E] transition">FAÇA PARTE</a>
            <button
              type="button"
              onClick={() => navigateTo('/login')}
              aria-label="Acessar área administrativa"
              title="Acessar área administrativa"
              className="w-10 h-10 rounded-full border border-[#dce5dd] bg-white/70 text-[#5f746c] flex items-center justify-center hover:border-[#76A88E] hover:text-[#76A88E] transition"
            >
              <LogIn size={18} />
            </button>
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
                Conheça os psicoterapeutas
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
          <h2 className="font-['Playfair_Display'] text-5xl text-[#5f746c] mb-4">Nossas(os) Psicoterapeutas</h2>
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
                    <p
                      className="text-[#7a8782] leading-7 max-w-3xl"
                      style={
                        expandedTherapists[therapist.name]
                          ? undefined
                          : {
                              display: '-webkit-box',
                              WebkitLineClamp: 4,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                            }
                      }
                    >
                      {therapist.description}
                    </p>

                    <button
                      type="button"
                      onClick={() => toggleTherapistDescription(therapist.name)}
                      className="mt-3 text-sm font-semibold text-[#76A88E] hover:text-[#5f746c] transition"
                    >
                      {expandedTherapists[therapist.name] ? 'Mostrar menos' : 'Ler mais'}
                    </button>
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
              href="/grupos-de-estudos"
              className="mt-auto w-fit bg-[#76A88E] text-white px-7 py-4 rounded-full flex items-center gap-3 hover:scale-105 transition"
            >
              <BookOpen size={20} />
              Ver grupos ativos
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
              href="https://wa.me/+5585996189558"
              className="w-fit bg-[#76A88E] text-white px-8 py-5 rounded-full flex items-center gap-3 hover:scale-105 transition"
            >
              <MessageCircle size={20} />
              Falar com a clínica
            </a>
          </div>

          <img
            src="/faça-parte.jpeg"
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

function LoginPage({ onSuccess }) {
  const [formData, setFormData] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const payload = await login(formData)
      window.localStorage.setItem('entreser-admin-token', payload.token)
      onSuccess()
    } catch (loginError) {
      setError(loginError.message || 'Usuário ou senha inválidos.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-[#4E5C57] flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-xl bg-white rounded-[28px] border border-[#dce5dd] shadow-xl p-10">
        <div className="mb-8 text-center">
          <h1 className="font-['Playfair_Display'] text-4xl text-[#5f746c] mb-3">Acesso administrativo</h1>
          <p className="text-[#7a8782]">Faça login para acessar a área de cadastro de cursos e grupos.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <FormField label="Usuário" name="username" value={formData.username} onChange={handleChange} required />
          <FormField label="Senha" name="password" type="password" value={formData.password} onChange={handleChange} required />

          {error && (
            <div className="rounded-[20px] bg-[#FBE8E8] border border-[#F2C2C2] p-4 text-[#8a3d3d]">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#76A88E] text-white px-7 py-4 rounded-full text-base font-semibold hover:scale-[1.02] transition disabled:opacity-70"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}

function StudyGroupsPage() {
  const [studyGroups, setStudyGroups] = useState([])
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    participantType: '',
    professionalDocument: '',
    paymentMethod: '',
  })
  const [enrollmentStatus, setEnrollmentStatus] = useState('idle')
  const [checkoutMessage, setCheckoutMessage] = useState('')

  useEffect(() => {
    listActiveStudyGroups().then(setStudyGroups)
  }, [])

  const openEnrollment = (group) => {
    setSelectedGroup(group)
    setEnrollmentStatus('idle')
    setCheckoutMessage('')
  }

  const closeEnrollment = () => {
    setSelectedGroup(null)
    setEnrollmentStatus('idle')
    setCheckoutMessage('')
  }

  const updateFormData = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const submitEnrollment = async (event) => {
    event.preventDefault()
    if (!selectedGroup) return

    setEnrollmentStatus('saving')
    setCheckoutMessage('')

    try {
      const participantTypeLabel =
        formData.participantType === 'psychology_professional'
          ? 'Profissional de Psicologia'
          : 'Estudante'
      const participant = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        professionalProfile: `${participantTypeLabel} - CRP ou Semestre: ${formData.professionalDocument}`,
      }

      if (formData.paymentMethod === 'monthly_pix') {
        const pixEnrollment = await createMonthlyPixEnrollment({
          studyGroup: selectedGroup,
          participant,
        })
        const pixUrl = `/pagamento-pix-mensal?enrollment=${encodeURIComponent(
          pixEnrollment.enrollmentId,
        )}&group=${encodeURIComponent(pixEnrollment.studyGroupTitle)}&amount=${encodeURIComponent(
          pixEnrollment.amountInCents,
        )}`

        window.location.href = pixUrl
        return
      }

      const checkout = await createStudyGroupEnrollment({
        studyGroup: selectedGroup,
        participant,
      })

      if (checkout.checkoutUrl) {
        const confirmationUrl = `/inscricao-confirmada?enrollment=${encodeURIComponent(
          checkout.enrollmentId,
        )}&checkout=${encodeURIComponent(checkout.checkoutUrl)}`
        window.location.href = confirmationUrl
        return
      }

      setEnrollmentStatus('saved')
      setCheckoutMessage('Sua inscrição foi registrada. O checkout será aberto em instantes.')
    } catch (error) {
      setEnrollmentStatus('idle')
      setCheckoutMessage(error.message || 'Não foi possível iniciar sua inscrição. Tente novamente.')
    }
  }

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-[#4E5C57]">
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/75 border-b border-[#dce5dd]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <img src="/logo.jpeg" className="w-12 h-12 rounded-full object-cover" />
            <div>
              <h1 className="font-['Playfair_Display'] text-2xl text-[#76A88E]">EntreSer</h1>
              <p className="text-xs tracking-[0.2em] uppercase text-[#7d8d87]">Clínica de Psicologia</p>
            </div>
          </a>

          <a href="/" className="hidden sm:flex items-center gap-2 text-sm font-semibold text-[#5f746c] hover:text-[#76A88E] transition">
            <ArrowLeft size={18} />
            Voltar para o site
          </a>
        </div>
      </nav>

      <main>
        <section className="px-6 pt-16 pb-12">
          <div className="max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <span className="bg-[#EED9C8] text-[#6f7f79] px-4 py-2 rounded-full text-sm inline-block mb-6">
                Grupos ativos para inscrição
              </span>

              <h2 className="font-['Playfair_Display'] text-5xl lg:text-7xl leading-tight text-[#5f746c] mb-6">
                Grupos de Estudos e Cursos
              </h2>

              <p className="text-lg leading-8 text-[#73827c] max-w-2xl">
                Encontros formativos para aprofundar leituras, ampliar repertórios clínicos e sustentar trocas entre estudantes e profissionais da Psicologia. Acompanhe os grupos disponíveis, escolha o percurso de estudo desejado e realize sua inscrição pelo site.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="px-6 pb-24">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-7">
            {studyGroups.map((group) => (
              <motion.article
                key={group.id}
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                className="bg-white/80 border border-white shadow-lg rounded-[28px] p-8 flex flex-col"
              >
                {group.bannerImage && (
                  <img
                    src={group.bannerImage}
                    alt=""
                    className="mb-7 w-full rounded-[20px] object-contain border border-[#e5ece7] bg-[#F8F7F4]"
                    style={{ objectPosition: group.bannerPosition || 'center top' }}
                  />
                )}

                <h3 className="font-['Playfair_Display'] text-4xl text-[#5f746c] mb-3">{group.title}</h3>
                <p className="text-[#7a8782] leading-7 mb-6">{group.subtitle}</p>

                <div className="grid sm:grid-cols-2 gap-4 mb-7">
                  <DetailItem icon={CalendarDays} label="Início" value={formatDate(group.startsAt)} />
                  <DetailItem icon={Clock} label="Duração" value={group.duration} />
                  <DetailItem icon={UsersRound} label="Formato" value={group.format} />
                  <DetailItem icon={BookOpen} label="Encontros" value={group.schedule} />
                </div>

                <div className="space-y-3 mb-8">
                  {group.highlights.map((highlight) => (
                    <div key={highlight} className="flex items-center gap-3 text-[#6c7f78]">
                      <CheckCircle2 size={18} className="text-[#76A88E] shrink-0" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 border-t border-[#e5ece7] pt-6">
                  <div>
                    <p className="text-sm text-[#7a8782]">Investimento</p>
                    <p className="font-['Playfair_Display'] text-3xl text-[#5f746c]">
                      {formatPrice(group.priceInCents)} {group.pixPaymentType === 'total' ? 'total' : 'mensal'}
                    </p>
                    <p className="text-sm text-[#7a8782] mt-1">Ou em {formatInstallmentLabel(group)} no cartão</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => openEnrollment(group)}
                    className="bg-[#76A88E] text-white px-7 py-4 rounded-full flex items-center justify-center gap-3 hover:scale-105 transition"
                  >
                    <UserPlus size={20} />
                    Quero me inscrever
                  </button>
                </div>
              </motion.article>
            ))}
          </div>
        </section>
      </main>

      {selectedGroup && (
        <div className="fixed inset-0 z-[60] bg-[#26352f]/45 backdrop-blur-sm px-4 py-6 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-white rounded-[28px] shadow-2xl p-7 md:p-9"
          >
            <div className="flex items-start justify-between gap-5 mb-7">
              <div>
                <p className="text-sm font-semibold text-[#76A88E] mb-2">Inscrição</p>
                <h3 className="font-['Playfair_Display'] text-3xl text-[#5f746c]">{selectedGroup.title}</h3>
              </div>

              <button
                type="button"
                onClick={closeEnrollment}
                className="rounded-full bg-[#edf5ef] px-4 py-2 text-[#5f746c] hover:bg-[#dfece4] transition"
              >
                Fechar
              </button>
            </div>

            <form onSubmit={submitEnrollment} className="space-y-5">
              <FormField label="Nome completo" name="name" value={formData.name} onChange={updateFormData} required />
              <FormField label="E-mail" name="email" type="email" value={formData.email} onChange={updateFormData} required />
              <FormField label="WhatsApp" name="phone" value={formData.phone} onChange={updateFormData} required />
              <SelectField
                label="Perfil"
                name="participantType"
                value={formData.participantType}
                onChange={updateFormData}
                required
                options={[
                  { value: '', label: 'Selecione uma opção' },
                  { value: 'psychology_professional', label: 'Profissional de Psicologia' },
                  { value: 'student', label: 'Estudante' },
                ]}
              />
              <FormField
                label="CRP ou Semestre (Em caso de estudante)"
                name="professionalDocument"
                value={formData.professionalDocument}
                onChange={updateFormData}
                placeholder="Ex.: CRP 11/00000 ou 7º semestre"
                disabled={!formData.participantType}
                required
              />
              <SelectField
                label="Forma de pagamento"
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={updateFormData}
                required
                options={[
                  { value: '', label: 'Selecione uma opção' },
                  {
                    value: 'card',
                    label: `Cartão de débito/crédito (em ${formatInstallmentLabel(selectedGroup)})`,
                  },
                  {
                    value: 'monthly_pix',
                    label:
                      selectedGroup.pixPaymentType === 'total'
                        ? `Pix total (${formatPrice(selectedGroup.priceInCents)})`
                        : `Pix mensal (${formatPrice(selectedGroup.priceInCents)})`,
                  },
                ]}
              />

              <div className="bg-[#F8F7F4] border border-[#e5ece7] rounded-[20px] p-5">
                <p className="text-sm text-[#7a8782] mb-1">Pagamento previsto</p>
                <p className="font-semibold text-[#5f746c]">
                  {formData.paymentMethod === 'monthly_pix'
                    ? selectedGroup.pixPaymentType === 'total'
                      ? `${formatPrice(selectedGroup.priceInCents)} total via Pix`
                      : `${formatPrice(selectedGroup.priceInCents)} mensais via Pix`
                    : `${formatPrice(getCardTotalInCents(selectedGroup))} no cartão em ${formatInstallmentLabel(selectedGroup)}`}
                </p>
              </div>

              {checkoutMessage && (
                <p className="bg-[#edf5ef] text-[#5f746c] rounded-[18px] p-4 leading-7">
                  {checkoutMessage}
                </p>
              )}

              <button
                type="submit"
                disabled={enrollmentStatus === 'saving'}
                className="w-full bg-[#76A88E] text-white px-7 py-4 rounded-full flex items-center justify-center gap-3 hover:scale-[1.02] transition disabled:opacity-70"
              >
                <CreditCard size={20} />
                {enrollmentStatus === 'saving' ? 'Registrando inscrição...' : 'Registrar inscrição'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}

function StudyGroupsAdminPage({ onLogout }) {
  const [studyGroups, setStudyGroups] = useState([])
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    startsAt: '',
    duration: '',
    format: '',
    schedule: '',
    highlights: '',
    price: '',
    pixPaymentType: 'monthly',
    installmentCount: 1,
    bannerImage: '',
    audience: '',
    facilitator: '',
    seatsAvailable: 20,
    contactWhatsapp: '',
  })
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)

  useEffect(() => {
    listActiveStudyGroups().then(setStudyGroups)
  }, [])

  const refreshGroups = async () => {
    const groups = await listActiveStudyGroups()
    setStudyGroups(groups)
  }

  const resetForm = () => {
    setSelectedGroup(null)
    setFormData({
      title: '',
      subtitle: '',
      startsAt: '',
      duration: '',
      format: '',
      schedule: '',
      highlights: '',
      price: '',
      pixPaymentType: 'monthly',
      installmentCount: 1,
      bannerImage: '',
      audience: '',
      facilitator: '',
      seatsAvailable: 20,
      contactWhatsapp: '',
    })
    setMessage('')
  }

  const openCreateForm = () => {
    resetForm()
  }

  const openEditForm = (group) => {
    setSelectedGroup(group)
    setFormData({
      title: group.title,
      subtitle: group.subtitle,
      startsAt: group.startsAt,
      duration: group.duration,
      format: group.format,
      schedule: group.schedule,
      highlights: group.highlights.join('\n'),
      price: (group.priceInCents / 100).toFixed(2),
      pixPaymentType: group.pixPaymentType || 'monthly',
      installmentCount: group.installmentCount || 1,
      bannerImage: group.bannerImage || '',
      audience: group.audience || '',
      facilitator: group.facilitator || '',
      seatsAvailable: group.seatsAvailable || 20,
      contactWhatsapp: group.contactWhatsapp || '',
    })
    setMessage('')
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const handleImageChange = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    setMessage('')

    try {
      const url = await uploadStudyGroupImage(file)
      setFormData((current) => ({ ...current, bannerImage: url }))
      setMessage('Imagem enviada com sucesso.')
    } catch (error) {
      setMessage(error.message || 'Não foi possível enviar a imagem.')
    } finally {
      setUploadingImage(false)
    }
  }

  const saveGroup = async (event) => {
    event.preventDefault()
    setSaving(true)
    setMessage('')

    try {
      const priceInCents = Math.round(Number(formData.price.replace(/,/g, '.')) * 100)
      const installmentCount = Number(formData.installmentCount) || 1

      if (!Number.isFinite(priceInCents) || priceInCents <= 0) {
        throw new Error('Informe um valor válido para o curso.')
      }

      if (installmentCount < 1 || installmentCount > 12) {
        throw new Error('Informe uma quantidade de parcelas entre 1 e 12.')
      }

      const payload = {
        id: selectedGroup?.id || buildStudyGroupId(formData.title, formData.startsAt),
        title: formData.title,
        subtitle: formData.subtitle,
        status: 'active',
        audience: formData.audience,
        format: formData.format,
        schedule: formData.schedule,
        starts_at: formData.startsAt,
        duration: formData.duration,
        seats_available: Number(formData.seatsAvailable) || 20,
        price_in_cents: priceInCents,
        installment_count: installmentCount,
        pix_payment_type: formData.pixPaymentType || 'monthly',
        facilitator: formData.facilitator,
        banner_image: formData.bannerImage,
        banner_position: 'center center',
        contact_whatsapp: formData.contactWhatsapp,
        highlights: formData.highlights
          .split('\n')
          .map((item) => item.trim())
          .filter(Boolean),
      }

      if (selectedGroup) {
        await updateStudyGroup(payload)
        setMessage('Curso atualizado com sucesso.')
      } else {
        await createStudyGroup(payload)
        setMessage('Curso criado com sucesso.')
      }

      resetForm()
      await refreshGroups()
    } catch (error) {
      setMessage(error.message || 'Não foi possível salvar o curso.')
    } finally {
      setSaving(false)
    }
  }

  const removeGroup = async (groupId) => {
    const confirmed = window.confirm('Deseja realmente remover este curso/grupo?')
    if (!confirmed) return

    try {
      await deleteStudyGroup(groupId)
      setMessage('Curso removido com sucesso.')
      if (selectedGroup?.id === groupId) {
        resetForm()
      }
      await refreshGroups()
    } catch (error) {
      setMessage(error.message || 'Não foi possível remover o curso.')
    }
  }

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-[#4E5C57]">
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/75 border-b border-[#dce5dd]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <a href="/" className="flex items-center gap-3">
            <img src="/logo.jpeg" className="w-12 h-12 rounded-full object-cover" />
            <div>
              <h1 className="font-['Playfair_Display'] text-2xl text-[#76A88E]">EntreSer</h1>
              <p className="text-xs tracking-[0.2em] uppercase text-[#7d8d87]">Administração de grupos</p>
            </div>
          </a>

          <div className="flex flex-wrap items-center gap-3">
            <a href="/grupos-de-estudos" className="hidden sm:flex items-center gap-2 text-sm font-semibold text-[#5f746c] hover:text-[#76A88E] transition">
              <ArrowLeft size={18} />
              Voltar para inscrições
            </a>
            <button
              type="button"
              onClick={onLogout}
              className="bg-[#F6D1D1] text-[#914141] px-5 py-3 rounded-full text-sm font-semibold hover:bg-[#edc8c8] transition"
            >
              Sair
            </button>
          </div>
        </div>
      </nav>

      <main className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <header className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span className="bg-[#EED9C8] text-[#6f7f79] px-4 py-2 rounded-full text-sm inline-block mb-4">
                Administração de grupos ativos
              </span>
              <h2 className="font-['Playfair_Display'] text-5xl text-[#5f746c]">Gerenciar cursos e grupos de estudo</h2>
              <p className="text-lg leading-8 text-[#73827c] max-w-2xl mt-4">
                Crie, edite ou remova cursos ativos. Os grupos serão publicados imediatamente e poderão ser inscritos pelo site.
              </p>
            </div>

            <button
              type="button"
              onClick={openCreateForm}
              className="w-fit bg-[#76A88E] text-white px-7 py-4 rounded-full flex items-center justify-center gap-3 hover:scale-105 transition"
            >
              <BookOpen size={20} />
              Novo curso/grupo
            </button>
          </header>

          <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-6">
              {!studyGroups.length && (
                <div className="bg-white border border-[#e5ece7] rounded-[28px] p-6 shadow-sm text-[#7a8782]">
                  Nenhum curso ativo encontrado.
                </div>
              )}

              {studyGroups.map((group) => (
                <div key={group.id} className="bg-white border border-[#e5ece7] rounded-[28px] p-6 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div>
                      {group.bannerImage && (
                        <img
                          src={group.bannerImage}
                          alt=""
                          className="mb-4 h-36 w-full rounded-[18px] border border-[#e5ece7] bg-[#F8F7F4] object-cover sm:w-56"
                          style={{ objectPosition: group.bannerPosition || 'center center' }}
                        />
                      )}
                      <h3 className="text-2xl font-semibold text-[#5f746c]">{group.title}</h3>
                      <p className="text-[#7a8782] mt-1">{group.subtitle}</p>
                      <p className="mt-3 text-sm font-semibold text-[#5f746c]">
                        {formatPrice(group.priceInCents)} {group.pixPaymentType === 'total' ? 'total no Pix' : 'mensal no Pix'} · cartão em {formatInstallmentLabel(group)}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => openEditForm(group)}
                        className="bg-[#edf5ef] text-[#5f746c] px-4 py-2 rounded-full hover:bg-[#dfece4] transition"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => removeGroup(group.id)}
                        className="bg-[#F6D1D1] text-[#914141] px-4 py-2 rounded-full hover:bg-[#edc8c8] transition"
                      >
                        Remover
                      </button>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <DetailItem icon={CalendarDays} label="Início" value={formatDate(group.startsAt)} />
                    <DetailItem icon={Clock} label="Duração" value={group.duration} />
                    <DetailItem icon={UsersRound} label="Formato" value={group.format} />
                    <DetailItem icon={BookOpen} label="Encontros" value={group.schedule} />
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white border border-[#e5ece7] rounded-[28px] p-8 shadow-sm">
              <h3 className="text-3xl font-semibold text-[#5f746c] mb-6">
                {selectedGroup ? 'Editar curso/grupo' : 'Adicionar novo curso/grupo'}
              </h3>

              <form onSubmit={saveGroup} className="space-y-5">
                <FormField label="Título" name="title" value={formData.title} onChange={handleChange} required />
                <TextAreaField label="Descrição" name="subtitle" value={formData.subtitle} onChange={handleChange} rows={3} required />
                <FormField label="Data de início" name="startsAt" type="date" value={formData.startsAt} onChange={handleChange} required />
                <FormField label="Duração" name="duration" value={formData.duration} onChange={handleChange} required />
                <FormField label="Formato" name="format" value={formData.format} onChange={handleChange} placeholder="Online/Presencial e plataforma" required />
                <FormField label="Encontros" name="schedule" value={formData.schedule} onChange={handleChange} placeholder="Semanal, mensal, diário, anual..." required />
                <TextAreaField label="Informações adicionais" name="highlights" value={formData.highlights} onChange={handleChange} placeholder="Uma linha por item" rows={4} />
                <FormField label="Facilitador" name="facilitator" value={formData.facilitator} onChange={handleChange} />
                <FormField label="Público" name="audience" value={formData.audience} onChange={handleChange} />
                <FormField label="Valor do curso (R$)" name="price" type="text" value={formData.price} onChange={handleChange} required />

                <div className="grid sm:grid-cols-2 gap-4">
                  <SelectField
                    label="Pix"
                    name="pixPaymentType"
                    value={formData.pixPaymentType}
                    onChange={handleChange}
                    options={[
                      { value: 'monthly', label: 'Pix mensal' },
                      { value: 'total', label: 'Pix total' },
                    ]}
                    required
                  />
                  <FormField
                    label="Parcelas no cartão"
                    name="installmentCount"
                    type="number"
                    value={formData.installmentCount}
                    onChange={handleChange}
                    min={1}
                    max={12}
                    required
                  />
                </div>

                <FormField
                  label="Assentos disponíveis"
                  name="seatsAvailable"
                  type="number"
                  value={formData.seatsAvailable}
                  onChange={handleChange}
                  min={1}
                />

                <label className="block">
                  <span className="block text-sm font-semibold text-[#5f746c] mb-2">Upload de imagem</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full rounded-[18px] border border-[#dce5dd] bg-white px-4 py-3 text-[#4E5C57] outline-none focus:border-[#76A88E] focus:ring-4 focus:ring-[#76A88E]/15 transition"
                  />
                </label>

                {formData.bannerImage && (
                  <img src={formData.bannerImage} alt="Preview" className="mt-4 w-full rounded-[20px] border border-[#e5ece7] object-cover" />
                )}

                {message && (
                  <div className="rounded-[20px] bg-[#edf5ef] border border-[#dfece4] p-4 text-[#5f746c]">
                    {message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={saving || uploadingImage}
                  className="w-full bg-[#76A88E] text-white px-7 py-4 rounded-full flex items-center justify-center gap-3 hover:scale-[1.02] transition disabled:opacity-70"
                >
                  {saving ? 'Salvando...' : selectedGroup ? 'Atualizar curso' : 'Criar curso'}
                </button>
              </form>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

function MonthlyPixPaymentPage() {
  const searchParams = new URLSearchParams(window.location.search)
  const enrollmentId = searchParams.get('enrollment')
  const studyGroupTitle = searchParams.get('group') || 'Grupo de estudos'
  const amountInCents = Number(searchParams.get('amount') || 0)
  const [copyMessage, setCopyMessage] = useState('')
  const whatsappMessage = [
    'Olá, Clínica EntreSer!',
    'Realizei o pagamento mensal via Pix da minha inscrição.',
    `Grupo: ${studyGroupTitle}`,
    enrollmentId ? `Código da inscrição: ${enrollmentId}` : null,
    'Segue o comprovante de pagamento.',
  ]
    .filter(Boolean)
    .join('\n')
  const whatsappUrl = `https://wa.me/${clinicWhatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`

  const copyPixKey = async () => {
    await navigator.clipboard.writeText(clinicPixKey)
    setCopyMessage('Chave Pix copiada.')
  }

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-[#4E5C57]">
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/75 border-b border-[#dce5dd]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <img src="/logo.jpeg" className="w-12 h-12 rounded-full object-cover" />
            <div>
              <h1 className="font-['Playfair_Display'] text-2xl text-[#76A88E]">EntreSer</h1>
              <p className="text-xs tracking-[0.2em] uppercase text-[#7d8d87]">Clínica de Psicologia</p>
            </div>
          </a>

          <a href="/grupos-de-estudos" className="hidden sm:flex items-center gap-2 text-sm font-semibold text-[#5f746c] hover:text-[#76A88E] transition">
            <ArrowLeft size={18} />
            Grupos de estudos
          </a>
        </div>
      </nav>

      <main className="px-6 py-16">
        <motion.section
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto bg-white/85 border border-white rounded-[32px] shadow-xl p-8 md:p-14 text-center"
        >
          <div className="mx-auto mb-8 w-20 h-20 rounded-full bg-[#edf5ef] flex items-center justify-center">
            <CreditCard className="text-[#76A88E]" size={38} />
          </div>

          <span className="bg-[#EED9C8] text-[#6f7f79] px-4 py-2 rounded-full text-sm inline-block mb-6">
            Pagamento via Pix mensal
          </span>

          <h2 className="font-['Playfair_Display'] text-5xl lg:text-6xl leading-tight text-[#5f746c] mb-5">
            Finalize sua inscrição
          </h2>

          <p className="text-lg leading-8 text-[#73827c] max-w-2xl mx-auto mb-8">
            Faça o pagamento mensal via Pix usando o QR Code abaixo. Depois, envie o comprovante para nosso WhatsApp para confirmarmos sua inscrição.
          </p>

          <div className="bg-[#F8F7F4] border border-[#e5ece7] rounded-[20px] p-5 mb-8 text-left">
            <p className="text-sm text-[#7a8782] mb-1">Grupo</p>
            <p className="font-semibold text-[#5f746c]">{studyGroupTitle}</p>
            {amountInCents > 0 && (
              <>
                <p className="text-sm text-[#7a8782] mt-4 mb-1">Valor mensal</p>
                <p className="font-semibold text-[#5f746c]">{formatPrice(amountInCents)}</p>
              </>
            )}
            {enrollmentId && (
              <>
                <p className="text-sm text-[#7a8782] mt-4 mb-1">Código da inscrição</p>
                <p className="font-semibold text-[#5f746c] break-all">{enrollmentId}</p>
              </>
            )}
          </div>

          <div className="mx-auto mb-6 max-w-xs rounded-[24px] border border-[#e5ece7] bg-white p-5 shadow-sm">
            <img src="/qrcode-pix.png" alt="QR Code Pix da Clínica EntreSer" className="w-full" />
          </div>

          <div className="bg-[#edf5ef] text-[#5f746c] rounded-[20px] p-5 mb-6">
            <p className="text-sm mb-2">Chave Pix</p>
            <div className="flex items-center justify-center gap-2">
              <p className="font-semibold break-all">{clinicPixKey}</p>
              <button
                type="button"
                onClick={copyPixKey}
                aria-label="Copiar chave Pix"
                className="rounded-full p-2 text-[#76A88E] hover:bg-white/80 transition"
              >
                <Copy size={17} />
              </button>
            </div>
          </div>

          <p className="text-[#73827c] leading-7 mb-8">
            Quando o pagamento for aprovado, envie o comprovante de pagamento para nosso WhatsApp.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              type="button"
              onClick={copyPixKey}
              className="bg-[#edf5ef] text-[#5f746c] px-7 py-4 rounded-full flex items-center justify-center gap-3 hover:bg-[#dfece4] transition"
            >
              <Copy size={20} />
              Copiar Pix
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="bg-[#76A88E] text-white px-7 py-4 rounded-full flex items-center justify-center gap-3 hover:scale-105 transition"
            >
              <Send size={20} />
              Enviar comprovante
            </a>
          </div>

          {copyMessage && <p className="mt-5 text-sm text-[#76A88E]">{copyMessage}</p>}
        </motion.section>
      </main>
    </div>
  )
}

function EnrollmentConfirmationPage() {
  const searchParams = new URLSearchParams(window.location.search)
  const enrollmentId = searchParams.get('enrollment') || searchParams.get('external_reference')
  const paymentId = searchParams.get('payment_id') || searchParams.get('collection_id')
  const checkoutUrl = searchParams.get('checkout')
  const [isCheckingPayment, setIsCheckingPayment] = useState(false)
  const [paymentConfirmation, setPaymentConfirmation] = useState({
    status: paymentId ? 'checking' : 'idle',
    message: paymentId ? 'Confirmando pagamento...' : 'Aguardando confirmação do pagamento.',
  })
  const whatsappMessage = [
    'Olá, Clínica EntreSer!',
    'Realizei o pagamento da minha inscrição em um grupo de estudos pelo site.',
    enrollmentId ? `Código da inscrição: ${enrollmentId}` : null,
    'Segue minha confirmação.',
  ]
    .filter(Boolean)
    .join('\n')
  const whatsappUrl = `https://wa.me/${clinicWhatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`
  const isPaymentApproved = paymentConfirmation.status === 'approved'

  useEffect(() => {
    if (!enrollmentId || !paymentId) return

    async function confirmPayment() {
      try {
        const response = await fetch('/.netlify/functions/confirm-study-group-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ enrollmentId, paymentId }),
        })
        const payload = await response.json().catch(() => ({}))

        if (!response.ok) {
          throw new Error(payload.error || 'Não foi possível confirmar o pagamento.')
        }

        setPaymentConfirmation({
          status: payload.paymentStatus,
          message:
            payload.paymentStatus === 'approved'
              ? 'Pagamento aprovado e inscrição atualizada no sistema.'
              : `Pagamento registrado com status: ${payload.paymentStatus}.`,
        })
      } catch (error) {
        setPaymentConfirmation({
          status: 'error',
          message: error.message || 'Não foi possível confirmar o pagamento automaticamente.',
        })
      }
    }

    confirmPayment()
  }, [enrollmentId, paymentId])

  useEffect(() => {
    if (!enrollmentId || paymentId) return

    let attempts = 0
    let timeoutId

    async function checkEnrollmentStatus() {
      try {
        attempts += 1
        const payload = await syncPaymentByEnrollment(enrollmentId)

        setPaymentConfirmation({
          status: payload.paymentStatus,
          message:
            payload.paymentStatus === 'approved'
              ? 'Pagamento aprovado e inscrição confirmada no sistema.'
              : 'Ainda estamos aguardando a confirmação do pagamento. Se você pagou por Pix, isso pode levar alguns instantes.',
        })

        if (payload.paymentStatus !== 'approved' && attempts < 30) {
          timeoutId = window.setTimeout(checkEnrollmentStatus, 10000)
        }
      } catch (error) {
        setPaymentConfirmation({
          status: 'error',
          message: error.message || 'Não foi possível consultar o pagamento automaticamente.',
        })
      }
    }

    checkEnrollmentStatus()

    return () => window.clearTimeout(timeoutId)
  }, [enrollmentId, paymentId])

  const verifyPaymentNow = async () => {
    if (!enrollmentId) return

    setIsCheckingPayment(true)

    try {
      const payload = await syncPaymentByEnrollment(enrollmentId)

      setPaymentConfirmation({
        status: payload.paymentStatus,
        message:
          payload.paymentStatus === 'approved'
            ? 'Pagamento aprovado e inscrição confirmada no sistema. O e-mail de confirmação foi processado.'
            : 'Pagamento ainda não aprovado. Se você pagou por Pix, aguarde alguns instantes e verifique novamente.',
      })
    } catch (error) {
      setPaymentConfirmation({
        status: 'error',
        message: error.message || 'Não foi possível verificar o pagamento agora.',
      })
    } finally {
      setIsCheckingPayment(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-[#4E5C57]">
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/75 border-b border-[#dce5dd]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <img src="/logo.jpeg" className="w-12 h-12 rounded-full object-cover" />
            <div>
              <h1 className="font-['Playfair_Display'] text-2xl text-[#76A88E]">EntreSer</h1>
              <p className="text-xs tracking-[0.2em] uppercase text-[#7d8d87]">Clínica de Psicologia</p>
            </div>
          </a>

          <a href="/grupos-de-estudos" className="hidden sm:flex items-center gap-2 text-sm font-semibold text-[#5f746c] hover:text-[#76A88E] transition">
            <ArrowLeft size={18} />
            Grupos de estudos
          </a>
        </div>
      </nav>

      <main className="px-6 py-16">
        <motion.section
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto bg-white/85 border border-white rounded-[32px] shadow-xl p-8 md:p-14 text-center"
        >
          <div className="mx-auto mb-8 w-20 h-20 rounded-full bg-[#edf5ef] flex items-center justify-center">
            <CheckCircle2 className="text-[#76A88E]" size={42} />
          </div>

          <span className="bg-[#EED9C8] text-[#6f7f79] px-4 py-2 rounded-full text-sm inline-block mb-6">
            Inscrição recebida
          </span>

          <h2 className="font-['Playfair_Display'] text-5xl lg:text-6xl leading-tight text-[#5f746c] mb-6">
            Parabéns pela sua inscrição!
          </h2>

          <p className="text-lg leading-8 text-[#73827c] max-w-2xl mx-auto mb-8">
            Quando o pagamento for aprovado, a equipe da EntreSer será avisada automaticamente por e-mail.
          </p>

          {enrollmentId && (
            <div className="bg-[#F8F7F4] border border-[#e5ece7] rounded-[20px] p-5 mb-8 text-left">
              <p className="text-sm text-[#7a8782] mb-1">Código da inscrição</p>
              <p className="font-semibold text-[#5f746c] break-all">{enrollmentId}</p>
            </div>
          )}

          {paymentConfirmation.message && (
            <div className="bg-[#edf5ef] text-[#5f746c] rounded-[20px] p-5 mb-8 leading-7">
              {paymentConfirmation.message}
            </div>
          )}

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {checkoutUrl && (
              <a
                href={checkoutUrl}
                target="_blank"
                rel="noreferrer"
                className="bg-[#76A88E] text-white px-7 py-4 rounded-full flex items-center justify-center gap-3 hover:scale-105 transition"
              >
                <CreditCard size={20} />
                Abrir pagamento
              </a>
            )}

            <button
              type="button"
              onClick={verifyPaymentNow}
              disabled={isCheckingPayment}
              className="bg-[#edf5ef] text-[#5f746c] px-7 py-4 rounded-full flex items-center justify-center gap-3 hover:bg-[#dfece4] transition disabled:opacity-70"
            >
              <RefreshCw size={20} />
              {isCheckingPayment ? 'Verificando...' : 'Verificar pagamento'}
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              aria-disabled={!isPaymentApproved}
              onClick={(event) => {
                if (!isPaymentApproved) {
                  event.preventDefault()
                }
              }}
              className={`px-7 py-4 rounded-full flex items-center justify-center gap-3 transition ${
                isPaymentApproved
                  ? 'bg-[#76A88E] text-white hover:scale-105'
                  : 'bg-[#edf5ef] text-[#8a9a94] cursor-not-allowed opacity-70'
              }`}
            >
              <Send size={20} />
              {isPaymentApproved ? 'Enviar confirmação' : 'Aguardando aprovação'}
            </a>
          </div>
        </motion.section>
      </main>
    </div>
  )
}

async function syncPaymentByEnrollment(enrollmentId) {
  const response = await fetch('/.netlify/functions/sync-study-group-payment-by-enrollment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ enrollmentId }),
  })
  const payload = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(payload.error || 'Não foi possível consultar o pagamento.')
  }

  return payload
}

function DetailItem({ icon: Icon, label, value }) {
  return (
    <div className="bg-[#F8F7F4] border border-[#e5ece7] rounded-[18px] p-4">
      <div className="flex items-center gap-2 text-[#76A88E] mb-2">
        <Icon size={17} />
        <span className="text-sm font-semibold">{label}</span>
      </div>
      <p className="text-[#5f746c] leading-6">{value}</p>
    </div>
  )
}

function FormField({ label, name, type = 'text', value, onChange, placeholder, required, disabled, ...inputProps }) {
  return (
    <label className="block">
      <span className="block text-sm font-semibold text-[#5f746c] mb-2">{label}</span>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        {...inputProps}
        className="w-full rounded-[18px] border border-[#dce5dd] bg-white px-4 py-3 text-[#4E5C57] outline-none focus:border-[#76A88E] focus:ring-4 focus:ring-[#76A88E]/15 transition disabled:bg-[#f1f4f2] disabled:text-[#9aa8a2]"
      />
    </label>
  )
}

function TextAreaField({ label, name, value, onChange, placeholder, required, rows = 3 }) {
  return (
    <label className="block">
      <span className="block text-sm font-semibold text-[#5f746c] mb-2">{label}</span>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        rows={rows}
        className="w-full resize-y rounded-[18px] border border-[#dce5dd] bg-white px-4 py-3 text-[#4E5C57] outline-none focus:border-[#76A88E] focus:ring-4 focus:ring-[#76A88E]/15 transition"
      />
    </label>
  )
}

function SelectField({ label, name, value, onChange, options, required }) {
  return (
    <label className="block">
      <span className="block text-sm font-semibold text-[#5f746c] mb-2">{label}</span>
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full rounded-[18px] border border-[#dce5dd] bg-white px-4 py-3 text-[#4E5C57] outline-none focus:border-[#76A88E] focus:ring-4 focus:ring-[#76A88E]/15 transition"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}
