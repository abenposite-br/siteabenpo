import { NextResponse } from "next/server";
import {
  deleteAssociate,
  updateAssociateStatus,
} from "@/lib/associate-storage";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { active } = body;
    if (typeof active !== "boolean") {
      return NextResponse.json(
        { error: "Campo 'active' booleano é obrigatório" },
        { status: 400 },
      );
    }
    await updateAssociateStatus(id, active);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao atualizar status do associado" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await deleteAssociate(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao excluir associado" },
      { status: 500 },
    );
  }
}
