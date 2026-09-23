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
} from "firebase/firestore";
import type { Video } from "./video-utils";

const COLLECTION_NAME = "videos";

export async function getVideos(): Promise<Video[]> {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      orderBy("createdAt", "desc"),
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((d) => {
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
  } catch (err) {
    console.error("Erro ao ler vídeos do Firestore:", err);
    return [];
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
