import { db } from "./firebase";
import { collection, getDocs, addDoc, deleteDoc, doc, orderBy, query, serverTimestamp } from "firebase/firestore";

export type Lead = {
  id: string;
  nome: string;
  email: string;
  whatsapp: string;
  interesse: string;
  createdAt: string;
};

const COLLECTION_NAME = "leads";

export async function getLeads(): Promise<Lead[]> {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        nome: data.nome ?? "",
        email: data.email ?? "",
        whatsapp: data.whatsapp ?? "",
        interesse: data.interesse ?? "",
        createdAt:
          typeof data.createdAt?.toDate === "function"
            ? data.createdAt.toDate().toISOString()
            : data.createdAt ?? new Date().toISOString(),
      };
    });
  } catch (err) {
    console.error("Erro ao ler leads do Firestore:", err);
    return [];
  }
}

export async function saveLead(
  input: Omit<Lead, "id" | "createdAt">,
): Promise<Lead> {
  const docRef = await addDoc(collection(db, COLLECTION_NAME), {
    ...input,
    createdAt: serverTimestamp(),
  });

  return {
    ...input,
    id: docRef.id,
    createdAt: new Date().toISOString(),
  };
}

export async function deleteLead(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION_NAME, id));
}
