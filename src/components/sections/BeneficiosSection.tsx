"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Users,
  Gift,
  CalendarDays,
  ShieldCheck,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";

type Beneficio = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const beneficios: Beneficio[] = [
  {
    icon: Users,
    title: "Rede e representatividade",
    description:
      "Conecte-se a profissionais da área e fortaleça a atuação institucional.",
  },
  {
    icon: Gift,
    title: "Benefícios e parcerias",
    description:
      "Acesso a oportunidades, convênios e condições exclusivas para associados.",
  },
  {
    icon: CalendarDays,
    title: "Eventos e capacitação",
    description:
      "Calendário de eventos, conteúdos e iniciativas para desenvolvimento contínuo.",
  },
  {
    icon: ShieldCheck,
    title: "Credibilidade institucional",
    description:
      "Presença e autoridade: uma associação com comunicação clara e transparente.",
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

function BeneficioCard({ icon: Icon, title, description }: Beneficio) {
  return (
    <motion.article
      variants={cardVariants}
      className="card-institutional group h-full p-7 sm:p-8"
    >
      <div aria-hidden="true" className="card-institutional__glow" />

      <div className="relative flex flex-1 flex-col">
        <span className="icon-box icon-box--size-12">
          <Icon className="size-6" strokeWidth={1.75} />
        </span>

        <h3 className="mt-5 text-lg font-semibold tracking-tight text-zinc-900">
          {title}
        </h3>
        <p className="mt-2.5 flex-1 text-sm leading-relaxed text-zinc-600">
          {description}
        </p>

        <Link
          href="#associar"
          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-emerald-800 transition-colors duration-300 group-hover:text-emerald-950"
        >
          Quero me associar
          <ArrowRight
            className="size-4 transition-transform duration-300 group-hover:translate-x-1"
            strokeWidth={2}
          />
        </Link>
      </div>
    </motion.article>
  );
}

export function BeneficiosSection() {
  return (
    <section
      id="beneficios"
      className="section-alt section-spacing relative overflow-hidden"
    >
      <div aria-hidden="true" className="bg-blobs">
        <div
          className="bg-blobs__blob -top-32 left-[8%] h-96 w-96"
          style={{ backgroundColor: "rgba(16, 185, 129, 0.5)" }}
        />
        <div
          className="bg-blobs__blob -bottom-40 right-[10%] h-80 w-80"
          style={{ backgroundColor: "rgba(204, 251, 241, 0.7)" }}
        />
        <div
          className="bg-blobs__blob top-1/3 right-1/3 h-64 w-[32rem]"
          style={{ backgroundColor: "rgba(16, 185, 129, 0.4)" }}
        />
      </div>

      <div className="section-container relative">
        <motion.header
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="section-header"
        >
          <p className="section-eyebrow">Por que se associar</p>
          <span className="section-divider section-divider--center" />
          <h2 className="section-title">
            Benefícios que aumentam valor e credibilidade
          </h2>
          <p className="section-subtitle">
            Uma proposta clara: apoiar você no dia a dia e fortalecer a atuação
            institucional.
          </p>
        </motion.header>

        <motion.div
          variants={gridContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="mt-14 grid grid-cols-1 gap-6 sm:mt-16 sm:grid-cols-2 lg:mt-20 xl:grid-cols-4"
        >
          {beneficios.map((beneficio) => (
            <BeneficioCard key={beneficio.title} {...beneficio} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
