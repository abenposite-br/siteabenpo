"use server";

import { redirect } from "next/navigation";
import { sendLeadEmail } from "@/lib/send-lead-email";

function isNextRedirect(err: unknown): boolean {
  if (err && typeof err === "object") {
    const e = err as { digest?: unknown };
    if (typeof e.digest === "string" && e.digest.startsWith("NEXT_REDIRECT")) {
      return true;
    }
  }
  return false;
}

export async function submitLead(formData: FormData) {
  const nome = String(formData.get("nome") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const whatsapp = String(formData.get("whatsapp") ?? "").trim();
  const interesse = String(formData.get("interesse") ?? "").trim();

  console.log("[submitLead] Recebendo submissão:", {
    nome: nome || "VAZIO",
    email: email || "VAZIO",
    whatsapp: whatsapp || "VAZIO",
    interesse: interesse || "VAZIO",
  });

  if (
    !nome ||
    !email ||
    !interesse ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    console.warn(
      "[submitLead] Validação falhou — nome, email ou interesse inválidos.",
    );
    redirect("/?enviado=0#associar");
  }

  try {
    const result = await sendLeadEmail({
      nome,
      email,
      whatsapp,
      interesse,
    });

    console.log("[submitLead] Resultado:", result);

    if (!result.ok) {
      console.error("[submitLead] Falha ao salvar interesse.");
      redirect("/?enviado=2#associar");
    }

    redirect("/?enviado=1#associar");
  } catch (err) {
    if (isNextRedirect(err)) {
      throw err;
    }

    console.error("[submitLead] Exceção durante submitLead:", err);
    redirect("/?enviado=2#associar");
  }
}
