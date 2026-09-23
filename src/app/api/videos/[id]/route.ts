import { NextResponse } from "next/server";
import { deleteVideo } from "@/lib/video-storage";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await deleteVideo(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao excluir vídeo" },
      { status: 500 },
    );
  }
}
