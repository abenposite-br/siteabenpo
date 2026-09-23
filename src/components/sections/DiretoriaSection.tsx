"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { DiretoriaImage } from "@/lib/diretoria-images";
import { DiretoriaCard } from "@/components/sections/DiretoriaCard";
import { DiretoriaLightbox } from "@/components/sections/DiretoriaLightbox";

const gridContainerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
};

type DiretoriaSectionProps = {
  images: DiretoriaImage[];
};

export function DiretoriaSection({ images }: DiretoriaSectionProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section
      id="diretoria"
      className="section-spacing section-alt relative overflow-hidden"
    >
      <div className="bg-blobs" aria-hidden="true">
        <div className="bg-blobs__blob -top-40 left-[10%] h-[28rem] w-[28rem]" style={{ backgroundColor: "rgba(16, 185, 129, 0.25)" }} />
        <div className="bg-blobs__blob -bottom-32 right-[5%] h-80 w-80" style={{ backgroundColor: "rgba(20, 184, 166, 0.20)" }} />
        <div className="bg-blobs__blob top-1/2 left-1/2 h-64 w-[40rem] -translate-x-1/2 -translate-y-1/2" style={{ backgroundColor: "rgba(52, 211, 153, 0.18)" }} />
      </div>

      <div className="section-container relative">
        <motion.header
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="section-header"
        >
          <p className="section-eyebrow">Institucional</p>
          <span className="section-divider section-divider--center" />
          <h2 className="section-title">
            Diretoria
          </h2>
          <p className="section-subtitle">
            Conheça os profissionais que compõem a Diretoria da Associação
            Brasileira de Enfermagem em Podiatria Clínica.
          </p>
        </motion.header>

        <motion.div
          variants={gridContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 gap-6 sm:mt-16 md:grid-cols-2 md:gap-6 lg:grid-cols-3 lg:mt-20 xl:grid-cols-4 mt-14"
        >
          {images.map((image, index) => (
            <DiretoriaCard
              key={image.id}
              {...image}
              index={index}
              onSelect={() => setActiveIndex(index)}
            />
          ))}
        </motion.div>
      </div>

      <DiretoriaLightbox
        images={images}
        activeIndex={activeIndex}
        onClose={() => setActiveIndex(null)}
        onNavigate={setActiveIndex}
      />
    </section>
  );
}
