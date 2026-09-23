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
  updateDoc,
  where,
  getDoc,
} from "firebase/firestore";
import type { Associate } from "./associate-utils";

const COLLECTION_NAME = "associates";

export async function getAssociates(): Promise<Associate[]> {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      orderBy("createdAt", "desc"),
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name ?? "",
        phone: data.phone ?? "",
        email: data.email ?? "",
        password: data.password ?? "",
        active: data.active ?? true,
        createdAt:
          data.createdAt?.toDate?.()?.toISOString() ??
          data.createdAt ??
          new Date().toISOString(),
      } as Associate;
    });
  } catch (err) {
    console.error("Erro ao ler associados do Firestore:", err);
    return [];
  }
}

export async function getAssociateByEmail(
  email: string,
): Promise<Associate | null> {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where("email", "==", email.toLowerCase()),
    );
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return null;
    const doc = querySnapshot.docs[0];
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name ?? "",
      phone: data.phone ?? "",
      email: data.email ?? "",
      password: data.password ?? "",
      active: data.active ?? true,
      createdAt:
        data.createdAt?.toDate?.()?.toISOString() ??
        data.createdAt ??
        new Date().toISOString(),
    } as Associate;
  } catch (err) {
    console.error("Erro ao buscar associado por email:", err);
    return null;
  }
}

export async function addAssociate(
  associate: Omit<Associate, "id" | "createdAt" | "active"> & {
    active?: boolean;
  },
): Promise<Associate> {
  const docRef = await addDoc(collection(db, COLLECTION_NAME), {
    name: associate.name,
    phone: associate.phone,
    email: associate.email.toLowerCase(),
    password: associate.password,
    active: associate.active ?? true,
    createdAt: serverTimestamp(),
  });

  return {
    id: docRef.id,
    name: associate.name,
    phone: associate.phone,
    email: associate.email.toLowerCase(),
    password: associate.password,
    active: associate.active ?? true,
    createdAt: new Date().toISOString(),
  };
}

export async function deleteAssociate(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION_NAME, id));
}

export async function updateAssociateStatus(
  id: string,
  active: boolean,
): Promise<void> {
  const ref = doc(db, COLLECTION_NAME, id);
  await updateDoc(ref, { active });
}

export async function getAssociateById(
  id: string,
): Promise<Associate | null> {
  try {
    const snap = await getDoc(doc(db, COLLECTION_NAME, id));
    if (!snap.exists()) return null;
    const data = snap.data();
    return {
      id: snap.id,
      name: data.name ?? "",
      phone: data.phone ?? "",
      email: data.email ?? "",
      password: data.password ?? "",
      active: data.active ?? true,
      createdAt:
        data.createdAt?.toDate?.()?.toISOString() ??
        data.createdAt ??
        new Date().toISOString(),
    } as Associate;
  } catch (err) {
    console.error("Erro ao buscar associado por id:", err);
    return null;
  }
}
