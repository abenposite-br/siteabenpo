"use client";

import { motion } from "framer-motion";
import { useFormStatus } from "react-dom";
import {
  UserPlus,
  Mail,
  Phone,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ClipboardList,
  Headphones,
  Sparkles,
  Target,
} from "lucide-react";
import { submitLead } from "@/app/actions/submit-lead";

const INTERESSE_OPTIONS = [
  "Quero me associar à ABENPO",
  "Desejo mais informações sobre a associação",
  "Tenho dúvidas sobre benefícios",
  "Quero entender o processo de associação",
  "Tenho interesse em cursos e eventos",
  "Outro assunto",
];

type AssociarSectionProps = {
  enviado?: string;
};

const steps = [
  {
    icon: ClipboardList,
    title: "Cadastre seu interesse",
    description:
      "Envie seus dados para iniciarmos o processo de associação de forma simples.",
  },
  {
    icon: Headphones,
    title: "Validação e orientações",
    description:
      "A equipe retorna com os próximos passos, documentos e informações necessárias.",
  },
  {
    icon: Sparkles,
    title: "Acesso aos benefícios",
    description:
      "Com a associação ativa, você passa a ter acesso a todos os benefícios e participações.",
  },
];

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto sm:px-6 sm:py-3.5"
    >
      {pending ? (
        <>
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          Enviando...
        </>
      ) : (
        <>
          Enviar interesse
          <Send className="size-4" aria-hidden="true" />
        </>
      )}
    </button>
  );
}

function StatusMessage({ enviado }: { enviado?: string }) {
  if (enviado === "1") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start gap-3 rounded-2xl border border-emerald-200/80 bg-emerald-50/90 p-4 text-emerald-950"
        role="status"
      >
        <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600" />
        <div>
          <p className="text-sm font-semibold">Interesse enviado com sucesso!</p>
          <p className="mt-1 text-sm text-emerald-800/90">
            Em breve entraremos em contato com as próximas etapas do processo de
            associação.
          </p>
        </div>
      </motion.div>
    );
  }

  if (enviado === "0") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start gap-3 rounded-2xl border border-amber-200/80 bg-amber-50/90 p-4 text-amber-950"
        role="alert"
      >
        <AlertCircle className="mt-0.5 size-5 shrink-0 text-amber-600" />
        <div>
          <p className="text-sm font-semibold">Verifique os dados informados</p>
          <p className="mt-1 text-sm text-amber-800/90">
            Preencha nome e e-mail válidos para enviar seu interesse.
          </p>
        </div>
      </motion.div>
    );
  }

  if (enviado === "2") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start gap-3 rounded-2xl border border-red-200/80 bg-red-50/90 p-4 text-red-950"
        role="alert"
      >
        <AlertCircle className="mt-0.5 size-5 shrink-0 text-red-600" />
        <div>
          <p className="text-sm font-semibold">Não foi possível enviar agora</p>
          <p className="mt-1 text-sm text-red-800/90">
            Tente novamente em instantes ou entre em contato pelo e-mail{" "}
            <a
              href="mailto:contato@abenpo.com.br"
              className="font-semibold underline underline-offset-2"
            >
              contato@abenpo.com.br
            </a>
            .
          </p>
        </div>
      </motion.div>
    );
  }

  return null;
}

export function AssociarSection({ enviado }: AssociarSectionProps) {
  return (
    <section
      id="associar"
      className="relative overflow-hidden bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-800 py-16 text-white sm:py-24 lg:py-28"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-0 h-96 w-96 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-teal-300/15 blur-3xl" />
        <div className="absolute left-1/2 top-1/3 h-64 w-[40rem] -translate-x-1/2 rounded-full bg-white/5 blur-3xl" />
      </div>

      <div className="section-container relative">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-start lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5"
          >
            <header className="section-header section-header--left">
              <p className="section-eyebrow text-emerald-100/90">
                Faça parte da ABENPO
              </p>
              <span
                className="section-divider"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(255,255,255,0.9) 0%, rgba(167,243,208,0.7) 100%)",
                }}
              />
              <h2 className="section-title section-title--lg text-white">
                Pronto para se tornar associado?
              </h2>
              <p className="section-subtitle section-subtitle--left text-emerald-50/95">
                Preencha o formulário ao lado e nossa equipe entrará em contato
                com orientações sobre documentação, valores e próximos passos.
              </p>
            </header>

            <ol className="mt-10 space-y-4">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <li
                    key={step.title}
                    className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
                  >
                    <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white ring-1 ring-white/15">
                      <Icon className="size-5" strokeWidth={1.75} />
                    </span>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-emerald-100/80">
                        Etapa {index + 1}
                      </p>
                      <h3 className="mt-1 text-sm font-semibold text-white">
                        {step.title}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-emerald-50/85">
                        {step.description}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{
              duration: 0.65,
              delay: 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="lg:col-span-7"
          >
            <div className="overflow-hidden rounded-[24px] border border-white/15 bg-white shadow-[0_24px_64px_rgba(15,23,42,0.18)]">
              <div className="border-b border-zinc-100 bg-gradient-to-r from-emerald-50 to-teal-50/80 px-6 py-5 sm:px-8">
                <div className="flex items-center gap-3">
                  <span className="inline-flex size-11 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
                    <UserPlus className="size-5" strokeWidth={1.75} />
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-zinc-900">
                      Formulário de interesse
                    </h3>
                    <p className="text-sm text-zinc-600">
                      Seus dados serão enviados para nossa equipe de atendimento.
                    </p>
                  </div>
                </div>
              </div>

              <form action={submitLead} className="p-6 text-zinc-950 sm:p-8">
                {enviado ? (
                  <div className="mb-6">
                    <StatusMessage enviado={enviado} />
                  </div>
                ) : null}

                <div className="grid gap-5">
                  <div>
                    <label
                      htmlFor="nome"
                      className="flex items-center gap-2 text-sm font-semibold text-zinc-900"
                    >
                      <UserPlus
                        className="size-4 text-emerald-600"
                        aria-hidden="true"
                      />
                      Nome completo
                    </label>
                    <input
                      id="nome"
                      name="nome"
                      required
                      autoComplete="name"
                      placeholder="Seu nome completo"
                      className="mt-2 w-full rounded-2xl border border-zinc-200 bg-zinc-50/50 px-4 py-3.5 text-sm text-zinc-950 shadow-sm outline-none transition-colors placeholder:text-zinc-400 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="flex items-center gap-2 text-sm font-semibold text-zinc-900"
                    >
                      <Mail
                        className="size-4 text-emerald-600"
                        aria-hidden="true"
                      />
                      E-mail
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="voce@exemplo.com"
                      className="mt-2 w-full rounded-2xl border border-zinc-200 bg-zinc-50/50 px-4 py-3.5 text-sm text-zinc-950 shadow-sm outline-none transition-colors placeholder:text-zinc-400 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="whatsapp"
                      className="flex items-center gap-2 text-sm font-semibold text-zinc-900"
                    >
                      <Phone
                        className="size-4 text-emerald-600"
                        aria-hidden="true"
                      />
                      WhatsApp
                      <span className="font-normal text-zinc-500">(opcional)</span>
                    </label>
                    <input
                      id="whatsapp"
                      name="whatsapp"
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder="(00) 00000-0000"
                      className="mt-2 w-full rounded-2xl border border-zinc-200 bg-zinc-50/50 px-4 py-3.5 text-sm text-zinc-950 shadow-sm outline-none transition-colors placeholder:text-zinc-400 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="interesse"
                      className="flex items-center gap-2 text-sm font-semibold text-zinc-900"
                    >
                      <Target
                        className="size-4 text-emerald-600"
                        aria-hidden="true"
                      />
                      Qual seu principal interesse?
                      <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="interesse"
                      name="interesse"
                      required
                      defaultValue=""
                      className="mt-2 w-full rounded-2xl border border-zinc-200 bg-zinc-50/50 px-4 py-3.5 text-sm text-zinc-950 shadow-sm outline-none transition-colors placeholder:text-zinc-400 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                    >
                      <option value="" disabled>
                        Selecione uma opção...
                      </option>
                      {INTERESSE_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <p className="mt-5 text-xs leading-5 text-zinc-500">
                  Ao enviar, você autoriza contato da ABENPO para orientações do
                  processo de associação.
                </p>

                <div className="mt-6">
                  <SubmitButton />
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
