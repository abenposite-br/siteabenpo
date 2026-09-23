import { db } from "./firebase";
import { collection, getDocs, addDoc, deleteDoc, doc, orderBy, query, serverTimestamp } from "firebase/firestore";
import type { Article } from "./article-utils";

const COLLECTION_NAME = "articles";

const INITIAL_ARTICLES = [
  {
    title: "The use of the pressure ulcer scale for healing in the evaluation of the healing process of the pressure injury / O uso do pressure ulcer scale for healing na avaliação do processo de cicatrização da lesão por pressão",
    url: "https://seer.unirio.br/cuidadofundamental/article/view/10867"
  },
  {
    title: "Implementation of the nursing service in podiatria clinic in public outpatient health unit",
    url: "https://rsdjournal.org/index.php/rsd/article/view/15359"
  },
  {
    title: "Low-level laser therapy: Characteristics of clients treated at the Clinical Podiatrics servisse",
    url: "https://rsdjournal.org/index.php/rsd/article/view/14099"
  },
  {
    title: "The use of low-level laser therapy in nursing practice: an integrative review",
    url: "https://rsdjournal.org/index.php/rsd/article/view/22325"
  },
  {
    title: "Laserterapia e tratamento medicamentoso tópico na onicomicose em pessoas com diabetes: série de casos",
    url: "https://periodicos.ufsm.br/reufsm/article/view/74448"
  }
];

export async function getArticles(): Promise<Article[]> {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      for (const article of INITIAL_ARTICLES) {
        try {
          await addArticle(article);
        } catch (e) {
          console.warn("Não foi possível adicionar artigo inicial:", e);
        }
      }
      const newSnapshot = await getDocs(q);
      return newSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as Article));
    }

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as Article));
  } catch (err) {
    console.error("Erro ao ler artigos do Firestore:", err);
    return [];
  }
}

export async function addArticle(article: Omit<Article, "id" | "createdAt">): Promise<Article> {
  const docRef = await addDoc(collection(db, COLLECTION_NAME), {
    ...article,
    createdAt: serverTimestamp(),
  });

  return {
    ...article,
    id: docRef.id,
    createdAt: new Date().toISOString(),
  };
}

export async function deleteArticle(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION_NAME, id));
}
