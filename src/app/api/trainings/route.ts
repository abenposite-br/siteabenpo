import { NextResponse } from "next/server";
import { getTrainings, addTraining } from "@/lib/training-storage";

export async function GET() {
  try {
    const trainings = await getTrainings();
    return NextResponse.json(trainings);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao carregar treinamentos" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, fileUrl, videoUrl } = body;
    if (!title || !fileUrl) {
      return NextResponse.json(
        { error: "Título e URL do arquivo são obrigatórios" },
        { status: 400 },
      );
    }
    const training = await addTraining({
      title,
      description: description ?? "",
      fileUrl,
      videoUrl: videoUrl ?? "",
    });
    return NextResponse.json(training);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao adicionar treinamento" },
      { status: 500 },
    );
  }
}
