"use client";

import { useCallback, useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { DiretoriaImage } from "@/lib/diretoria-images";

type DiretoriaLightboxProps = {
  images: DiretoriaImage[];
  activeIndex: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
};

export function DiretoriaLightbox({
  images,
  activeIndex,
  onClose,
  onNavigate,
}: DiretoriaLightboxProps) {
  const isOpen = activeIndex !== null;
  const activeImage = isOpen ? images[activeIndex] : null;
  const hasPrev = isOpen && activeIndex > 0;
  const hasNext = isOpen && activeIndex < images.length - 1;

  const goPrev = useCallback(() => {
    if (hasPrev) onNavigate(activeIndex - 1);
  }, [activeIndex, hasPrev, onNavigate]);

  const goNext = useCallback(() => {
    if (hasNext) onNavigate(activeIndex + 1);
  }, [activeIndex, hasNext, onNavigate]);

  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") goPrev();
      if (event.key === "ArrowRight") goNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, goPrev, goNext]);

  return (
    <AnimatePresence>
      {isOpen && activeImage ? (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Visualização em tela cheia"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/90 p-4 backdrop-blur-sm sm:p-6"
          onClick={onClose}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar visualização"
            className="absolute right-4 top-4 z-10 inline-flex size-11 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/20 transition-colors duration-300 hover:bg-white/20 sm:right-6 sm:top-6"
          >
            <X className="size-5" strokeWidth={2} />
          </button>

          {hasPrev ? (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                goPrev();
              }}
              aria-label="Imagem anterior"
              className="absolute left-2 top-1/2 z-10 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/20 transition-colors duration-300 hover:bg-white/20 sm:left-6"
            >
              <ChevronLeft className="size-6" strokeWidth={2} />
            </button>
          ) : null}

          {hasNext ? (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                goNext();
              }}
              aria-label="Próxima imagem"
              className="absolute right-2 top-1/2 z-10 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/20 transition-colors duration-300 hover:bg-white/20 sm:right-6"
            >
              <ChevronRight className="size-6" strokeWidth={2} />
            </button>
          ) : null}

          <motion.div
            key={activeImage.id}
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex max-h-full max-w-full items-center justify-center"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={activeImage.src}
              alt=""
              width={activeImage.src.width}
              height={activeImage.src.height}
              className="max-h-[90dvh] max-w-[min(90vw,640px)] w-auto rounded-2xl object-contain shadow-[0_24px_80px_rgba(0,0,0,0.45)]"
              priority
            />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
