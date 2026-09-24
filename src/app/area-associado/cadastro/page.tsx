"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import LogoImg from "@/img/logo.jpeg";
import {
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Mail,
  Lock,
  Loader2,
  UserPlus,
  Phone,
  User,
} from "lucide-react";

export default function CadastroPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("abenpo-associado-login");
    if (saved) {
      router.replace("/area-associado/dashboard");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (form.password !== form.confirmPassword) {
      setMessage({
        type: "error",
        text: "As senhas não coincidem. Verifique e tente novamente.",
      });
      return;
    }
    if (form.password.length < 6) {
      setMessage({
        type: "error",
        text: "A senha deve ter pelo menos 6 caracteres.",
      });
      return;
    }

    setLoading(true);
    try {
      const createRes = await fetch("/api/associates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: form.email,
          password: form.password,
        }),
      });
      const createData = await createRes.json();
      if (!createRes.ok) {
        setMessage({
          type: "error",
          text: createData.error ?? "Erro ao criar conta",
        });
        setLoading(false);
        return;
      }

      const loginRes = await fetch("/api/associates/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });
      const loginData = await loginRes.json();
      if (!loginRes.ok) {
        setMessage({
          type: "success",
          text: "Conta criada! Faça login para acessar.",
        });
        setTimeout(() => {
          router.push("/area-associado/login");
        }, 1500);
        setLoading(false);
        return;
      }

      localStorage.setItem(
        "abenpo-associado-login",
        JSON.stringify({
          id: loginData.id,
          name: loginData.name,
          email: loginData.email,
          phone: loginData.phone,
        }),
      );
      setMessage({
        type: "success",
        text: "Cadastro realizado! Redirecionando...",
      });
      setTimeout(() => {
        router.push("/area-associado/dashboard");
      }, 900);
    } catch {
      setMessage({ type: "error", text: "Erro de conexão. Tente novamente." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex flex-col">
      <div className="section-container py-5">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-700 hover:text-emerald-700 transition-colors"
        >
          <ArrowLeft className="size-4" />
          Voltar ao site
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 pb-16">
        <div className="w-full max-w-lg">
          <div className="flex flex-col items-center mb-8">
            <div className="inline-flex items-center justify-center rounded-2xl bg-white p-2 shadow-md ring-1 ring-emerald-100 mb-4">
              <Image
                src={LogoImg}
                alt="Logo ABENPO"
                sizes="56px"
                className="w-14 h-auto rounded-xl"
              />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 text-center">
              Crie sua conta
            </h1>
            <p className="mt-2 text-sm text-zinc-600 text-center">
              Preencha os campos abaixo para acessar a área do associado
              ABENPO.
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl shadow-emerald-100/50 border border-zinc-100 p-6 sm:p-8">
            {message && (
              <div
                className={`mb-6 p-4 rounded-xl flex items-center gap-2 text-sm ${
                  message.type === "success"
                    ? "bg-green-50 text-green-800 ring-1 ring-green-200"
                    : "bg-red-50 text-red-800 ring-1 ring-red-200"
                }`}
              >
                {message.type === "success" ? (
                  <CheckCircle className="size-5 shrink-0" />
                ) : (
                  <AlertCircle className="size-5 shrink-0" />
                )}
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4.5">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-zinc-800 mb-1.5">
                  <User className="size-4 text-emerald-600" />
                  Nome completo
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  placeholder="Seu nome completo"
                  className="w-full px-4 py-3 rounded-2xl border border-zinc-200 bg-zinc-50/60 text-sm text-zinc-950 shadow-sm outline-none placeholder:text-zinc-400 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100 transition-colors"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-zinc-800 mb-1.5">
                  <Phone className="size-4 text-emerald-600" />
                  Telefone / WhatsApp
                </label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) =>
                    setForm({ ...form, phone: e.target.value })
                  }
                  placeholder="(00) 00000-0000"
                  className="w-full px-4 py-3 rounded-2xl border border-zinc-200 bg-zinc-50/60 text-sm text-zinc-950 shadow-sm outline-none placeholder:text-zinc-400 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100 transition-colors"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-zinc-800 mb-1.5">
                  <Mail className="size-4 text-emerald-600" />
                  E-mail
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                  placeholder="voce@exemplo.com"
                  className="w-full px-4 py-3 rounded-2xl border border-zinc-200 bg-zinc-50/60 text-sm text-zinc-950 shadow-sm outline-none placeholder:text-zinc-400 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100 transition-colors"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-zinc-800 mb-1.5">
                  <Lock className="size-4 text-emerald-600" />
                  Senha
                  <span className="text-[11px] font-normal text-zinc-500 ml-1">
                    (mínimo 6 caracteres)
                  </span>
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  placeholder="Crie uma senha"
                  className="w-full px-4 py-3 rounded-2xl border border-zinc-200 bg-zinc-50/60 text-sm text-zinc-950 shadow-sm outline-none placeholder:text-zinc-400 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100 transition-colors"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-zinc-800 mb-1.5">
                  <Lock className="size-4 text-emerald-600" />
                  Confirmar senha
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={form.confirmPassword}
                  onChange={(e) =>
                    setForm({ ...form, confirmPassword: e.target.value })
                  }
                  placeholder="Repita a senha"
                  className="w-full px-4 py-3 rounded-2xl border border-zinc-200 bg-zinc-50/60 text-sm text-zinc-950 shadow-sm outline-none placeholder:text-zinc-400 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100 transition-colors"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-200 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-300/70 hover:-translate-y-0.5 hover:brightness-105 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Criando conta...
                  </>
                ) : (
                  <>
                    <UserPlus className="size-4" />
                    Cadastrar e Acessar
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-zinc-100 text-center">
              <p className="text-sm text-zinc-600">
                Já tem conta?{" "}
                <Link
                  href="/area-associado/login"
                  className="font-bold text-emerald-700 hover:text-emerald-800 hover:underline underline-offset-2"
                >
                  Faça login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
