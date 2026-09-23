"use client";

import { useState } from "react";
import Image, { type StaticImageData } from "next/image";
import { motion } from "framer-motion";
import { X, ExternalLink } from "lucide-react";

import eventImg1 from "@/img/events/post1i1.jpeg";
import eventImg2 from "@/img/events/post1i2.jpeg";
import eventImg3 from "@/img/events/post1i3.jpeg";
import cofenImg from "@/img/events/cofen.jpeg";
import cabempoLogo from "@/img/events/cabempologo.webp";
import cabempo1 from "@/img/events/cabempo1.webp";
import cabempo2 from "@/img/events/cabempo2.webp";
import cabempo3 from "@/img/events/cabempo3.webp";
import cabempo4 from "@/img/events/cabempo4.webp";
import cabempo5 from "@/img/events/cabempo5.webp";
import cabempo6 from "@/img/events/cabempo6.webp";
import cabempo7 from "@/img/events/cabempo7.webp";
import cabempo8 from "@/img/events/cabempo8.webp";
import cabempo9 from "@/img/events/cabempo9.webp";
import corenImg from "@/img/events/coren.jpeg";
import corenImg2 from "@/img/events/coren2.jpeg";
import corenImg3 from "@/img/events/coren3.jpeg";

const eventData = {
  title: "Conselho Federal de Enfermagem aprova Resolução da Podiatria Clínica",
  images: [eventImg1, eventImg2, eventImg3],
  text: `A Associação Brasileira de Enfermagem em Podiatria (ABENPO) celebra um importante avanço para a enfermagem e para a Podiatria Clínica no Brasil. Durante a reunião ordinária do Conselho Federal de Enfermagem (COFEN), realizada nesta terça-feira, foi aprovada a Resolução da Podiatria Clínica pelo plenário, contemplando as contribuições apresentadas ao longo do processo de construção do documento. 
A aprovação representa um marco para a categoria, fortalecendo a atuação dos enfermeiros podiatras e consolidando importantes diretrizes para o exercício profissional em todo o país. 
Na mesma sessão, também foi pautada a solicitação de registro da ABENPO junto ao Conselho Federal de Enfermagem. A apreciação, no entanto, foi retirada de pauta para que a associação apresente a documentação complementar referente aos critérios para concessão do Título de Especialista, etapa necessária para a continuidade do processo de registro. 
A ABENPO reafirma seu compromisso com o fortalecimento da Podiatria Clínica, mantendo seu trabalho em defesa da valorização profissional, da qualidade da assistência e do desenvolvimento científico da especialidade. 
Este é mais um importante capítulo na história da enfermagem podiátrica brasileira e reflete o empenho coletivo de profissionais, diretores, associados e parceiros que, diariamente, contribuem para o crescimento e reconhecimento da área. 
Parabéns a todos que fazem parte desta trajetória. Seguimos avançando, unidos, pelo fortalecimento da Podiatria Clínica no Brasil.`,
};

const cofenEventData = {
  title: "Visita técnica à UERJ subsidia proposta de regulamentação da Enfermagem em Podiatria Clínica",
  images: [cofenImg],
  text: `Integrantes do Grupo de Trabalho (GT) do Conselho Federal de Enfermagem (Cofen) responsável pela elaboração da proposta de regulamentação da atuação da Enfermagem em Podiatria Clínica realizaram, nesta quarta-feira (8/7), visita técnica à Policlínica Piquet Carneiro, da Universidade do Estado do Rio de Janeiro (UERJ). Referência nacional na assistência especializada à saúde dos pés, a unidade contribuiu para o levantamento de experiências que subsidiam minuta de resolução que propõe regulamentar a atuação da enfermagem em Podiatria Clínica.`,
  link: "https://www.cofen.gov.br/visita-tecnica-a-uerj-subsidia-proposta-de-regulamentacao-da-enfermagem-em-podiatria-clinica/",
};

const cabempoEventData = {
  title: "CABEMPO – Congresso Brasileiro de Enfermagem em Podiatria Clínica",
  images: [cabempoLogo, cabempo1, cabempo2, cabempo3, cabempo4, cabempo5, cabempo6, cabempo7, cabempo8, cabempo9],
  text: `O **CABEMPO – Congresso Brasileiro de Enfermagem em Podiatria Clínica** é um dos principais encontros científicos da área, reunindo enfermeiros, pesquisadores, docentes, estudantes e especialistas de todo o Brasil para promover a atualização profissional, o intercâmbio de conhecimentos e o fortalecimento da Enfermagem em Podiatria Clínica.

O congresso oferece uma programação abrangente, com palestras, mesas-redondas, cursos, oficinas e apresentação de trabalhos científicos, abordando temas relacionados à prevenção, avaliação, diagnóstico, tratamento e reabilitação das alterações dos pés, sempre fundamentados em evidências científicas e nas melhores práticas assistenciais.

Mais do que um evento científico, o CABEMPO é um espaço de integração entre profissionais, incentivo à pesquisa, inovação tecnológica e valorização da Enfermagem em Podiatria Clínica. Durante o congresso, os participantes têm a oportunidade de ampliar sua rede de contatos, conhecer novas tecnologias, compartilhar experiências e contribuir para o desenvolvimento da especialidade no Brasil.

Participar do CABEMPO é investir em conhecimento, qualificação profissional e no fortalecimento de uma assistência cada vez mais segura, humanizada e baseada em evidências, reafirmando o compromisso da Enfermagem com a excelência no cuidado aos pacientes.`,
};

const corenEventData = {
  title: "ABENPO presente no Congresso de Especialidades do COREN",
  images: [corenImg, corenImg2, corenImg3],
  text: `A **ABENPO – Associação Brasileira de Enfermagem em Podiatria Clínica** marcou presença no **Congresso de Especialidades do COREN**, um importante evento voltado à valorização, atualização e fortalecimento das diversas áreas de atuação da Enfermagem.

A participação da ABENPO reforça o compromisso da instituição com o desenvolvimento da **Enfermagem em Podiatria Clínica**, promovendo conhecimento científico, troca de experiências e a divulgação da importância dessa especialidade para uma assistência qualificada, segura e humanizada.

Durante o evento, profissionais e estudantes puderam conhecer mais sobre a atuação da Podiatria Clínica, seus avanços, desafios e contribuições para a prevenção e o cuidado integral com a saúde dos pés.

A ABENPO segue fortalecendo a Enfermagem especializada, incentivando a capacitação profissional e contribuindo para a construção de uma assistência cada vez mais baseada em evidências científicas e excelência no cuidado.`,
};

type GalleryItem = {
  id: string;
  title: string;
  images: StaticImageData[];
  text: string;
  link?: string;
};

const galleryItems: GalleryItem[] = [
  {
    id: "1",
    ...eventData,
  },
  {
    id: "2",
    ...cofenEventData,
  },
  {
    id: "3",
    ...cabempoEventData,
  },
  {
    id: "4",
    ...corenEventData,
  },
];

const gridContainerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" as const },
  },
};

function GalleryCard({ item, index }: { item: GalleryItem; index: number }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  return (
    <>
      <motion.article
        variants={cardVariants}
        className="card-institutional flex h-full flex-col p-6 opacity-0 animate-fadeInUp sm:p-7"
        style={{ animationDelay: `${index * 0.12 + 0.2}s` }}
      >
        <div aria-hidden="true" className="card-institutional__glow" />

        <div className="relative flex h-full flex-col">
          <h3 className="text-center text-base font-bold tracking-tight text-zinc-900 sm:text-lg">
            {item.title}
          </h3>

          <div className="relative mt-5 aspect-[4/3] overflow-hidden rounded-2xl bg-zinc-100">
            <Image
              src={item.images[0]}
              alt={item.title}
              fill
              sizes="(max-width: 768px) 100vw, 30vw"
              className="object-cover"
              priority
            />
          </div>

          <p className="mt-5 line-clamp-3 text-sm leading-relaxed text-zinc-600 sm:text-[0.95rem]">
            {item.text}
          </p>

          <div className="mt-5 flex flex-col gap-2.5">
            <button
              onClick={() => {
                setCurrentImageIndex(0);
                setIsModalOpen(true);
              }}
              className="btn-primary w-full gap-2 px-4 py-2.5 text-sm"
            >
              Ver detalhes
              <ExternalLink className="size-4" aria-hidden="true" />
            </button>
            {item.link && (
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full gap-2 px-4 py-2.5 text-sm"
              >
                Ver matéria completa
                <ExternalLink className="size-4" aria-hidden="true" />
              </a>
            )}
          </div>
        </div>
      </motion.article>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-h-[90vh] max-w-5xl overflow-y-auto rounded-[24px] bg-white shadow-[0_24px_64px_rgba(15,23,42,0.25)]">
            <div className="sticky top-0 flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-4 sm:px-8">
              <h3 className="text-base font-bold tracking-tight text-zinc-900 sm:text-lg">
                {item.title}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-full p-2 text-zinc-600 transition-colors hover:bg-zinc-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
                aria-label="Fechar modal"
              >
                <X className="size-6" aria-hidden="true" />
              </button>
            </div>

            <div className="space-y-6 p-6 sm:p-8">
              {item.images.length > 0 && (
                <div className="space-y-4">
                  <div className="relative aspect-video overflow-hidden rounded-2xl bg-zinc-100">
                    <Image
                      src={item.images[currentImageIndex]}
                      alt={`${item.title} - Imagem ${currentImageIndex + 1}`}
                      fill
                      sizes="(max-width: 1024px) 100vw, 80vw"
                      className="object-cover"
                    />
                    {item.images.length > 1 && (
                      <>
                        <button
                          onClick={() =>
                            setCurrentImageIndex((prev) =>
                              prev === 0 ? item.images.length - 1 : prev - 1
                            )
                          }
                          className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/85 p-2 shadow-lg transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
                          aria-label="Imagem anterior"
                        >
                          <svg className="size-6 text-zinc-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <button
                          onClick={() =>
                            setCurrentImageIndex((prev) =>
                              prev === item.images.length - 1 ? 0 : prev + 1
                            )
                          }
                          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/85 p-2 shadow-lg transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
                          aria-label="Próxima imagem"
                        >
                          <svg className="size-6 text-zinc-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </>
                    )}
                  </div>
                  {item.images.length > 1 && (
                    <div className="grid grid-cols-5 gap-2">
                      {item.images.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImageIndex(idx)}
                          className={`relative aspect-video overflow-hidden rounded-xl transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 ${
                            idx === currentImageIndex
                              ? "ring-2 ring-emerald-600"
                              : "opacity-70 hover:opacity-100"
                          }`}
                          aria-label={`Ir para miniatura ${idx + 1}`}
                        >
                          <Image
                            src={img}
                            alt={`Miniatura ${idx + 1}`}
                            fill
                            className="object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="whitespace-pre-line text-base leading-[1.85] text-zinc-700 sm:text-[1.0625rem]">
                {item.text}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function GaleriaSection() {
  return (
    <section
      id="galeria"
      className="section-alt section-spacing relative overflow-hidden"
    >
      <div aria-hidden="true" className="bg-blobs">
        <div className="bg-blobs__blob -top-32 left-[5%] h-96 w-96 bg-emerald-200/40" />
        <div className="bg-blobs__blob -bottom-40 right-[8%] h-80 w-80 bg-teal-100/60" />
        <div className="bg-blobs__blob top-1/4 right-1/4 h-64 w-80 bg-emerald-50/60" />
      </div>

      <div className="section-container relative">
        <motion.header
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="section-header"
        >
          <p className="section-eyebrow">Galeria</p>
          <span className="section-divider section-divider--center" />
          <h2 className="section-title">Notícias e Eventos</h2>
          <p className="section-subtitle">
            Acompanhe as principais conquistas, encontros científicos e
            iniciativas que fortalecem a Enfermagem em Podiatria Clínica no
            Brasil.
          </p>
        </motion.header>

        <motion.div
          variants={gridContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="mt-14 grid grid-cols-1 gap-6 sm:mt-16 md:grid-cols-2 lg:mt-20 xl:grid-cols-3"
        >
          {galleryItems.map((item, index) => (
            <GalleryCard key={item.id} item={item} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
