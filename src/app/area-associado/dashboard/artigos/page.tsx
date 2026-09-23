"use client";

import { useEffect, useState } from "react";
import {
  BookOpen,
  ExternalLink,
  FileText,
  CalendarDays,
  Search,
  X,
} from "lucide-react";

type Article = {
  id: string;
  title: string;
  url: string;
  image?: string;
  description?: string;
  createdAt: string;
};

export default function ArtigosPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/articles");
        if (!res.ok) throw new Error();
        const data = await res.json();
        setArticles(data);
      } catch {
        setError("Não foi possível carregar os artigos.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtrados = articles.filter((a) =>
    a.title.toLowerCase().includes(busca.trim().toLowerCase()),
  );

  return (
    <div className="space-y-6 sm:space-y-8">
      <header>
        <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700 uppercase tracking-wider mb-2">
          <BookOpen className="size-4" />
          Biblioteca
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">
          Artigos e Publicações
        </h1>
        <p className="mt-1.5 text-sm sm:text-base text-zinc-600 max-w-2xl">
          Conteúdos científicos, artigos técnicos e publicações selecionadas
          para nossos associados.
        </p>
      </header>

      <div className="relative max-w-xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-zinc-400" />
        <input
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar por título..."
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
          <FileText className="size-14 mx-auto mb-4 text-zinc-300" />
          <p className="font-semibold text-zinc-600">
            {busca
              ? "Nenhum artigo encontrado para esta busca"
              : "Nenhum conteúdo disponível no momento"}
          </p>
          <p className="text-sm text-zinc-500 mt-1">
            Novas publicações serão adicionadas em breve.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtrados.map((article, idx) => (
            <article
              key={article.id}
              className="card-institutional p-6 sm:p-7 opacity-0 animate-fadeInUp"
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              <div className="card-institutional__glow" />
              <div className="relative flex flex-col h-full">
                <div className="icon-box icon-box--size-11 mb-5">
                  <FileText className="size-5" />
                </div>
                <h3 className="text-lg font-bold text-zinc-900 tracking-tight mb-2 leading-snug line-clamp-3">
                  {article.title}
                </h3>
                {article.description && (
                  <p className="text-sm text-zinc-600 mb-4 line-clamp-2 flex-1">
                    {article.description}
                  </p>
                )}
                {!article.description && <div className="flex-1" />}
                <div className="flex items-center justify-between gap-3 mt-4 pt-4 border-t border-zinc-100">
                  <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                    <CalendarDays className="size-3.5" />
                    {new Date(article.createdAt).toLocaleDateString("pt-BR")}
                  </div>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
                  >
                    Ler
                    <ExternalLink className="size-3.5" />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
