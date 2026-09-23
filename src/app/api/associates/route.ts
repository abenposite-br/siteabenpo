import { NextResponse } from "next/server";
import {
  getAssociates,
  addAssociate,
  getAssociateByEmail,
} from "@/lib/associate-storage";

export async function GET() {
  try {
    const associates = await getAssociates();
    return NextResponse.json(associates);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao carregar associados" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, email, password, active } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Nome, email e senha são obrigatórios" },
        { status: 400 },
      );
    }

    const existing = await getAssociateByEmail(email);
    if (existing) {
      return NextResponse.json(
        { error: "Este e-mail já está cadastrado" },
        { status: 400 },
      );
    }

    const associate = await addAssociate({
      name,
      phone: phone ?? "",
      email,
      password,
      active: active ?? true,
    });
    return NextResponse.json(associate);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao adicionar associado" },
      { status: 500 },
    );
  }
}
