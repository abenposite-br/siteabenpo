"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  Users,
  ShieldCheck,
  BookOpen,
  GraduationCap,
  Calendar,
  type LucideIcon,
} from "lucide-react";

type Pilar = {
  icon: LucideIcon;
  title: string;
  description: string;
};

type MarcoHistorico = {
  year: string;
  title: string;
  description: string;
};

const pilares: Pilar[] = [
  {
    icon: Users,
    title: "Organização dos Enfermeiros",
    description:
      "Organização e integração dos enfermeiros especialistas e habilitados em Podiatria Clínica, promovendo representatividade, colaboração e desenvolvimento profissional.",
  },
  {
    icon: ShieldCheck,
    title: "Defesa da Especialidade",
    description:
      "Defesa permanente da Enfermagem em Podiatria Clínica como especialidade, fortalecendo sua valorização e reconhecimento em âmbito nacional.",
  },
  {
    icon: BookOpen,
    title: "Produção do Conhecimento",
    description:
      "Incentivo à pesquisa científica, produção acadêmica e difusão de conhecimentos voltados à Enfermagem em Podiatria Clínica.",
  },
  {
    icon: GraduationCap,
    title: "Fortalecimento Profissional",
    description:
      "Fortalecimento do núcleo de conhecimentos próprios da Enfermagem em Podiatria por meio da capacitação, inovação e excelência profissional.",
  },
];

const marcosHistoricos: MarcoHistorico[] = [
  {
    year: "1939",
    title: "Decreto n. 10.068",
    description:
      "Reconhecimento de uma área de atuação da enfermagem, com objetivo de regulamentar a forma de habilitação dos enfermeiros em geral.",
  },
  {
    year: "2007",
    title: "Especialização na UNIFESP",
    description:
      "Primeiro curso de pós-graduação latu sensu em Enfermagem em Podiatria Clínica do país, regulamentado pela Resolução 01/2001 do CNE e pelo Parecer ASJE nº 57/2005 do COFEN.",
  },
  {
    year: "2020",
    title: "Fundação da ABENPO",
    description:
      "Constituição da Associação Brasileira de Enfermagem em Podiatria Clínica em 07 de fevereiro, durante a pandemia de Covid-19.",
  },
];

const pilaresContainerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const pilarCardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" as const },
  },
};

function PilarCard({ icon: Icon, title, description }: Pilar) {
  return (
    <motion.article variants={pilarCardVariants} className="card-institutional p-7 sm:p-8">
      <div className="card-institutional__glow" />
      <div className="relative flex flex-col gap-4">
        <div className="icon-box icon-box--size-12">
          <Icon className="size-6" strokeWidth={1.75} />
        </div>
        <div>
          <h3 className="text-lg font-semibold tracking-tight text-zinc-900">
            {title}
          </h3>
          <p className="mt-2.5 text-sm leading-relaxed text-zinc-600">
            {description}
          </p>
        </div>
      </div>
    </motion.article>
  );
}

function MarcoHistoricoCard({ year, title, description, index }: MarcoHistorico & { index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay: index * 0.1 }}
      className="card-institutional p-6"
    >
      <div className="card-institutional__glow" />
      <div className="relative">
        <div className="flex items-center gap-3">
          <div className="icon-box icon-box--size-10 !bg-emerald-600 !text-white !border-emerald-700">
            <Calendar className="size-4" aria-hidden="true" />
          </div>
          <span className="text-2xl font-bold text-emerald-800">
            {year}
          </span>
        </div>
        <h4 className="mt-4 text-base font-semibold text-zinc-900">
          {title}
        </h4>
        <p className="mt-2 text-sm leading-relaxed text-zinc-600">
          {description}
        </p>
      </div>
    </motion.div>
  );
}

export function SobreSection() {
  return (
    <section id="sobre" className="section-spacing section-alt relative overflow-hidden">
      <div className="bg-blobs" aria-hidden="true">
        <div className="bg-blobs__blob -top-32 left-[5%] h-96 w-96 bg-emerald-200/40" />
        <div className="bg-blobs__blob -bottom-40 right-[8%] h-80 w-80 bg-teal-100/60" />
        <div className="bg-blobs__blob top-1/4 right-1/4 h-64 w-80 bg-emerald-50/60" />
      </div>

      <div className="section-container relative">
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden rounded-[24px] bg-white p-8 shadow-[0_8px_40px_rgba(15,23,42,0.08)] sm:p-12 lg:p-[60px]"
        >
          <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="section-header section-header--left max-w-none">
              <p className="section-eyebrow">Sobre nós</p>
              <span className="section-divider" />
              <h2 className="section-title section-title--lg">
                Sobre a ABENPO
              </h2>
              <p className="section-subtitle section-subtitle--left">
                A Associação Brasileira de Enfermagem em Podiatria Clínica,
                doravante denominada ABENPO, constituída em 07 de fevereiro de
                2020, é uma associação civil de direito privado, sem fins
                lucrativos e de caráter exclusivamente sociocultural, com prazo
                de duração indeterminado.
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.75,
                delay: 0.15,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group relative min-h-[280px] overflow-hidden rounded-2xl shadow-[0_12px_40px_rgba(15,23,42,0.12)] transition-shadow duration-500 hover:shadow-[0_20px_56px_rgba(15,23,42,0.16)] sm:min-h-[320px] lg:min-h-[380px] lg:h-full"
            >
              <Image
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=900&h=1100&fit=crop&q=80"
                alt="Profissional de saúde em ambiente clínico, representando a excelência da Enfermagem em Podiatria Clínica"
                fill
                priority
                loading="eager"
                sizes="(min-width: 1024px) 560px, 100vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-emerald-950/25 via-transparent to-transparent"
              />
            </motion.div>
          </div>

          <div className="mt-16 border-t border-zinc-100 pt-14 sm:mt-20 sm:pt-16">
            <div className="section-header section-header--left max-w-none mb-0">
              <p className="section-eyebrow">Trajetória</p>
              <span className="section-divider" />
              <h3 className="section-title !mt-5 !text-2xl sm:!text-3xl">
                Nossa História
              </h3>
            </div>

            <div className="mt-10 grid gap-4 lg:grid-cols-3">
              {marcosHistoricos.map((marco, index) => (
                <MarcoHistoricoCard key={marco.year} {...marco} index={index} />
              ))}
            </div>

            <div className="mt-10 space-y-6 text-base leading-[1.85] text-zinc-600 sm:text-[1.0625rem]">
              <p>
                A especialidade representa um resgate de uma área de atuação da
                enfermagem reconhecida por meio do{" "}
                <strong className="font-semibold text-zinc-800">
                  Decreto n. 10.068, de 23 de março de 1939
                </strong>
                , com objetivo de regulamentar a forma de habilitação dos
                enfermeiros em geral. (DECRETO N. 10.068, DE 23 DE MARÇO DE
                1939)
              </p>
              <p>
                Com a necessidade de ampliar os conhecimentos em Podiatria
                Clínica, a{" "}
                <strong className="font-semibold text-zinc-800">
                  Universidade Federal de São Paulo – UNIFESP
                </strong>
                , oferece em 2007, o primeiro Curso de pós-graduação latu
                sensu de Especialização em Enfermagem em Podiatria Clínica do
                país, devidamente regulamentado, de acordo com a Resolução
                01/2001 do Conselho Nacional de Educação e, pelo Parecer ASJE
                nº 57/2005, originado a partir da solicitação da presidência do
                COFEN. (COFEN, 2005).
              </p>
              <p>
                <strong className="font-semibold text-zinc-800">
                  Associação Brasileira de Enfermagem em Podiatria Clínica –
                  ABENPO
                </strong>
                , foi constituída em 07 de fevereiro de 2020, durante a pandemia
                de Covid-19, a partir da necessidade de reunir enfermeiros
                especialistas e/ou habilitados para intensificar o
                desenvolvimento técnico e científico da área da Podiatria
                Clínica.
              </p>
              <p>
                A Enfermagem em Podiatria Clínica passa então a ser representada
                pela Associação Brasileira de Enfermagem em Podiatria Clínica –
                ABENPO que, de acordo com seu estatuto e orientada pelo
                ordenamento jurídico vem envidando esforços para que a Podiatria
                Clínica se constitua em uma{" "}
                <strong className="font-semibold text-emerald-800">
                  ESPECIALIDADE
                </strong>{" "}
                da enfermagem.
              </p>
            </div>
          </div>

          <div className="mt-16 border-t border-zinc-100 pt-14 sm:mt-20 sm:pt-16">
            <h3 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
              Nossos Pilares
            </h3>

            <motion.div
              variants={pilaresContainerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="mt-10 grid gap-5 sm:grid-cols-2 sm:gap-6"
            >
              {pilares.map((pilar) => (
                <PilarCard key={pilar.title} {...pilar} />
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
