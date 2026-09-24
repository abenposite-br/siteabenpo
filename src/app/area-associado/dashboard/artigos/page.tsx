"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  ExternalLink,
  FileText,
  CalendarDays,
  Search,
  X,
  Sparkles,
  FlaskConical,
  Stethoscope,
} from "lucide-react";

type Article = {
  id: string;
  title: string;
  url: string;
  image?: string;
  description?: string;
  createdAt: string;
};

function getArticleCategory(title: string): {
  label: string;
  tone: "emerald" | "teal" | "cyan";
} {
  const t = title.toLowerCase();
  if (
    t.includes("laser") ||
    t.includes("terapia") ||
    t.includes("tratamento") ||
    t.includes("reabilita")
  ) {
    return { label: "Tratamento e Terapia", tone: "teal" };
  }
  if (
    t.includes("revis") ||
    t.includes("estudo") ||
    t.includes("série de casos") ||
    t.includes("avaliação") ||
    t.includes("scale")
  ) {
    return { label: "Pesquisa e Evidência", tone: "emerald" };
  }
  if (
    t.includes("implementação") ||
    t.includes("serviço") ||
    t.includes("clínica") ||
    t.includes("clinic")
  ) {
    return { label: "Prática Clínica", tone: "cyan" };
  }
  return { label: "Publicação Científica", tone: "emerald" };
}

function toneClasses(tone: "emerald" | "teal" | "cyan") {
  switch (tone) {
    case "teal":
      return "bg-teal-50 text-teal-700 ring-teal-200";
    case "cyan":
      return "bg-cyan-50 text-cyan-700 ring-cyan-200";
    case "emerald":
    default:
      return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  }
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

function buildFallbackDescription(article: Article): string {
  if (article.description && article.description.trim().length > 0) {
    return article.description;
  }
  try {
    const host = new URL(article.url).hostname.replace(/^www\./, "");
    return `Publicação veiculada em ${host}. Acesse o artigo completo para ler o conteúdo integral.`;
  } catch {
    return "Acesse o link para ler o artigo completo.";
  }
}

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

  const dedupedArticles = useMemo(() => {
    const seenByUrl = new Map<string, Article>();
    const seenByTitle = new Map<string, Article>();
    const finalList: Article[] = [];

    const normalizeStr = (s: string) =>
      s
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, " ");

    const normalizeUrl = (url: string) => {
      try {
        const u = new URL(url.trim().toLowerCase());
        const path = u.pathname.replace(/\/+$/, "");
        return `${u.hostname}${path}${u.search}`;
      } catch {
        return url.trim().toLowerCase().replace(/\/+$/, "");
      }
    };

    for (const item of articles) {
      const normUrl = item.url ? normalizeUrl(item.url) : "";
      const normTitle = normalizeStr(item.title);
      let duplicate = false;

      if (normUrl && seenByUrl.has(normUrl)) {
        duplicate = true;
      } else if (normTitle && seenByTitle.has(normTitle)) {
        duplicate = true;
      }

      if (!duplicate) {
        if (normUrl) seenByUrl.set(normUrl, item);
        if (normTitle) seenByTitle.set(normTitle, item);
        finalList.push(item);
      }
    }

    return finalList;
  }, [articles]);

  const filtrados = useMemo(
    () =>
      dedupedArticles.filter((a) =>
        a.title.toLowerCase().includes(busca.trim().toLowerCase()),
      ),
    [dedupedArticles, busca],
  );

  return (
    <div className="space-y-6 sm:space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700 uppercase tracking-wider mb-2">
            <BookOpen className="size-4" />
            Biblioteca do Associado
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">
            Artigos e Publicações
          </h1>
          <p className="mt-1.5 text-sm sm:text-base text-zinc-600 max-w-2xl">
            Conteúdos científicos, artigos técnicos e publicações selecionadas
            para apoiar sua prática clínica e atualização profissional.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-emerald-50 to-teal-50 px-4 py-2.5 rounded-2xl ring-1 ring-emerald-100">
          <Sparkles className="size-4 text-emerald-600" />
          <span className="text-sm font-semibold text-zinc-700">
            {dedupedArticles.length}{" "}
            <span className="text-zinc-500 font-normal">
              publicações disponíveis
            </span>
          </span>
        </div>
      </header>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        <div className="relative flex-1 max-w-xl">
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
        <div className="sm:hidden flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-50 to-teal-50 px-4 py-2.5 rounded-2xl ring-1 ring-emerald-100 w-fit">
          <Sparkles className="size-4 text-emerald-600" />
          <span className="text-sm font-semibold text-zinc-700">
            {dedupedArticles.length}{" "}
            <span className="text-zinc-500 font-normal">
              publicações
            </span>
          </span>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-zinc-500">Carregando...</div>
      ) : error ? (
        <div className="text-center py-20 text-red-600 bg-red-50 rounded-2xl border border-red-100">
          {error}
        </div>
      ) : filtrados.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-zinc-200 rounded-3xl bg-white">
          <div className="inline-flex size-20 items-center justify-center rounded-3xl bg-zinc-50 ring-1 ring-zinc-200 mb-5">
            <FileText className="size-10 text-zinc-300" />
          </div>
          <p className="font-semibold text-zinc-700 text-lg">
            {busca
              ? "Nenhum artigo encontrado para esta busca"
              : "Nenhum conteúdo disponível no momento"}
          </p>
          <p className="text-sm text-zinc-500 mt-2 max-w-md mx-auto">
            {busca
              ? "Tente ajustar os termos da pesquisa ou volte em breve para novas publicações."
              : "Novas publicações serão adicionadas em breve pela equipe ABENPO."}
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filtrados.map((article, idx) => {
            const category = getArticleCategory(article.title);
            const description = buildFallbackDescription(article);
            const date = formatDate(article.createdAt);
            const CoverIcon =
              category.tone === "teal"
                ? FlaskConical
                : category.tone === "cyan"
                  ? Stethoscope
                  : BookOpen;
            return (
              <article
                key={article.id}
                className="card-institutional overflow-hidden opacity-0 animate-fadeInUp group"
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <div className="card-institutional__glow" />
                <div className="relative flex flex-col h-full">
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative block w-full overflow-hidden"
                    style={{ aspectRatio: "16 / 9" }}
                  >
                    {article.image ? (
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                        style={{ backgroundImage: `url(${article.image})` }}
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 transition-transform duration-500 group-hover:scale-105">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.22),transparent_55%),radial-gradient(circle_at_80%_80%,rgba(16,185,129,0.25),transparent_50%)]" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="inline-flex size-16 items-center justify-center rounded-3xl bg-white/15 backdrop-blur-sm ring-1 ring-white/25 text-white shadow-2xl group-hover:scale-110 transition-transform duration-300">
                            <CoverIcon className="size-8" strokeWidth={1.75} />
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 backdrop-blur ${toneClasses(category.tone)}`}
                      >
                        {category.label}
                      </span>
                    </div>
                    {date && (
                      <div className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-black/55 backdrop-blur px-2.5 py-1 text-[11px] font-semibold text-white ring-1 ring-white/10">
                        <CalendarDays className="size-3.5" />
                        {date}
                      </div>
                    )}
                  </a>

                  <div className="p-5 sm:p-6 flex flex-col flex-1">
                    <h3 className="text-lg font-bold text-zinc-900 tracking-tight mb-2 leading-snug line-clamp-3 group-hover:text-emerald-800 transition-colors">
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline decoration-emerald-300 underline-offset-4"
                      >
                        {article.title}
                      </a>
                    </h3>
                    <p className="text-sm text-zinc-600 leading-relaxed line-clamp-3 flex-1">
                      {description}
                    </p>
                    <div className="flex items-center justify-between gap-3 mt-5 pt-4 border-t border-zinc-100">
                      <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                        <FileText className="size-3.5" />
                        Artigo completo
                      </div>
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-700 hover:text-emerald-800 transition-colors group/link"
                      >
                        Ler
                        <ExternalLink className="size-3.5 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
