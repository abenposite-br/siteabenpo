import { NextResponse } from "next/server";
import { getVideos, addVideo } from "@/lib/video-storage";

export async function GET() {
  try {
    const videos = await getVideos();
    return NextResponse.json(videos);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao carregar vídeos" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, url } = body;
    if (!title || !url) {
      return NextResponse.json(
        { error: "Título e URL são obrigatórios" },
        { status: 400 },
      );
    }
    const video = await addVideo({
      title,
      description: description ?? "",
      url,
    });
    return NextResponse.json(video);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao adicionar vídeo" },
      { status: 500 },
    );
  }
}
