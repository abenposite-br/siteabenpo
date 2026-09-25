import { NextRequest } from "next/server";
import fs from "node:fs";
import path from "node:path";

const PUBLIC_DIR = path.join(process.cwd(), "public");
const VIDEOS_DIR = path.join(PUBLIC_DIR, "videos");

const VIDEO_MIME: Record<string, string> = {
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".ogv": "video/ogg",
  ".ogg": "video/ogg",
  ".mov": "video/quicktime",
  ".mkv": "video/x-matroska",
};

function sanitizeFileName(name: string): string {
  const raw = decodeURIComponent(name);
  const base = path.basename(raw);
  if (base !== raw || base.includes("..")) {
    throw new Error("Invalid file name");
  }
  return base;
}

type CacheEntry = { buffer: Buffer; copy: Uint8Array; stat: fs.Stats };
const fileCache = new Map<string, CacheEntry>();

function readVideoFile(filePath: string, key: string): CacheEntry {
  const cached = fileCache.get(key);
  if (cached) return cached;
  const stat = fs.statSync(filePath);
  const buffer = fs.readFileSync(filePath);
  const copy = new Uint8Array(buffer.length);
  copy.set(buffer);
  const entry: CacheEntry = { buffer, copy, stat };
  fileCache.set(key, entry);
  return entry;
}

export async function GET(request: NextRequest) {
  try {
    const search = request.nextUrl.searchParams;
    const fileParam = search.get("f") ?? search.get("file");
    if (!fileParam) {
      return Response.json(
        { error: "Parâmetro 'f' é obrigatório" },
        { status: 400 },
      );
    }

    const fileName = sanitizeFileName(fileParam);
    const filePath = path.join(VIDEOS_DIR, fileName);
    const ext = path.extname(fileName).toLowerCase();

    if (!fs.existsSync(filePath)) {
      return Response.json(
        { error: "Arquivo não encontrado", path: `/public/videos/${fileName}` },
        { status: 404 },
      );
    }

    const { copy, stat } = readVideoFile(filePath, fileName);
    const fileSize = stat.size;
    const mimeType = VIDEO_MIME[ext] ?? "video/mp4";
    const rangeHeader = request.headers.get("range");

    const commonHeaders = {
      "Content-Type": mimeType,
      "Accept-Ranges": "bytes",
      "X-Content-Type-Options": "nosniff",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
      "Access-Control-Expose-Headers":
        "Content-Range, Accept-Ranges, Content-Length, Content-Type",
      "Cache-Control": "public, max-age=31536000, immutable",
      "Last-Modified": stat.mtime.toUTCString(),
    } as const;

    if (!rangeHeader) {
      return new Response(
        new Blob([copy as unknown as BlobPart], { type: mimeType }),
        {
          status: 200,
          headers: {
            ...commonHeaders,
            "Content-Length": String(fileSize),
          },
        },
      );
    }

    const parts = rangeHeader.replace(/bytes=/, "").split("-");
    const startRaw = parts[0];
    const endRaw = parts[1];
    const start = startRaw ? parseInt(startRaw, 10) : 0;
    const end = endRaw ? parseInt(endRaw, 10) : fileSize - 1;
    const clampedEnd = Math.min(end, fileSize - 1);

    if (start >= fileSize || clampedEnd < start) {
      return new Response(null, {
        status: 416,
        headers: {
          ...commonHeaders,
          "Content-Range": `bytes */${fileSize}`,
        },
      });
    }

    const chunk = copy.subarray(start, clampedEnd + 1);
    const chunkSize = clampedEnd - start + 1;
    return new Response(
      new Blob([chunk as unknown as BlobPart], { type: mimeType }),
      {
        status: 206,
        headers: {
          ...commonHeaders,
          "Content-Length": String(chunkSize),
          "Content-Range": `bytes ${start}-${clampedEnd}/${fileSize}`,
        },
      },
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return Response.json(
      { error: "Erro interno ao servir vídeo", detail: msg },
      { status: 500 },
    );
  }
}

export const revalidate = 31536000;
export const dynamic = "force-static";
