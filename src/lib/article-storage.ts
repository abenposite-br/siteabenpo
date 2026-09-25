import { db } from "./firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  setDoc,
  getDoc,
  orderBy,
  query,
  serverTimestamp,
  type QueryDocumentSnapshot,
  type DocumentData,
} from "firebase/firestore";
import type { Article } from "./article-utils";

const COLLECTION_NAME = "articles";

export const INITIAL_ARTICLES: Array<Omit<Article, "id" | "createdAt"> & { createdAt?: string }> = [
  {
    title:
      "The use of the pressure ulcer scale for healing in the evaluation of the healing process of the pressure injury / O uso do pressure ulcer scale for healing na avaliação do processo de cicatrização da lesão por pressão",
    url: "https://seer.unirio.br/cuidadofundamental/article/view/10867",
  },
  {
    title:
      "Implementation of the nursing service in podiatria clinic in public outpatient health unit",
    url: "https://rsdjournal.org/index.php/rsd/article/view/15359",
  },
  {
    title:
      "Low-level laser therapy: Characteristics of clients treated at the Clinical Podiatrics servisse",
    url: "https://rsdjournal.org/index.php/rsd/article/view/14099",
  },
  {
    title:
      "The use of low-level laser therapy in nursing practice: an integrative review",
    url: "https://rsdjournal.org/index.php/rsd/article/view/22325",
  },
  {
    title:
      "Laserterapia e tratamento medicamentoso tópico na onicomicose em pessoas com diabetes: série de casos",
    url: "https://periodicos.ufsm.br/reufsm/article/view/74448",
  },
];

function stableArticleId(url: string, title: string): string {
  const seed = `${url.trim().toLowerCase()}||${title.trim().toLowerCase()}`;
  let h1 = 0x811c9dc5;
  let h2 = 0xdeadbeef;
  for (let i = 0; i < seed.length; i++) {
    const ch = seed.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 0x01000193);
    h2 = Math.imul(h2 ^ ch, 0x85ebca6b);
  }
  h1 = (h1 ^ (h1 >>> 16)) >>> 0;
  h2 = (h2 ^ (h2 >>> 13)) >>> 0;
  return `art_${h1.toString(36)}${h2.toString(36)}`;
}

function normalizeCreatedAt(raw: unknown): string {
  if (!raw) return new Date().toISOString();
  if (typeof raw === "string") {
    const d = new Date(raw);
    if (!Number.isNaN(d.getTime())) return d.toISOString();
  }
  if (
    raw &&
    typeof raw === "object" &&
    "toDate" in raw &&
    typeof (raw as { toDate: () => Date }).toDate === "function"
  ) {
    const d = (raw as { toDate: () => Date }).toDate();
    if (!Number.isNaN(d.getTime())) return d.toISOString();
  }
  if (raw instanceof Date) {
    if (!Number.isNaN(raw.getTime())) return raw.toISOString();
  }
  return new Date().toISOString();
}

function mapDoc(d: QueryDocumentSnapshot<DocumentData>): Article {
  const data = d.data();
  return {
    id: d.id,
    title: typeof data.title === "string" ? data.title : "",
    url: typeof data.url === "string" ? data.url : "",
    image: typeof data.image === "string" ? data.image : undefined,
    description:
      typeof data.description === "string" ? data.description : undefined,
    createdAt: normalizeCreatedAt(data.createdAt),
  };
}

export function withFallbackArticles(list: typeof INITIAL_ARTICLES): Article[] {
  return list.map((a, idx) => ({
    id: stableArticleId(a.url, a.title) + `_fb_${idx}`,
    title: a.title,
    url: a.url,
    image: (a as { image?: string }).image,
    description: (a as { description?: string }).description,
    createdAt: a.createdAt ?? new Date(Date.now() - idx * 86400000).toISOString(),
  }));
}

export async function getArticles(): Promise<Article[]> {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      orderBy("createdAt", "desc"),
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      for (const article of INITIAL_ARTICLES) {
        try {
          const stableId = stableArticleId(article.url, article.title);
          const ref = doc(db, COLLECTION_NAME, stableId);
          const existing = await getDoc(ref);
          if (!existing.exists()) {
            await setDoc(ref, {
              title: article.title,
              url: article.url,
              ...(article.description ? { description: article.description } : {}),
              ...((article as { image?: string }).image
                ? { image: (article as { image: string }).image }
                : {}),
              createdAt: serverTimestamp(),
            });
          }
        } catch (e) {
          console.warn("Não foi possível adicionar artigo inicial:", e);
        }
      }
      try {
        const newSnapshot = await getDocs(q);
        if (!newSnapshot.empty) {
          return dedupeAndSort(newSnapshot.docs.map(mapDoc));
        }
      } catch (e) {
        console.warn(
          "Não foi possível reler artigos do Firestore após seed:",
          e,
        );
      }
      return dedupeAndSort(withFallbackArticles(INITIAL_ARTICLES));
    }

    return dedupeAndSort(querySnapshot.docs.map(mapDoc));
  } catch (err) {
    console.error("Erro ao ler artigos do Firestore (usando fallback local):", err);
    return dedupeAndSort(withFallbackArticles(INITIAL_ARTICLES));
  }
}

function normalizeUrl(url: string): string {
  try {
    const u = new URL(url.trim().toLowerCase());
    const path = u.pathname.replace(/\/+$/, "");
    return `${u.hostname}${path}${u.search}`;
  } catch {
    return url.trim().toLowerCase().replace(/\/+$/, "");
  }
}

function normalizeTitle(title: string): string {
  return title
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function dedupeAndSort(list: Article[]): Article[] {
  const seenByUrl = new Map<string, Article>();
  const seenByTitle = new Map<string, Article>();
  const finalSet = new Map<string, Article>();

  const pickNewer = (a: Article, b: Article): Article => {
    const ta = new Date(a.createdAt).getTime() || 0;
    const tb = new Date(b.createdAt).getTime() || 0;
    return tb > ta ? b : a;
  };

  for (const item of list) {
    const idKey = item.id;
    const normUrl = item.url ? normalizeUrl(item.url) : "";
    const normTitle = normalizeTitle(item.title);

    let existing: Article | undefined;

    if (normUrl && seenByUrl.has(normUrl)) {
      existing = seenByUrl.get(normUrl);
    } else if (normTitle && seenByTitle.has(normTitle)) {
      existing = seenByTitle.get(normTitle);
    } else if (finalSet.has(idKey)) {
      existing = finalSet.get(idKey);
    }

    if (existing) {
      const chosen = pickNewer(existing, item);
      if (chosen.id !== existing.id) {
        if (normUrl) seenByUrl.set(normUrl, chosen);
        if (normTitle) seenByTitle.set(normTitle, chosen);
        finalSet.set(chosen.id, chosen);
        if (chosen.id !== existing.id) {
          finalSet.delete(existing.id);
        }
      }
    } else {
      if (normUrl) seenByUrl.set(normUrl, item);
      if (normTitle) seenByTitle.set(normTitle, item);
      finalSet.set(idKey, item);
    }
  }

  const arr = Array.from(finalSet.values());
  arr.sort((a, b) => {
    const ta = new Date(a.createdAt).getTime() || 0;
    const tb = new Date(b.createdAt).getTime() || 0;
    if (tb !== ta) return tb - ta;
    return a.title.localeCompare(b.title, "pt-BR");
  });
  return arr;
}

export async function addArticle(
  article: Omit<Article, "id" | "createdAt">,
): Promise<Article> {
  const stableId = stableArticleId(article.url, article.title);
  const ref = doc(db, COLLECTION_NAME, stableId);
  const existing = await getDoc(ref);
  if (existing.exists()) {
    return mapDoc(existing as QueryDocumentSnapshot<DocumentData>);
  }
  await setDoc(ref, {
    ...article,
    createdAt: serverTimestamp(),
  });
  const fresh = await getDoc(ref);
  if (fresh.exists()) {
    return mapDoc(fresh as QueryDocumentSnapshot<DocumentData>);
  }
  return {
    ...article,
    id: stableId,
    createdAt: new Date().toISOString(),
  };
}

export async function deleteArticle(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION_NAME, id));
}

export async function deduplicateCollection(): Promise<{
  removed: number;
  kept: number;
  idsRemoved: string[];
}> {
  const q = query(collection(db, COLLECTION_NAME));
  const snap = await getDocs(q);
  const all = snap.docs.map(mapDoc);

  const byUrl = new Map<string, Article[]>();
  const byTitle = new Map<string, Article[]>();

  for (const a of all) {
    const urlKey = a.url ? normalizeUrl(a.url) : "";
    const titleKey = normalizeTitle(a.title);

    if (urlKey) {
      const arr = byUrl.get(urlKey) ?? [];
      arr.push(a);
      byUrl.set(urlKey, arr);
    }
    if (titleKey) {
      const arr = byTitle.get(titleKey) ?? [];
      arr.push(a);
      byTitle.set(titleKey, arr);
    }
  }

  const parent = new Map<string, string>();
  for (const a of all) parent.set(a.id, a.id);

  const find = (x: string): string => {
    if (parent.get(x) !== x) parent.set(x, find(parent.get(x) || x));
    return parent.get(x) || x;
  };
  const union = (a: string, b: string) => {
    const ra = find(a);
    const rb = find(b);
    if (ra !== rb) parent.set(ra, rb);
  };

  for (const group of byUrl.values()) {
    for (let i = 1; i < group.length; i++) union(group[0].id, group[i].id);
  }
  for (const group of byTitle.values()) {
    for (let i = 1; i < group.length; i++) union(group[0].id, group[i].id);
  }

  const clusters = new Map<string, Article[]>();
  for (const a of all) {
    const root = find(a.id);
    const arr = clusters.get(root) ?? [];
    arr.push(a);
    clusters.set(root, arr);
  }

  const toRemove: string[] = [];
  let keptCount = 0;
  for (const group of clusters.values()) {
    if (group.length <= 1) {
      keptCount += group.length;
      continue;
    }
    const sorted = [...group].sort((a, b) => {
      const ta = new Date(a.createdAt).getTime() || 0;
      const tb = new Date(b.createdAt).getTime() || 0;
      return tb - ta;
    });
    keptCount += 1;
    for (let i = 1; i < sorted.length; i++) {
      toRemove.push(sorted[i].id);
    }
  }

  for (const id of toRemove) {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (e) {
      console.warn(`Não foi possível remover duplicata ${id}:`, e);
    }
  }
  return { removed: toRemove.length, kept: keptCount, idsRemoved: toRemove };
}
