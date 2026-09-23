import type { StaticImageData } from "next/image";

// Import article images
import cofen from "@/img/events/cofen.jpeg";

export const ARTICLE_IMAGES: Record<string, StaticImageData> = {
  "cofen.jpeg": cofen,
};

export function getArticleImage(filename: string): StaticImageData | undefined {
  return ARTICLE_IMAGES[filename];
}

export function getAvailableArticleImages(): { filename: string; src: StaticImageData }[] {
  return Object.entries(ARTICLE_IMAGES).map(([filename, src]) => ({
    filename,
    src,
  }));
}
