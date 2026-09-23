import { NextResponse } from "next/server";
import { deleteArticle } from "@/lib/article-storage";

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await deleteArticle(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro ao excluir artigo" }, { status: 500 });
  }
}
