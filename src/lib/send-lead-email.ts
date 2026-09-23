import { saveLead } from "@/lib/lead-storage";

type LeadPayload = {
  nome: string;
  email: string;
  whatsapp: string;
  interesse: string;
};

export type SendLeadResult = {
  ok: boolean;
  leadSaved: boolean;
  error?: string;
};

export async function sendLeadEmail({
  nome,
  email,
  whatsapp,
  interesse,
}: LeadPayload): Promise<SendLeadResult> {
  try {
    await saveLead({ nome, email, whatsapp, interesse });
    console.log(
      `[submitLead] Interesse salvo — nome=${nome}, email=${email}, interesse=${interesse}`,
    );
    return { ok: true, leadSaved: true };
  } catch (err) {
    console.error("[submitLead] Erro ao salvar interesse:", err);
    return {
      ok: false,
      leadSaved: false,
      error: err instanceof Error ? err.message : "unknown_error",
    };
  }
}
