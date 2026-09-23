"use client";

import { useEffect, useState } from "react";
import {
  GraduationCap,
  ExternalLink,
  FileText,
  Search,
  X,
  PlayCircle,
  Book,
} from "lucide-react";

type Training = {
  id: string;
  title: string;
  description: string;
  fileUrl: string;
  videoUrl?: string;
  createdAt: string;
};

export default function TreinamentosPage() {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/trainings");
        if (!res.ok) throw new Error();
        const data = await res.json();
        setTrainings(data);
      } catch {
        setError("Não foi possível carregar os treinamentos.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtrados = trainings.filter(
    (t) =>
      t.title.toLowerCase().includes(busca.trim().toLowerCase()) ||
      t.description.toLowerCase().includes(busca.trim().toLowerCase()),
  );

  return (
    <div className="space-y-6 sm:space-y-8">
      <header>
        <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700 uppercase tracking-wider mb-2">
          <GraduationCap className="size-4" />
          Educação Continuada
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">
          Treinamentos e Cursos
        </h1>
        <p className="mt-1.5 text-sm sm:text-base text-zinc-600 max-w-2xl">
          Materiais, apostilas, cursos e conteúdos de capacitação profissional
          exclusivos para associados ABENPO.
        </p>
      </header>

      <div className="relative max-w-xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-zinc-400" />
        <input
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar por título ou descrição..."
          className="w-full pl-12 pr-10 py-3 rounded-2xl border border-zinc-200 bg-white text-sm text-zinc-950 shadow-sm outline-none placeholder:text-zinc-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 transition-colors"
        />
        {busca && (
          <button
            type="button"
            onClick={() => setBusca("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-zinc-100 text-zinc-500"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-20 text-zinc-500">Carregando...</div>
      ) : error ? (
        <div className="text-center py-20 text-red-600 bg-red-50 rounded-2xl border border-red-100">
          {error}
        </div>
      ) : filtrados.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-zinc-200 rounded-3xl bg-white">
          <Book className="size-14 mx-auto mb-4 text-zinc-300" />
          <p className="font-semibold text-zinc-600">
            {busca
              ? "Nenhum treinamento encontrado para esta busca"
              : "Nenhum treinamento disponível no momento"}
          </p>
          <p className="text-sm text-zinc-500 mt-1">
            Novos cursos serão publicados em breve pela equipe ABENPO.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {filtrados.map((t, idx) => (
            <article
              key={t.id}
              className="card-institutional p-6 sm:p-7 opacity-0 animate-fadeInUp flex flex-col"
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              <div className="card-institutional__glow" />
              <div className="relative flex-1 flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div className="icon-box icon-box--size-11">
                    <GraduationCap className="size-5" />
                  </div>
                  <span className="text-[11px] font-semibold text-zinc-500">
                    {new Date(t.createdAt).toLocaleDateString("pt-BR")}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-zinc-900 tracking-tight mb-2.5 leading-snug">
                  {t.title}
                </h3>
                {t.description && (
                  <p className="text-sm text-zinc-600 leading-relaxed mb-5 flex-1">
                    {t.description}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-2.5 pt-5 border-t border-zinc-100">
                  <a
                    href={t.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-sm font-bold text-white shadow-md shadow-emerald-200 hover:shadow-lg hover:shadow-emerald-300/60 hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <FileText className="size-4" />
                    Material completo
                    <ExternalLink className="size-3.5" />
                  </a>
                  {t.videoUrl && (
                    <a
                      href={t.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-zinc-200 bg-white text-sm font-bold text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300 transition-colors"
                    >
                      <PlayCircle className="size-4 text-emerald-700" />
                      Ver vídeo
                      <ExternalLink className="size-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
