"use client";

import Link from "next/link";
import Image from "next/image";
import LogoImg from "@/img/logo.jpeg";
import { motion } from "framer-motion";
import { ExternalLink, GraduationCap, CreditCard, ArrowLeft } from "lucide-react";

export default function EscolhaPage() {
  return (
    <div className="min-h-screen flex flex-col bg-transparent">
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
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-700 hover:text-emerald-700 transition-colors"
            >
              <ArrowLeft className="size-4" />
              Voltar ao site
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 sm:py-20">
        <div className="w-full max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10 sm:mb-14"
          >
            <p className="text-sm font-semibold uppercase tracking-wider text-emerald-700">
              Área do Associado
            </p>
            <h1 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-zinc-900">
              Escolha a área de acesso
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-base sm:text-lg text-zinc-600 leading-relaxed">
              Selecione abaixo para qual portal deseja ir. Ambas as áreas são
              exclusivas para associados ABENPO.
            </p>
          </motion.div>

          <div className="grid gap-6 sm:gap-8 md:grid-cols-2">
            <motion.a
              href="https://app.associatec.com.br/AreaAssociados"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ y: -6 }}
              className="group relative flex flex-col items-center text-center p-8 sm:p-10 rounded-3xl bg-white border-2 border-emerald-600/80 shadow-lg shadow-emerald-100/60 hover:shadow-2xl hover:shadow-emerald-200 transition-all duration-300"
            >
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-emerald-50/60 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative inline-flex size-20 items-center justify-center rounded-3xl bg-emerald-100 text-emerald-700 mb-6 ring-1 ring-emerald-200 group-hover:scale-110 transition-transform duration-300">
                <ExternalLink className="size-10" strokeWidth={1.75} />
              </div>
              <h2 className="relative text-xl sm:text-2xl font-bold text-zinc-900 mb-2">
                Portal Associatec
              </h2>
              <p className="relative text-sm sm:text-base text-zinc-600 mb-8 leading-relaxed max-w-xs mx-auto">
                Acesso ao portal terceirizado existente — boletos,
                documentação e serviços da Associatec.
              </p>
              <span className="relative inline-flex items-center gap-2 px-6 py-3 rounded-2xl border-2 border-emerald-600 text-sm font-bold text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                Acessar Associatec
                <ExternalLink className="size-4" />
              </span>
            </motion.a>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ y: -6 }}
              className="group relative flex flex-col items-center text-center p-8 sm:p-10 rounded-3xl border-2 border-transparent shadow-2xl hover:shadow-emerald-200 transition-all duration-300 overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50 to-white ring-2 ring-emerald-200/60"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
              >
                <div className="absolute -top-16 -right-16 h-56 w-56 rounded-full bg-emerald-400/20 blur-3xl group-hover:bg-emerald-400/30 transition-colors" />
                <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-teal-400/20 blur-3xl" />
              </div>

              <span className="relative inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-md shadow-emerald-200 mb-5">
                Novo
              </span>

              <div className="relative inline-flex size-20 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-600 text-white mb-6 shadow-xl shadow-emerald-300/50 group-hover:scale-110 transition-transform duration-300">
                <div className="relative">
                  <GraduationCap
                    className="size-10"
                    strokeWidth={1.75}
                  />
                  <CreditCard className="absolute -bottom-1 -right-2 size-6 bg-white text-emerald-700 rounded-lg p-1 shadow-md" />
                </div>
              </div>

              <h2 className="relative text-xl sm:text-2xl font-bold text-zinc-900 mb-2">
                Portal ABENPO
              </h2>
              <p className="relative text-sm sm:text-base text-zinc-600 mb-8 leading-relaxed max-w-xs mx-auto">
                Carteirinha virtual, artigos exclusivos, vídeos e treinamentos
                especiais da ABENPO.
              </p>

              <Link
                href="/area-associado/login"
                className="relative inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-sm font-bold text-white shadow-xl shadow-emerald-300/40 hover:shadow-emerald-300/70 hover:brightness-110 transition-all duration-300"
              >
                Acessar / Cadastrar
                <ArrowLeft className="size-4 rotate-180" />
              </Link>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
