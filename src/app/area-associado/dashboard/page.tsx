"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import LogoImg from "@/img/logo.jpeg";
import {
  CreditCard,
  Calendar,
  BadgeCheck,
  Download,
  Sparkles,
} from "lucide-react";

type AssociateLocal = {
  id: string;
  name: string;
  email: string;
  phone: string;
};

function getFormattedDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "-";
  }
}

function memberSince(dateStr: string) {
  try {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMonths =
      (now.getFullYear() - d.getFullYear()) * 12 +
      (now.getMonth() - d.getMonth());
    if (diffMonths < 1) return "Recém-cadastrado";
    if (diffMonths < 12)
      return `Sócio há ${diffMonths} mês${diffMonths > 1 ? "es" : ""}`;
    const anos = Math.floor(diffMonths / 12);
    return `Sócio há ${anos} ano${anos > 1 ? "s" : ""}`;
  } catch {
    return "";
  }
}

function readInitialAssociate(): {
  user: AssociateLocal | null;
  createdAt: string;
} {
  if (typeof window === "undefined") return { user: null, createdAt: "" };
  try {
    const raw = localStorage.getItem("abenpo-associado-login");
    if (!raw) return { user: null, createdAt: "" };
    const parsed = JSON.parse(raw) as AssociateLocal & { createdAt?: string };
    return {
      user: parsed,
      createdAt: parsed.createdAt ?? new Date().toISOString(),
    };
  } catch {
    return { user: null, createdAt: "" };
  }
}

export default function DashboardHome() {
  const initial = readInitialAssociate();
  const [user, setUser] = useState<AssociateLocal | null>(initial.user);
  const [createdAt, setCreatedAt] = useState<string>(initial.createdAt);

  useEffect(() => {
    if (user && createdAt) return;
    const raw = localStorage.getItem("abenpo-associado-login");
    if (!raw) return;
    const parsed = JSON.parse(raw) as AssociateLocal & {
      createdAt?: string;
    };
    queueMicrotask(() => {
      setUser(parsed);
      setCreatedAt(parsed.createdAt ?? new Date().toISOString());
    });
  }, [user, createdAt]);

  const firstName =
    user?.name.split(" ").filter(Boolean)[0] ?? "Associado";
  const memberNumber =
    user?.id?.slice(0, 8).toUpperCase() ?? "ABENPO-001";

  return (
    <div className="space-y-8 sm:space-y-10">
      <header>
        <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700 uppercase tracking-wider mb-2">
          <CreditCard className="size-4" />
          Carteira de Sócio
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">
          Bem-vindo, {firstName}!
        </h1>
        <p className="mt-1.5 text-sm sm:text-base text-zinc-600 max-w-2xl">
          Aqui está sua carteirinha virtual de associado ABENPO. Use-a como
          comprovação de vínculo ativo.
        </p>
      </header>

      <section className="max-w-3xl">
        <div
          aria-label="Carteirinha de associado ABENPO"
          className="relative overflow-hidden rounded-[28px] p-6 sm:p-8 lg:p-9 text-white shadow-[0_30px_80px_rgba(6,95,70,0.30)] ring-1 ring-white/10 bg-gradient-to-br from-emerald-900 via-emerald-700 to-teal-700"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
          >
            <div className="absolute -top-20 -right-16 h-56 w-56 rounded-full bg-teal-300/20 blur-3xl" />
            <div className="absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-emerald-300/25 blur-3xl" />
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.9) 1px, transparent 0)",
                backgroundSize: "22px 22px",
              }}
            />
          </div>

          <div className="relative flex items-start justify-between gap-4 mb-10 sm:mb-12">
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center justify-center rounded-2xl bg-white/95 p-1.5 shadow-lg shadow-black/10 ring-1 ring-white/50">
                <Image
                  src={LogoImg}
                  alt="Logo ABENPO"
                  sizes="48px"
                  className="w-12 h-auto rounded-xl"
                />
              </div>
              <div>
                <p className="text-lg sm:text-xl font-extrabold tracking-tight">
                  ABENPO
                </p>
                <p className="text-[11px] sm:text-xs text-white/75 font-medium uppercase tracking-[0.12em]">
                  Associação Brasileira
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.16em] text-white/70">
                Carteira de Sócio
              </p>
              <p className="mt-1 text-sm sm:text-base font-mono font-bold text-white/90">
                Nº {memberNumber}
              </p>
            </div>
          </div>

          <div className="relative space-y-5">
            <div>
              <p className="text-[11px] sm:text-xs uppercase tracking-[0.14em] text-white/70 font-semibold mb-1.5">
                Nome do Associado
              </p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight uppercase leading-tight break-words">
                {user?.name ?? "—"}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 sm:gap-8 pt-2 sm:pt-3 border-t border-white/15">
              <div>
                <p className="text-[11px] uppercase tracking-[0.14em] text-white/70 font-semibold mb-1">
                  Registro
                </p>
                <div className="flex items-center gap-2">
                  <BadgeCheck className="size-4.5 text-emerald-200 shrink-0" />
                  <span className="text-sm font-bold text-white">
                    Associado Ativo
                  </span>
                </div>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.14em] text-white/70 font-semibold mb-1">
                  Desde
                </p>
                <div className="flex items-center gap-2">
                  <Calendar className="size-4.5 text-emerald-200 shrink-0" />
                  <span className="text-sm font-bold text-white">
                    {getFormattedDate(createdAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="relative mt-8 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-3">
            <p className="text-[11px] sm:text-xs text-white/80 leading-relaxed max-w-md">
              Associação Brasileira de Enfermagem em Podiatria Clínica —
              Documento de identificação do associado.
            </p>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold text-white ring-1 ring-white/20">
              <Sparkles className="size-3 text-emerald-200" />
              {memberSince(createdAt)}
            </span>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="button"
            disabled
            title="Funcionalidade de download em desenvolvimento"
            className="inline-flex items-center gap-2 rounded-2xl bg-white border border-zinc-200 px-4 py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Download className="size-4" />
            Baixar Carteirinha
            <span className="text-[10px] font-medium text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-full">
              Breve
            </span>
          </button>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="card-institutional p-6">
          <div className="card-institutional__glow" />
          <div className="relative">
            <div className="icon-box icon-box--size-12 mb-4">
              <BookOpenImported className="size-5" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900 mb-1">Artigos</h3>
            <p className="text-sm text-zinc-600 leading-relaxed">
              Publicações científicas e conteúdos exclusivos para associados.
            </p>
          </div>
        </div>
        <div className="card-institutional p-6">
          <div className="card-institutional__glow" />
          <div className="relative">
            <div className="icon-box icon-box--size-12 mb-4">
              <VideoImported className="size-5" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900 mb-1">Vídeos</h3>
            <p className="text-sm text-zinc-600 leading-relaxed">
              Aulas, palestras e conteúdos em vídeo selecionados.
            </p>
          </div>
        </div>
        <div className="card-institutional p-6">
          <div className="card-institutional__glow" />
          <div className="relative">
            <div className="icon-box icon-box--size-12 mb-4">
              <GraduationCapImported className="size-5" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900 mb-1">
              Treinamentos
            </h3>
            <p className="text-sm text-zinc-600 leading-relaxed">
              Cursos e materiais de capacitação para aprimoramento profissional.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

import { BookOpen as BookOpenImported } from "lucide-react";
import { Video as VideoImported } from "lucide-react";
import { GraduationCap as GraduationCapImported } from "lucide-react";
