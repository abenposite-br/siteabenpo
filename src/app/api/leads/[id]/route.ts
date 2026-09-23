import { NextResponse } from "next/server";
import { deleteLead } from "@/lib/lead-storage";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await deleteLead(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Erro ao excluir lead:", error);
    return NextResponse.json(
      { error: "Erro ao excluir lead" },
      { status: 500 },
    );
  }
}
