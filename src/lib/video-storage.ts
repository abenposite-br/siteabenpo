import { db } from "./firebase";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  orderBy,
  query,
  serverTimestamp,
  type QueryDocumentSnapshot,
  type DocumentData,
} from "firebase/firestore";
import type { Video } from "./video-utils";

const COLLECTION_NAME = "videos";

const INITIAL_VIDEOS: Array<Omit<Video, "id" | "createdAt"> & { createdAt?: string }> = [
  {
    title: "Vídeo Institucional ABENPO",
    description:
      "Apresentação da Associação Brasileira de Enfermagem em Podiatria Clínica — sua missão, valores, atividades e benefícios para os associados.",
    url: "/videos/abenpo-video.mp4",
  },
];

function withFallbackIds(list: typeof INITIAL_VIDEOS): Video[] {
  const now = new Date().toISOString();
  return list.map((v, idx) => ({
    id: `video_fallback_${idx + 1}`,
    title: v.title,
    description: v.description ?? "",
    url: v.url,
    createdAt: v.createdAt ?? now,
  }));
}

function mapDocs(docs: QueryDocumentSnapshot<DocumentData>[]): Video[] {
  return docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      title: data.title ?? "",
      description: data.description ?? "",
      url: data.url ?? "",
      createdAt:
        data.createdAt?.toDate?.()?.toISOString() ??
        data.createdAt ??
        new Date().toISOString(),
    } as Video;
  });
}

export async function getVideos(): Promise<Video[]> {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      orderBy("createdAt", "desc"),
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      for (const video of INITIAL_VIDEOS) {
        try {
          await addVideo(video);
        } catch (e) {
          console.warn("Não foi possível adicionar vídeo inicial no Firestore:", e);
        }
      }
      try {
        const newSnapshot = await getDocs(q);
        if (!newSnapshot.empty) return mapDocs(newSnapshot.docs);
      } catch (e) {
        console.warn("Não foi possível reler vídeos do Firestore após seed:", e);
      }
      return withFallbackIds(INITIAL_VIDEOS);
    }

    return mapDocs(querySnapshot.docs);
  } catch (err) {
    console.error("Erro ao ler vídeos do Firestore (usando fallback local):", err);
    return withFallbackIds(INITIAL_VIDEOS);
  }
}

export async function addVideo(
  video: Omit<Video, "id" | "createdAt">,
): Promise<Video> {
  const docRef = await addDoc(collection(db, COLLECTION_NAME), {
    ...video,
    createdAt: serverTimestamp(),
  });
  return {
    ...video,
    id: docRef.id,
    createdAt: new Date().toISOString(),
  };
}

export async function deleteVideo(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION_NAME, id));
}
