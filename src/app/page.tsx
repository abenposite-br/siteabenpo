import Link from "next/link";
import Image from "next/image";
import LogoImg from "@/img/logo.jpeg";
import { HeroSection } from "@/components/sections/HeroSection";
import { SobreSection } from "@/components/sections/SobreSection";
import { BeneficiosSection } from "@/components/sections/BeneficiosSection";
import { DiretoriaSection } from "@/components/sections/DiretoriaSection";
import { AssociarSection } from "@/components/sections/AssociarSection";
import { FooterSection } from "@/components/sections/FooterSection";
import { GaleriaSection } from "@/components/sections/GaleriaSection";
import { CursosSection } from "@/components/sections/CursosSection";
import { getArticles } from "@/lib/article-storage";
import { getDiretoriaImages } from "@/lib/diretoria-images";
import { ClipboardList, FileCheck, Star, MapPin, Clock, FileText, User, ExternalLink } from "lucide-react";
import { getEvents } from "@/lib/event-storage";
import { type Event, getEventIcon } from "@/lib/event-utils";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const steps = [
  {
    icon: ClipboardList,
    title: "Cadastre seu interesse",
    description:
      "Envie seus dados para iniciarmos o processo de associação de forma simples.",
  },
  {
    icon: FileCheck,
    title: "Validação e orientações",
    description:
      "A equipe retorna com os próximos passos, documentos e informações necessárias.",
  },
  {
    icon: Star,
    title: "Acesso aos benefícios",
    description:
      "Com a associação ativa, você passa a ter acesso a todos os benefícios e participações.",
  },
];

const especialidadeItems = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="size-8">
        <path d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Avaliação Especializada",
    description:
      "Exame clínico detalhado dos pés e membros inferiores, identificando alterações posturais, biomecânicas e fatores de risco para prevenir complicações futuras.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="size-8">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Prevenção em Saúde",
    description:
      "Ações educativas e cuidados específicos que evitam o surgimento de lesões e contribuem para a manutenção da saúde e bem-estar.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="size-8">
        <path d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Tratamento e Reabilitação",
    description:
      "Intervenções clínicas e acompanhamento contínuo para recuperação funcional, promovendo autonomia, qualidade de vida e segurança ao indivíduo.",
  },
];

export default async function Home({ searchParams }: PageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const diretoriaImages = getDiretoriaImages();

  let events: Awaited<ReturnType<typeof getEvents>> = [];
  let articles: Awaited<ReturnType<typeof getArticles>> = [];

  try {
    events = await getEvents();
  } catch (err) {
    console.error("Erro ao carregar eventos na home:", err);
  }

  try {
    articles = await getArticles();
  } catch (err) {
    console.error("Erro ao carregar artigos na home:", err);
  }

  const enviado =
    typeof resolvedSearchParams.enviado === "string"
      ? resolvedSearchParams.enviado
      : undefined;

  return (
    <div className="min-h-dvh flex flex-col">
      <header className="sticky top-0 z-40 border-b border-emerald-300/30 bg-emerald-900/20 backdrop-blur-md backdrop-saturate-150 shadow-sm">
        <div className="section-container">
          <div className="flex h-16 items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-2.5 shrink-0">
              <Image
                src={LogoImg}
                alt="Logo ABENPO"
                priority
                sizes="36px"
                className="w-9 h-auto rounded-xl bg-white p-1 ring-1 ring-emerald-100 shadow-sm"
              />
              <div className="flex flex-col leading-tight">
                <span className="text-base font-bold tracking-tight text-zinc-950">
                  ABENPO
                </span>
                <span className="text-[10px] font-medium uppercase tracking-wider text-emerald-800/80">
                  Associação
                </span>
              </div>
            </Link>

            <nav className="hidden items-center gap-7 text-sm font-medium text-zinc-700 lg:flex">
              <a className="hover:text-emerald-700 transition-colors" href="#sobre">
                Sobre
              </a>
              <a className="hover:text-emerald-700 transition-colors" href="#especialidade">
                Especialidade
              </a>
              <a className="hover:text-emerald-700 transition-colors" href="#beneficios">
                Benefícios
              </a>
              <a className="hover:text-emerald-700 transition-colors" href="#eventos">
                Eventos
              </a>
              <a className="hover:text-emerald-700 transition-colors" href="#galeria">
                Galeria
              </a>
              <a className="hover:text-emerald-700 transition-colors" href="#cursos">
                Cursos
              </a>
              <a className="hover:text-emerald-700 transition-colors" href="#artigos">
                Artigos
              </a>
              <a className="hover:text-emerald-700 transition-colors" href="#como-funciona">
                Como funciona
              </a>
              <a className="hover:text-emerald-700 transition-colors" href="#diretoria">
                Diretoria
              </a>
            </nav>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/area-associado/escolha"
                className="inline-flex items-center gap-2 rounded-xl bg-white/90 px-3 sm:px-4 py-2 text-sm font-bold text-emerald-800 border-2 border-emerald-600 shadow-sm shadow-emerald-100 hover:bg-emerald-50 hover:shadow-md hover:shadow-emerald-200 hover:border-emerald-700 hover:-translate-y-0.5 transition-all duration-300 backdrop-blur-sm ring-1 ring-emerald-100"
              >
                <User className="size-4" />
                <span className="hidden sm:inline">Área do Associado</span>
              </Link>
              <Link
                href="#associar"
                className="btn-primary px-5 py-2.5 text-sm"
              >
                Se tornar associado
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <HeroSection />

        <SobreSection />

        <section id="especialidade" className="section-spacing">
          <div className="section-container">
            <div className="section-header max-w-4xl">
              <p className="section-eyebrow">Especialidade</p>
              <span className="section-divider section-divider--center" />
              <h2 className="section-title">Podiatria Clínica</h2>
              <p className="section-subtitle">
                Enfermagem em Podiatria Clínica é a área do saber especializada, integralmente dedicada ao cuidado dos membros inferiores, com ênfase na saúde dos pés.
              </p>
            </div>

            <div className="mt-12 mb-10 max-w-5xl mx-auto">
              <p className="text-base leading-8 text-zinc-700 text-center sm:text-[1.0625rem]">
                Seu escopo de trabalho abrange o cuidado especializado nos processos patológicos, incluindo alterações metabólicas, disfunções musculoesqueléticas, articulares, neurológicas, neuro cognitivas, transtornos mentais, vasculares, bem como as condições decorrentes do ciclo vital e dos hábitos de vida, na saúde desportiva e laboral que produzem impacto na biomecânica, mobilidade e qualidade de vida do indivíduo. Atua em todos os níveis de atenção à saúde, promoção da saúde, prevenção de agravos, no tratamento especializado e a reabilitação. Incorpora o uso de tecnologias terapêuticas avançadas, tecnologias diagnósticas precisas e o desenvolvimento tecnológico e científico na área.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-3 mt-14">
              {especialidadeItems.map((item, index) => (
                <article
                  key={item.title}
                  className="card-institutional p-8 opacity-0 animate-fadeInUp"
                  style={{ animationDelay: `${index * 0.1 + 0.1}s` }}
                >
                  <div className="card-institutional__glow" />
                  <div className="relative">
                    <div className="icon-box icon-box--size-14 mb-6">
                      {item.icon}
                    </div>
                    <h3 className="text-xl font-bold text-zinc-900 tracking-tight">
                      {item.title}
                    </h3>
                    <p className="mt-4 text-sm leading-relaxed text-zinc-600">
                      {item.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <BeneficiosSection />

        <section id="eventos" className="section-spacing section-alt relative overflow-hidden">
          <div className="bg-blobs" aria-hidden="true">
            <div className="bg-blobs__blob -top-32 left-[8%] h-96 w-96 bg-emerald-200/40" />
            <div className="bg-blobs__blob -bottom-40 right-[10%] h-80 w-80 bg-teal-100/60" />
            <div className="bg-blobs__blob top-1/3 right-1/3 h-64 w-[32rem] bg-emerald-50/60" />
          </div>
          <div className="section-container relative">
            <div className="section-header">
              <p className="section-eyebrow">Agenda</p>
              <span className="section-divider section-divider--center" />
              <h2 className="section-title">Eventos e iniciativas</h2>
              <p className="section-subtitle">
                Fique por dentro de todas as nossas atividades e não perca nenhuma oportunidade de aprender e se conectar!
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-14">
              {events.length === 0 ? (
                <div className="col-span-full text-center py-16">
                  <p className="text-xl font-semibold text-zinc-500">Sem eventos no momento</p>
                </div>
              ) : (
                events.map((event: Event, index: number) => {
                  const Icon = getEventIcon(event.type);
                  return (
                    <article
                      key={event.id}
                      className="card-institutional p-7 opacity-0 animate-fadeInUp flex flex-col"
                      style={{ animationDelay: `${index * 0.15}s` }}
                    >
                      <div className="card-institutional__glow" />

                      <div className="relative flex-1 flex flex-col">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <div className="icon-box icon-box--size-10 !p-0">
                              <Icon className="size-5" />
                            </div>
                            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                              {event.type}
                            </span>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-emerald-700">{event.date}</p>
                            <p className="text-xs text-zinc-500 flex items-center gap-1 justify-end">
                              <Clock className="size-3" /> {event.time}
                            </p>
                          </div>
                        </div>

                        <h3 className="text-xl font-bold text-zinc-900 tracking-tight mb-2">
                          {event.title}
                        </h3>

                        <p className="text-sm leading-relaxed text-zinc-600 mb-5 line-clamp-3 flex-1">
                          {event.description}
                        </p>

                        <a
                          href={event.mapsLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-xs text-emerald-700 hover:text-emerald-900 font-medium mb-5 transition-colors"
                        >
                          <MapPin className="size-4" />
                          <span>{event.location}</span>
                          <ExternalLink className="size-3" />
                        </a>

                        <div className="flex items-center gap-3">
                          <a
                            href="#associar"
                            className="btn-primary w-full"
                          >
                            Participar
                          </a>
                        </div>
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          </div>
        </section>

        <GaleriaSection />

        <CursosSection />

        <section id="artigos" className="section-spacing section-alt relative overflow-hidden">
          <div className="bg-blobs" aria-hidden="true">
            <div className="bg-blobs__blob -top-40 right-[10%] h-80 w-80 bg-emerald-200/40" />
            <div className="bg-blobs__blob -bottom-32 left-[5%] h-72 w-72 bg-teal-100/50" />
          </div>
          <div className="section-container relative">
            <div className="section-header">
              <p className="section-eyebrow">Artigos</p>
              <span className="section-divider section-divider--center" />
              <h2 className="section-title">Publicações e Conteúdos</h2>
            </div>

            <div className="mt-12">
              {articles.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-xl font-semibold text-zinc-500">Sem artigos no momento</p>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {articles.map((article, index) => (
                    <article
                      key={article.id}
                      className="card-institutional p-7 opacity-0 animate-fadeInUp"
                      style={{ animationDelay: `${index * 0.15}s` }}
                    >
                      <div className="card-institutional__glow" />
                      <div className="relative">
                        <div className="icon-box icon-box--size-10 mb-5">
                          <FileText className="size-5" />
                        </div>
                        <h3 className="text-lg font-bold text-zinc-900 tracking-tight mb-4">
                          {article.title}
                        </h3>
                        <a
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-900 transition-colors"
                        >
                          Ler artigo <ExternalLink className="size-4" />
                        </a>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        <section id="como-funciona" className="section-spacing relative overflow-hidden">
          <div className="bg-blobs" aria-hidden="true">
            <div className="bg-blobs__blob -top-24 left-[10%] h-80 w-80 bg-emerald-100/60" />
            <div className="bg-blobs__blob -bottom-24 right-[8%] h-80 w-80 bg-teal-100/60" />
          </div>
          <div className="section-container relative">
            <div className="section-header">
              <p className="section-eyebrow">Processo</p>
              <span className="section-divider section-divider--center" />
              <h2 className="section-title">Como funciona para se associar</h2>
              <p className="section-subtitle">
                Um fluxo simples, com etapas claras e comunicação objetiva para você fazer parte da ABENPO.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-14">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.title}
                    className="card-institutional p-8 opacity-0 animate-fadeInUp"
                    style={{ animationDelay: `${index * 0.15}s` }}
                  >
                    <div className="card-institutional__glow" />

                    <div className="relative flex flex-col items-center">
                      <div className="relative mb-6">
                        <div className="inline-flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-200 transition-all duration-300 group-hover:shadow-2xl">
                          <span className="text-2xl font-bold">{index + 1}</span>
                        </div>
                        {index < steps.length - 1 && (
                          <div className="hidden lg:block absolute top-1/2 -translate-y-1/2 left-full ml-3 h-0.5 w-12 bg-gradient-to-r from-emerald-300 to-transparent" />
                        )}
                      </div>

                      <div className="mb-4 icon-box icon-box--size-12">
                        <Icon className="size-6" />
                      </div>

                      <h3 className="text-lg font-bold text-zinc-900 tracking-tight mb-3">
                        {step.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-zinc-600 text-center">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <DiretoriaSection images={diretoriaImages} />

        <AssociarSection enviado={enviado} />
      </main>

      <FooterSection />
    </div>
  );
}
