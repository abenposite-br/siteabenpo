import { NextResponse } from "next/server";
import { getAssociateByEmail } from "@/lib/associate-storage";
import type { AssociatePublic } from "@/lib/associate-utils";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email e senha são obrigatórios" },
        { status: 400 },
      );
    }

    const associate = await getAssociateByEmail(email);
    if (!associate) {
      return NextResponse.json(
        { error: "Credenciais inválidas" },
        { status: 401 },
      );
    }

    if (associate.password !== password) {
      return NextResponse.json(
        { error: "Credenciais inválidas" },
        { status: 401 },
      );
    }

    if (!associate.active) {
      return NextResponse.json(
        {
          error:
            "Conta inativa ou aguardando aprovação do administrador. Entre em contato com a ABENPO.",
        },
        { status: 403 },
      );
    }

    const publicData: AssociatePublic = {
      id: associate.id,
      name: associate.name,
      email: associate.email,
      phone: associate.phone,
      active: associate.active,
      createdAt: associate.createdAt,
    };

    return NextResponse.json(publicData);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao realizar login" },
      { status: 500 },
    );
  }
}
