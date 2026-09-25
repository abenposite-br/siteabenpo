"use client";

import { useEffect, useMemo, useState } from "react";
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

const LOCAL_FALLBACK_VIDEOS: VideoItem[] = [
  {
    id: "video_local_fallback_1",
    title: "Vídeo Institucional ABENPO",
    description:
      "Apresentação da Associação Brasileira de Enfermagem em Podiatria Clínica — sua missão, valores, atividades e benefícios para os associados.",
    url: "/videos/abenpo-video.mp4",
    createdAt: new Date().toISOString(),
  },
];

function getYoutubeEmbed(url: string): string | null {
  const match =
    url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/);
  if (match) return `https://www.youtube.com/embed/${match[1]}`;
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return null;
}

function isLocalVideo(url: string): boolean {
  return typeof url === "string" && (url.startsWith("/") || url.startsWith("./"));
}

function resolveLocalVideoSrc(url: string): string {
  if (url.startsWith("./")) {
    const clean = url.replace(/^\.\//, "");
    return clean.startsWith("/") ? clean : `/${clean}`;
  }
  if (!url.startsWith("/")) return `/${url}`;
  return url;
}

function detectVideoType(url: string): string {
  const u = url.toLowerCase();
  if (u.endsWith(".webm")) return "video/webm";
  if (u.endsWith(".ogv") || u.endsWith(".ogg")) return "video/ogg";
  if (u.endsWith(".mov")) return "video/quicktime";
  if (u.endsWith(".mkv")) return "video/x-matroska";
  return "video/mp4";
}

function LocalVideoPlayer({
  url,
}: {
  url: string;
  title?: string;
}) {
  const [retryKey, setRetryKey] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [errorInfo, setErrorInfo] = useState<{ code: number; msg: string } | null>(
    null,
  );
  const [baseTimestamp] = useState(() => Date.now());

  const src = useMemo(() => resolveLocalVideoSrc(url), [url]);
  const mimeType = useMemo(() => detectVideoType(src), [src]);
  const videoKey = useMemo(() => `${retryKey}-${src}`, [retryKey, src]);
  const cacheBust = useMemo(
    () => `${src.includes("?") ? "&" : "?"}t=${baseTimestamp + retryKey}`,
    [src, retryKey, baseTimestamp],
  );
  const srcFresh = `${src}${cacheBust}`;

  const mediaErrorCodeLabel = (code: number) => {
    switch (code) {
      case 1:
        return "MEDIA_ERR_ABORTED — carregamento interrompido";
      case 2:
        return "MEDIA_ERR_NETWORK — erro de rede ao baixar";
      case 3:
        return "MEDIA_ERR_DECODE — codec incompatível ou arquivo corrompido";
      case 4:
        return "MEDIA_ERR_SRC_NOT_SUPPORTED — formato/URL não suportado";
      default:
        return `Código de erro desconhecido (${code})`;
    }
  };

  return (
    <div className="relative w-full bg-black group overflow-hidden rounded-none">
      <div className="relative w-full" style={{ aspectRatio: "16 / 9" }}>
        <video
          key={videoKey}
          controls
          playsInline
          preload="auto"
          autoPlay={false}
          muted={false}
          onLoadedData={() => {
            setIsLoaded(true);
            setHasError(false);
            setErrorInfo(null);
          }}
          onError={(e) => {
            const code = e.currentTarget.error?.code ?? 0;
            const msg = e.currentTarget.error?.message ?? "";
            const detail = mediaErrorCodeLabel(code);
            console.error(
              "[VideoPlayer] Falha reprodução:",
              src,
              { code, msg, detail, srcFresh },
            );
            setErrorInfo({ code, msg: detail });
            setHasError(true);
          }}
          onCanPlay={() => {
            setIsLoaded(true);
            setHasError(false);
          }}
          onLoadStart={() => {
            setIsLoaded(false);
            setHasError(false);
            setErrorInfo(null);
          }}
          onLoadedMetadata={() => {
            setIsLoaded(true);
          }}
          poster=""
          className="block w-full h-full bg-black"
          style={{ objectFit: "contain", maxWidth: "100%", maxHeight: "100%" }}
        >
          <source
            src={src}
            type={`${mimeType}; codecs="avc1.42E01E, mp4a.40.2"`}
          />
          <source src={src} type={mimeType} />
          <source
            src={srcFresh}
            type={`${mimeType}; codecs="hev1.1.6.L93.B0, mp4a.40.2"`}
          />
          <source src={srcFresh} type={mimeType} />
          <source src={src} />
          <source src={srcFresh} />
          Seu navegador não suporta a reprodução de vídeos. Abra
          diretamente em{" "}
          <a
            href={src}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-500 underline"
          >
            este link
          </a>
          .
        </video>

        {!isLoaded && !hasError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 text-white z-10 pointer-events-none">
            <div className="size-10 rounded-full border-4 border-emerald-500/40 border-t-emerald-400 animate-spin mb-3" />
            <p className="text-xs text-zinc-300">Carregando vídeo...</p>
          </div>
        )}

        {hasError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-zinc-950 via-zinc-900 to-emerald-950 text-white z-20 px-4 text-center">
            <Play className="size-14 mb-3 text-white/60" />
            <h4 className="text-sm font-bold text-zinc-100 mb-1">
              Não foi possível reproduzir
            </h4>
            {errorInfo && (
              <p className="text-[10px] font-mono text-emerald-300/70 mb-2 max-w-xs truncate w-full">
                {errorInfo.msg}
              </p>
            )}
            <p className="text-xs text-zinc-400 mb-4 max-w-xs">
              Este vídeo foi exportado via WhatsApp/InShot e pode ter um codec
              incompatível com o player HTML5. Use os botões abaixo ou abra
              diretamente no seu navegador/sistema:
            </p>
            <div className="flex gap-2 flex-wrap justify-center">
              <button
                type="button"
                onClick={() => {
                  setHasError(false);
                  setIsLoaded(false);
                  setErrorInfo(null);
                  setRetryKey((k) => k + 1);
                }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-3 py-2 text-xs font-bold text-white shadow-lg transition-colors"
              >
                Tentar novamente
              </button>
              <a
                href={src}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 hover:bg-white/15 ring-1 ring-white/20 px-3 py-2 text-xs font-bold text-white backdrop-blur transition-colors"
              >
                Abrir vídeo
                <ExternalLink className="size-3" />
              </a>
              <a
                href={srcFresh}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl bg-white/5 hover:bg-white/10 ring-1 ring-white/10 px-3 py-2 text-xs font-semibold text-zinc-200 backdrop-blur transition-colors"
              >
                Abrir (sem cache)
                <ExternalLink className="size-3" />
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VideosPage() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/videos");
        if (!res.ok) throw new Error();
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setVideos(data);
        } else {
          setVideos(LOCAL_FALLBACK_VIDEOS);
        }
      } catch {
        setVideos(LOCAL_FALLBACK_VIDEOS);
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
            const local = !embed && isLocalVideo(v.url);
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
                  ) : local ? (
                    <LocalVideoPlayer
                      key={v.id}
                      url={v.url}
                      title={v.title}
                    />
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
                    {!embed && !local && (
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
