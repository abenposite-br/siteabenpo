import { NextResponse } from "next/server";
import { getLeads } from "@/lib/lead-storage";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const leads = await getLeads();
    return NextResponse.json(leads);
  } catch (error) {
    console.error("Erro ao carregar leads:", error);
    return NextResponse.json(
      { error: "Erro ao carregar leads" },
      { status: 500 },
    );
  }
}

export async function POST() {
  return NextResponse.json(
    { error: "Use o formulário no site para cadastrar interesses." },
    { status: 405 },
  );
}
