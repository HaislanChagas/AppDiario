import { NextResponse } from "next/server";
import { listarConsultores } from "@/lib/consultores";

export async function GET() {
  try {
    const consultores = await listarConsultores();

    return NextResponse.json({
      ok: true,
      consultores,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro ao listar consultores." }, { status: 500 });
  }
}