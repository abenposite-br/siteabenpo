import fs from "node:fs";
import path from "node:path";
import type { StaticImageData } from "next/image";

import alciony from "@/img/alciony.jpg";
import ariane from "@/img/ariane.jpg";
import eugenio from "@/img/eugenio.jpg";
import fernanda from "@/img/fernanda.jpg";
import francianeide from "@/img/francianeide.jpg";
import francisco from "@/img/francisco.jpg";
import juliano from "@/img/juliano.jpg";
import marcele from "@/img/marcele.jpg";
import patricia from "@/img/patricia.jpeg";
import ricardo from "@/img/ricardo.jpg";
import rosangela from "@/img/Rosangela.jpg";
import suely from "@/img/suely.jpg";

export type DiretoriaImage = {
  id: string;
  src: StaticImageData;
  alt?: string;
};

const EXCLUDED_FILES = new Set(["logo.jpeg", "mascote.jpeg"]);

const IMAGE_IMPORTS: Record<string, StaticImageData> = {
  "alciony.jpg": alciony,
  "ariane.jpg": ariane,
  "eugenio.jpg": eugenio,
  "fernanda.jpg": fernanda,
  "francianeide.jpg": francianeide,
  "francisco.jpg": francisco,
  "juliano.jpg": juliano,
  "marcele.jpg": marcele,
  "patricia.jpeg": patricia,
  "ricardo.jpg": ricardo,
  "Rosangela.jpg": rosangela,
  "suely.jpg": suely,
};

const ORDERED_NAMES = [
  "eugenio",
  "suely",
  "patricia",
  "marcele",
  "francianeide",
  "ariane",
  "alciony",
  "juliano",
  "fernanda",
  "ricardo",
  "francisco",
  "rosangela",
];

export function getDiretoriaImages(): DiretoriaImage[] {
  const imgDir = path.join(process.cwd(), "src", "img");
  const allFiles = fs
    .readdirSync(imgDir)
    .filter((file) => /\.(jpe?g|png|webp|gif)$/i.test(file))
    .filter((file) => !EXCLUDED_FILES.has(file.toLowerCase()));

  const imageMap = new Map<string, StaticImageData>();
  for (const filename of allFiles) {
    const src = IMAGE_IMPORTS[filename];
    if (src) {
      const name = path.parse(filename).name.toLowerCase();
      imageMap.set(name, src);
    }
  }

  return ORDERED_NAMES.flatMap((name) => {
    const src = imageMap.get(name);
    if (!src) return [];

    return [
      {
        id: name,
        src,
      },
    ];
  });
}
