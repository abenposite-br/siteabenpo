"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ShieldCheck,
  Users,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import MascoteImg from "@/img/mascote.jpeg";

const highlights = [
  {
    icon: ShieldCheck,
    label: "Representatividade",
    value: "Nacional",
  },
  {
    icon: GraduationCap,
    label: "Especialidade",
    value: "Podiatria Clínica",
  },
  {
    icon: Users,
    label: "Desde",
    value: "2020",
  },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden section-spacing">
      <div aria-hidden="true" className="bg-blobs">
        <div
          className="bg-blobs__blob -top-32 left-[5%] h-[28rem] w-[28rem]"
          style={{ backgroundColor: "rgba(167, 243, 208, 0.5)" }}
        />
        <div
          className="bg-blobs__blob -bottom-40 right-[8%] h-96 w-96"
          style={{ backgroundColor: "rgba(204, 251, 241, 0.6)" }}
        />
        <div
          className="bg-blobs__blob top-1/2 left-1/2 h-72 w-[48rem] -translate-x-1/2 -translate-y-1/2"
          style={{ backgroundColor: "rgba(236, 253, 245, 0.4)" }}
        />
      </div>

      <div className="section-container relative">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7"
          >
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center gap-2 rounded-full border border-emerald-200/80 bg-white/80 px-4 py-2 text-sm font-semibold shadow-sm backdrop-blur-sm"
              style={{ color: "var(--color-primary-darker)" }}
            >
              <Sparkles
                className="size-4"
                style={{ color: "var(--color-primary)" }}
                aria-hidden="true"
              />
              Associação Brasileira de Enfermagem em Podiatria Clínica
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.2 }}
              className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1]"
              style={{ color: "var(--color-neutral-950)" }}
            >
              Fortalecendo a{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, var(--color-primary-dark), var(--color-primary), var(--color-secondary))",
                }}
              >
                Enfermagem em Podiatria Clínica
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.3 }}
              className="mt-6 max-w-2xl text-base leading-relaxed sm:text-lg sm:leading-8"
              style={{ color: "var(--color-neutral-600)" }}
            >
              A ABENPO reúne enfermeiros especialistas e habilitados para
              intensificar o desenvolvimento técnico e científico da Podiatria
              Clínica, com representatividade, credibilidade e crescimento
              profissional.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.4 }}
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <Link href="#associar" className="btn-primary">
                Se tornar associado
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link href="#sobre" className="btn-secondary">
                Conheça nossa história
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.5 }}
              className="mt-10 grid gap-3 sm:grid-cols-3"
            >
              {highlights.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-white/60 bg-white/70 p-4 shadow-sm backdrop-blur-sm"
                    style={{ borderRadius: "var(--radius-card)" }}
                  >
                    <span
                      className="icon-box icon-box--size-5"
                      style={{
                        backgroundColor: "rgba(16, 185, 129, 0.1)",
                        color: "var(--color-primary)",
                        borderColor: "rgba(16, 185, 129, 0.2)",
                      }}
                    >
                      <Icon
                        className="size-3.5"
                        strokeWidth={1.75}
                        aria-hidden="true"
                      />
                    </span>
                    <p
                      className="mt-2 text-xs font-medium uppercase tracking-wider"
                      style={{ color: "var(--color-neutral-500)" }}
                    >
                      {item.label}
                    </p>
                    <p
                      className="mt-0.5 text-sm font-semibold"
                      style={{ color: "var(--color-neutral-900)" }}
                    >
                      {item.value}
                    </p>
                  </div>
                );
              })}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.85,
              delay: 0.25,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="lg:col-span-5"
          >
            <div
              className="relative overflow-hidden border border-emerald-100/80 p-8 sm:p-10"
              style={{
                borderRadius: "28px",
                backgroundImage:
                  "linear-gradient(135deg, #ffffff 0%, rgba(236, 253, 245, 0.3) 50%, rgba(204, 251, 241, 0.4) 100%)",
                boxShadow: "var(--shadow-hero)",
              }}
            >
              <div aria-hidden="true" className="bg-blobs">
                <div
                  className="bg-blobs__blob -right-20 -top-20 h-56 w-56"
                  style={{ backgroundColor: "rgba(167, 243, 208, 0.4)" }}
                />
                <div
                  className="bg-blobs__blob -bottom-16 -left-16 h-48 w-48"
                  style={{ backgroundColor: "rgba(153, 246, 228, 0.3)" }}
                />
              </div>

              <div className="relative flex flex-col items-center">
                <div className="relative">
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 scale-110 rounded-full bg-emerald-100/50 blur-2xl"
                  />
                  <Image
                    src={MascoteImg}
                    alt="Mascote ABENPO"
                    priority
                    sizes="(min-width:1024px) 340px, 100vw"
                    className="relative w-[280px] animate-float drop-shadow-lg sm:w-[320px] lg:w-[340px]"
                  />
                </div>

                <div
                  className="mt-8 w-full border border-emerald-100/80 bg-white/80 p-5 text-center backdrop-blur-sm"
                  style={{ borderRadius: "var(--radius-card)" }}
                >
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "var(--color-primary-darker)" }}
                  >
                    Enfermagem em Podiatria Clínica
                  </p>
                  <p
                    className="mt-1 text-xs leading-relaxed"
                    style={{ color: "var(--color-neutral-600)" }}
                  >
                    Ciência, representatividade e excelência profissional em
                    todo o Brasil.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
