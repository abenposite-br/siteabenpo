"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { DiretoriaImage } from "@/lib/diretoria-images";

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" as const },
  },
};

type DiretoriaCardProps = DiretoriaImage & {
  index: number;
  onSelect: () => void;
};

export function DiretoriaCard({ src, index, onSelect, alt }: DiretoriaCardProps) {
  const isEager = index < 4;

  return (
    <motion.article variants={cardVariants}>
      <button
        type="button"
        onClick={onSelect}
        aria-label="Ampliar imagem em tela cheia"
        className="group w-full cursor-zoom-in overflow-hidden card-institutional p-0 !rounded-[20px] text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
      >
        <div className="relative aspect-[3/4] w-full overflow-hidden">
          <Image
            src={src}
            alt={alt ?? "Foto da diretoria"}
            fill
            sizes="(min-width: 1280px) 320px, (min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.04]"
            loading={isEager ? "eager" : "lazy"}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/70 via-emerald-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-white">
              <svg viewBox="0 0 24 24" fill="none" className="size-4">
                <path d="M21 21l-4.35-4.35M11 6v10M6 11h10M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Ampliar imagem
            </span>
          </div>
        </div>
      </button>
    </motion.article>
  );
}
