import { db } from "./firebase";
import { collection, getDocs, addDoc, deleteDoc, doc, orderBy, query, serverTimestamp } from "firebase/firestore";
import type { Event } from "./event-utils";

const COLLECTION_NAME = "events";

export async function getEvents(): Promise<Event[]> {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as Event));
  } catch (err) {
    console.error("Erro ao ler eventos do Firestore:", err);
    return [];
  }
}

export async function addEvent(event: Omit<Event, "id" | "createdAt">): Promise<Event> {
  const currentEvents = await getEvents();
  if (currentEvents.length >= 9) {
    throw new Error("Número máximo de 9 eventos atingido!");
  }

  const docRef = await addDoc(collection(db, COLLECTION_NAME), {
    ...event,
    createdAt: serverTimestamp(),
  });

  return {
    ...event,
    id: docRef.id,
    createdAt: new Date().toISOString(),
  };
}

export async function deleteEvent(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION_NAME, id));
}
