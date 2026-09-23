import { NextResponse } from "next/server";
import { deleteTraining } from "@/lib/training-storage";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await deleteTraining(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao excluir treinamento" },
      { status: 500 },
    );
  }
}
