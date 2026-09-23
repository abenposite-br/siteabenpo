"use client";

import { useEffect, useState } from "react";
import {
  Video,
  ExternalLink,
  Play,
  Search,
  X,
  Film,
} from "lucide-react";

type VideoItem = {
  id: string;
  title: string;
  description: string;
  url: string;
  createdAt: string;
};

function getYoutubeEmbed(url: string): string | null {
  const match =
    url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/);
  if (match) return `https://www.youtube.com/embed/${match[1]}`;
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return null;
}

export default function VideosPage() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/videos");
        if (!res.ok) throw new Error();
        const data = await res.json();
        setVideos(data);
      } catch {
        setError("Não foi possível carregar os vídeos.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtrados = videos.filter(
    (v) =>
      v.title.toLowerCase().includes(busca.trim().toLowerCase()) ||
      v.description.toLowerCase().includes(busca.trim().toLowerCase()),
  );

  return (
    <div className="space-y-6 sm:space-y-8">
      <header>
        <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700 uppercase tracking-wider mb-2">
          <Video className="size-4" />
          Conteúdos em Vídeo
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">
          Vídeos Exclusivos
        </h1>
        <p className="mt-1.5 text-sm sm:text-base text-zinc-600 max-w-2xl">
          Aulas, palestras, entrevistas e conteúdos em vídeo selecionados para
          os associados ABENPO.
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
          <Film className="size-14 mx-auto mb-4 text-zinc-300" />
          <p className="font-semibold text-zinc-600">
            {busca
              ? "Nenhum vídeo encontrado para esta busca"
              : "Nenhum vídeo disponível no momento"}
          </p>
          <p className="text-sm text-zinc-500 mt-1">
            Novos conteúdos serão adicionados em breve pela equipe ABENPO.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {filtrados.map((v, idx) => {
            const embed = getYoutubeEmbed(v.url);
            return (
              <article
                key={v.id}
                className="card-institutional overflow-hidden opacity-0 animate-fadeInUp"
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <div className="card-institutional__glow" />
                <div className="relative">
                  {embed ? (
                    <div className="relative w-full" style={{ aspectRatio: "16 / 9" }}>
                      <iframe
                        src={embed}
                        title={v.title}
                        loading="lazy"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute inset-0 w-full h-full bg-zinc-900"
                      />
                    </div>
                  ) : (
                    <a
                      href={v.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative block w-full bg-gradient-to-br from-zinc-900 via-zinc-800 to-emerald-900 flex items-center justify-center group"
                      style={{ aspectRatio: "16 / 9" }}
                    >
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.18),transparent_60%)]" />
                      <div className="relative inline-flex items-center justify-center size-20 rounded-full bg-white/10 backdrop-blur-sm ring-1 ring-white/25 group-hover:scale-110 group-hover:bg-white/15 transition-all duration-300 shadow-2xl">
                        <Play className="size-9 text-white ml-1" fill="currentColor" />
                      </div>
                      <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full bg-black/60 backdrop-blur px-2.5 py-1 text-xs font-semibold text-white ring-1 ring-white/10">
                        Abrir em nova aba
                        <ExternalLink className="size-3" />
                      </span>
                    </a>
                  )}

                  <div className="p-5 sm:p-6">
                    <h3 className="text-lg font-bold text-zinc-900 tracking-tight mb-2 leading-snug">
                      {v.title}
                    </h3>
                    {v.description && (
                      <p className="text-sm text-zinc-600 leading-relaxed line-clamp-2">
                        {v.description}
                      </p>
                    )}
                    {!embed && (
                      <div className="mt-4 pt-4 border-t border-zinc-100 flex justify-end">
                        <a
                          href={v.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
                        >
                          Assistir vídeo
                          <ExternalLink className="size-3.5" />
                        </a>
                      </div>
                    )}
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
