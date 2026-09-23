import { NextResponse } from "next/server";
import { getArticles, addArticle } from "@/lib/article-storage";

export async function GET() {
  try {
    const articles = await getArticles();
    return NextResponse.json(articles);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro ao carregar artigos" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const article = await addArticle(body);
    return NextResponse.json(article);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro ao adicionar artigo" }, { status: 500 });
  }
}
