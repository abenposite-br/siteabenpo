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
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
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
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/associates/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: "error", text: data.error ?? "Erro ao entrar" });
        setLoading(false);
        return;
      }
      localStorage.setItem(
        "abenpo-associado-login",
        JSON.stringify({
          id: data.id,
          name: data.name,
          email: data.email,
          phone: data.phone,
        }),
      );
      setMessage({ type: "success", text: "Login realizado com sucesso!" });
      setTimeout(() => {
        router.push("/area-associado/dashboard");
      }, 600);
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
          href="/area-associado/escolha"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-700 hover:text-emerald-700 transition-colors"
        >
          <ArrowLeft className="size-4" />
          Voltar para escolha
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 pb-16">
        <div className="w-full max-w-md">
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
              Acesso do Associado ABENPO
            </h1>
            <p className="mt-2 text-sm text-zinc-600 text-center">
              Entre com suas credenciais para acessar a área exclusiva.
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

            <form onSubmit={handleSubmit} className="space-y-5">
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
                </label>
                <input
                  type="password"
                  required
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  placeholder="Sua senha"
                  className="w-full px-4 py-3 rounded-2xl border border-zinc-200 bg-zinc-50/60 text-sm text-zinc-950 shadow-sm outline-none placeholder:text-zinc-400 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100 transition-colors"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-200 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-300/70 hover:-translate-y-0.5 hover:brightness-105 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {loading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  "Entrar"
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-zinc-100 text-center">
              <p className="text-sm text-zinc-600">
                Ainda não tem conta?{" "}
                <Link
                  href="/area-associado/cadastro"
                  className="font-bold text-emerald-700 hover:text-emerald-800 hover:underline underline-offset-2"
                >
                  Cadastre-se aqui
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
