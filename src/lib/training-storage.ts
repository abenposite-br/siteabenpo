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
import type { Training } from "./training-utils";

const COLLECTION_NAME = "trainings";

export async function getTrainings(): Promise<Training[]> {
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
        fileUrl: data.fileUrl ?? "",
        videoUrl: data.videoUrl ?? "",
        createdAt:
          data.createdAt?.toDate?.()?.toISOString() ??
          data.createdAt ??
          new Date().toISOString(),
      } as Training;
    });
  } catch (err) {
    console.error("Erro ao ler treinamentos do Firestore:", err);
    return [];
  }
}

export async function addTraining(
  training: Omit<Training, "id" | "createdAt">,
): Promise<Training> {
  const docRef = await addDoc(collection(db, COLLECTION_NAME), {
    ...training,
    createdAt: serverTimestamp(),
  });
  return {
    ...training,
    id: docRef.id,
    createdAt: new Date().toISOString(),
  };
}

export async function deleteTraining(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION_NAME, id));
}
