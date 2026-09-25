"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Video,
  ExternalLink,
  Play,
  Search,
  X,
  Film,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Info,
  RefreshCw,
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

type ProbeResult = {
  url: string;
  label: string;
  status: number | null;
  contentType: string | null;
  contentLength: number | null;
  ok: boolean;
  durationMs: number;
  error?: string;
};

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

function extractVideoFileName(url: string): string | null {
  try {
    const withoutQuery = url.split("?")[0];
    const lastSlash = withoutQuery.lastIndexOf("/");
    const name = lastSlash >= 0 ? withoutQuery.slice(lastSlash + 1) : withoutQuery;
    return name || null;
  } catch {
    return null;
  }
}

function detectVideoType(url: string): string {
  const u = url.toLowerCase().split("?")[0];
  if (u.endsWith(".webm")) return "video/webm";
  if (u.endsWith(".ogv") || u.endsWith(".ogg")) return "video/ogg";
  if (u.endsWith(".mov")) return "video/quicktime";
  if (u.endsWith(".mkv")) return "video/x-matroska";
  return "video/mp4";
}

function buildCandidateSources(
  localUrl: string,
  origin: string | null,
  nonce: number,
): Array<{ url: string; label: string }> {
  const clean = localUrl.startsWith("./")
    ? localUrl.replace(/^\.\//, "/")
    : localUrl.startsWith("/")
      ? localUrl
      : `/${localUrl}`;

  const fileName = extractVideoFileName(clean) ?? "video.mp4";
  const cacheBuster = `v=${nonce}`;
  const sep = clean.includes("?") ? "&" : "?";

  const list: Array<{ url: string; label: string }> = [];

  list.push({ url: clean, label: "1. Estático /public" });
  list.push({
    url: `${clean}${sep}${cacheBuster}`,
    label: "2. Estático (sem cache)",
  });
  list.push({
    url: `/api/stream-video?f=${encodeURIComponent(fileName)}`,
    label: "3. API Stream-video",
  });
  list.push({
    url: `/api/stream-video?f=${encodeURIComponent(fileName)}&${cacheBuster}`,
    label: "4. API Stream-video (sem cache)",
  });
  if (origin) {
    list.push({
      url: `${origin.replace(/\/$/, "")}${clean}${sep}${cacheBuster}`,
      label: "5. URL absoluta (origin)",
    });
  }

  return list;
}

async function probeOne(
  url: string,
  label: string,
  signal: AbortSignal,
): Promise<ProbeResult> {
  const started = performance.now();
  try {
    const res = await fetch(url, {
      method: "HEAD",
      signal,
      cache: "no-store",
      mode: "cors",
      credentials: "same-origin",
      redirect: "follow",
    });
    const duration = performance.now() - started;
    const ct = res.headers.get("content-type");
    const len = res.headers.get("content-length");
    return {
      url,
      label,
      status: res.status,
      contentType: ct,
      contentLength: len ? parseInt(len, 10) : null,
      ok: res.ok,
      durationMs: duration,
    };
  } catch (e) {
    const duration = performance.now() - started;
    return {
      url,
      label,
      status: null,
      contentType: null,
      contentLength: null,
      ok: false,
      durationMs: duration,
      error: e instanceof Error ? e.message : String(e),
    };
  }
}

function pickBestSource(probes: ProbeResult[]): ProbeResult | null {
  const videoOrBinary = (ct: string | null) =>
    ct &&
    (ct.startsWith("video/") ||
      ct.startsWith("application/octet-stream") ||
      ct.startsWith("binary/octet-stream"));

  const working = probes
    .filter((p) => p.ok && (p.status === 200 || p.status === 206))
    .sort((a, b) => {
      const aVideo = videoOrBinary(a.contentType) ? 0 : 1;
      const bVideo = videoOrBinary(b.contentType) ? 0 : 1;
      if (aVideo !== bVideo) return aVideo - bVideo;
      const al = a.contentLength ?? 0;
      const bl = b.contentLength ?? 0;
      if (al > 1_000_000 && bl <= 1_000_000) return -1;
      if (bl > 1_000_000 && al <= 1_000_000) return 1;
      return 0;
    });

  return working[0] ?? null;
}

function mediaErrorCodeLabel(code: number) {
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
}

function LocalVideoPlayerInner({
  url,
  title,
}: {
  url: string;
  title?: string;
}) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [errorInfo, setErrorInfo] = useState<{ code: number; msg: string } | null>(null);
  const [probes, setProbes] = useState<ProbeResult[]>([]);
  const [probesLoading, setProbesLoading] = useState(true);
  const [bestUrl, setBestUrl] = useState<string | null>(null);
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const [baseNonce] = useState(() => Date.now());

  const candidates = useMemo(() => {
    const origin =
      typeof window !== "undefined" ? window.location.origin : null;
    return buildCandidateSources(url, origin, baseNonce);
  }, [url, baseNonce]);

  useEffect(() => {
    const ctrl = new AbortController();
    let mounted = true;

    (async () => {
      const results: ProbeResult[] = [];
      for (const cand of candidates) {
        if (ctrl.signal.aborted) break;
        const res = await probeOne(cand.url, cand.label, ctrl.signal);
        results.push(res);
        if (!mounted) return;
        setProbes(results.slice());
      }
      if (!mounted) return;
      const best = pickBestSource(results);
      setBestUrl(best ? best.url : candidates[0]?.url ?? null);
      setProbesLoading(false);
    })();

    return () => {
      mounted = false;
      ctrl.abort();
    };
  }, [candidates]);

  const mimeType = useMemo(
    () => detectVideoType(bestUrl ?? url),
    [bestUrl, url],
  );

  return (
    <div className="relative w-full bg-black group overflow-hidden rounded-none">
      <div className="relative w-full" style={{ aspectRatio: "16 / 9" }}>
        {probesLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black text-white z-10">
            <div className="size-10 rounded-full border-4 border-emerald-500/40 border-t-emerald-400 animate-spin mb-3" />
            <p className="text-xs text-zinc-300 mb-2">
              Detectando melhor fonte para streaming...
            </p>
            <div className="max-w-xs text-[10px] text-zinc-500 text-center font-mono break-all px-2">
              {probes[probes.length - 1]?.label ?? "iniciando probe..."}
            </div>
          </div>
        ) : bestUrl ? (
          <video
            controls
            playsInline
            preload="auto"
            autoPlay={false}
            muted={false}
            crossOrigin="anonymous"
            onLoadedData={() => {
              setIsLoaded(true);
              setHasError(false);
              setErrorInfo(null);
            }}
            onError={(e) => {
              const code = e.currentTarget.error?.code ?? 0;
              const detail = mediaErrorCodeLabel(code);
              console.error(
                "[VideoPlayer] Falha reprodução:",
                { bestUrl, code, detail, urlOriginal: url, probes },
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
              src={bestUrl}
              type={`${mimeType}; codecs="avc1.42E01E, mp4a.40.2"`}
            />
            <source
              src={bestUrl}
              type={`${mimeType}; codecs="avc1.640028, mp4a.40.2"`}
            />
            <source src={bestUrl} type={mimeType} />
            {candidates.slice(0, 3).map((c) => (
              <source key={c.url} src={c.url} type={mimeType} />
            ))}
            Seu navegador não suporta a reprodução de vídeos. Abra diretamente em{" "}
            <a
              href={bestUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-500 underline"
            >
              este link
            </a>
            .
          </video>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-black text-white z-10">
            <p className="text-xs text-zinc-400">Nenhuma fonte disponível</p>
          </div>
        )}

        {!isLoaded && !hasError && !probesLoading && bestUrl && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 text-white z-10 pointer-events-none">
            <div className="size-10 rounded-full border-4 border-emerald-500/40 border-t-emerald-400 animate-spin mb-3" />
            <p className="text-xs text-zinc-300">Carregando vídeo...</p>
          </div>
        )}

        {(hasError || (!probesLoading && !bestUrl)) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-zinc-950 via-zinc-900 to-emerald-950 text-white z-20 px-3 sm:px-4 text-center overflow-y-auto py-4">
            <Play className="size-12 sm:size-14 mb-2 sm:mb-3 text-white/60" />
            <h4 className="text-sm font-bold text-zinc-100 mb-1">
              Não foi possível reproduzir
            </h4>
            {errorInfo && (
              <p className="text-[10px] font-mono text-emerald-300/70 mb-2 max-w-xs truncate w-full">
                {errorInfo.msg}
              </p>
            )}
            {!bestUrl && (
              <p className="text-[10px] font-mono text-red-300/80 mb-2">
                Probe: nenhuma fonte retornou HTTP 200/206
              </p>
            )}
            <p className="text-xs text-zinc-400 mb-3 max-w-xs">
              Verifique o diagnóstico abaixo ou tente abrir diretamente.
            </p>

            <div className="flex gap-2 flex-wrap justify-center mb-3">
              {bestUrl && (
                <a
                  href={bestUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 hover:bg-white/15 ring-1 ring-white/20 px-3 py-2 text-xs font-bold text-white backdrop-blur transition-colors"
                >
                  Abrir vídeo
                  <ExternalLink className="size-3" />
                </a>
              )}
              <button
                type="button"
                onClick={() => setShowDiagnostics((v) => !v)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-white/5 hover:bg-white/10 ring-1 ring-white/10 px-3 py-2 text-xs font-semibold text-zinc-200 backdrop-blur transition-colors"
              >
                <Info className="size-3" />
                Diagnóstico
                {showDiagnostics ? (
                  <ChevronUp className="size-3" />
                ) : (
                  <ChevronDown className="size-3" />
                )}
              </button>
            </div>

            {showDiagnostics && (
              <div className="w-full max-w-md bg-black/60 ring-1 ring-white/10 rounded-xl p-2 text-left max-h-[38vh] overflow-y-auto backdrop-blur">
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-amber-300/90 font-bold mb-2 px-1">
                  <AlertTriangle className="size-3" />
                  Relatório de diagnóstico
                </div>
                <div className="space-y-1.5">
                  {probes.map((p) => (
                    <div
                      key={p.url}
                      className={`text-[10px] font-mono rounded-lg px-2 py-1.5 ring-1 ${
                        p.ok
                          ? "bg-emerald-950/40 ring-emerald-500/30"
                          : "bg-red-950/40 ring-red-500/30"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold truncate">{p.label}</span>
                        <span
                          className={`shrink-0 ${
                            p.ok ? "text-emerald-300" : "text-red-300"
                          }`}
                        >
                          {p.status ?? "ERR"} · {p.durationMs.toFixed(0)}ms
                        </span>
                      </div>
                      <div className="text-zinc-300/80 truncate">
                        CT: {p.contentType ?? "-"} · Len:{" "}
                        {p.contentLength != null
                          ? `${(p.contentLength / 1024 / 1024).toFixed(2)}MB`
                          : "-"}
                      </div>
                      <div className="text-zinc-400/70 break-all">{p.url}</div>
                      {p.error && (
                        <div className="text-red-300/80">!! {p.error}</div>
                      )}
                    </div>
                  ))}
                  {probes.length === 0 && (
                    <div className="text-[10px] font-mono text-zinc-400 px-1">
                      Nenhum probe executado.
                    </div>
                  )}
                </div>
                <div className="mt-2 pt-2 border-t border-white/10 text-[10px] font-mono text-zinc-400 px-1 space-y-0.5 break-all">
                  <div>
                    Título: <span className="text-zinc-200">{title ?? "-"}</span>
                  </div>
                  <div>
                    URL original: <span className="text-zinc-200">{url}</span>
                  </div>
                  <div>
                    Melhor URL:{" "}
                    <span className="text-zinc-200">{bestUrl ?? "nenhuma"}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function LocalVideoPlayer({
  url,
  title,
}: {
  url: string;
  title?: string;
}) {
  const [retryKey, setRetryKey] = useState(0);
  return (
    <div className="relative w-full">
      <LocalVideoPlayerInner
        key={`${retryKey}-${url}`}
        url={url}
        title={title}
      />
      <button
        type="button"
        onClick={() => setRetryKey((k) => k + 1)}
        className="absolute top-2 right-2 z-30 inline-flex items-center gap-1 rounded-lg bg-black/50 hover:bg-black/70 ring-1 ring-white/10 px-2 py-1 text-[10px] font-bold text-white backdrop-blur transition-colors"
      >
        <RefreshCw className="size-3" />
        Refazer probe
      </button>
    </div>
  );
}

export default function VideosPage() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await fetch("/api/videos", {
          cache: "no-store",
          headers: { Accept: "application/json" },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (mounted) {
          if (Array.isArray(data) && data.length > 0) {
            setVideos(data);
          } else {
            setVideos(LOCAL_FALLBACK_VIDEOS);
          }
        }
      } catch (e) {
        console.warn("[VideosPage] fallback:", e);
        if (mounted) setVideos(LOCAL_FALLBACK_VIDEOS);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
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
                    <div
                      className="relative w-full"
                      style={{ aspectRatio: "16 / 9" }}
                    >
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
                    <LocalVideoPlayer url={v.url} title={v.title} />
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
                        <Play
                          className="size-9 text-white ml-1"
                          fill="currentColor"
                        />
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
