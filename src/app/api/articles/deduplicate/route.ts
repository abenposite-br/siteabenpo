import { NextResponse } from "next/server";
import { deduplicateCollection } from "@/lib/article-storage";

export async function POST() {
  try {
    const result = await deduplicateCollection();
    return NextResponse.json({
      success: true,
      message: `Deduplicação concluída: ${result.removed} duplicatas removidas, ${result.kept} artigos mantidos.`,
      removed: result.removed,
      kept: result.kept,
      idsRemoved: result.idsRemoved,
    });
  } catch (error) {
    console.error("Erro na deduplicação:", error);
    return NextResponse.json(
      { success: false, error: "Erro ao executar deduplicação" },
      { status: 500 },
    );
  }
}
