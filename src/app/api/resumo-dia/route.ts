import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const ETAPAS = [
  "Leads",
  "Atendimento",
  "Visitas Agendadas",
  "Visitas Realizadas",
  "Pasta Docs",
  "Crédito Aprovado",
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { consultorNome, dia } = body;

    if (!consultorNome || !dia) {
      return NextResponse.json(
        { error: "Consultor ou dia não informado." },
        { status: 400 }
      );
    }

    const diaNumero = Number(dia);
    const agora = new Date();
    const ano = agora.getFullYear();
    const mes = agora.getMonth() + 1;
    const ultimoDiaDoMes = new Date(ano, mes, 0).getDate();

    if (
      Number.isNaN(diaNumero) ||
      diaNumero < 1 ||
      diaNumero > ultimoDiaDoMes
    ) {
      return NextResponse.json({ error: "Dia inválido." }, { status: 400 });
    }

    const dataReferencia = `${ano}-${String(mes).padStart(2, "0")}-${String(diaNumero).padStart(2, "0")}`;
    const inicioMes = `${ano}-${String(mes).padStart(2, "0")}-01`;
    const fimMes = `${ano}-${String(mes).padStart(2, "0")}-${String(ultimoDiaDoMes).padStart(2, "0")}`;

    const { data: usuario, error: usuarioError } = await supabase
      .from("usuarios")
      .select("id, nome")
      .eq("nome", consultorNome)
      .eq("ativo", true)
      .maybeSingle();

    if (usuarioError || !usuario) {
      return NextResponse.json({ error: "Consultor não encontrado." }, { status: 404 });
    }

    const { data: registros, error: registrosError } = await supabase
      .from("produtividade_diaria")
      .select(`
        quantidade,
        data_referencia,
        etapas!inner(nome)
      `)
      .eq("usuario_id", usuario.id)
      .gte("data_referencia", inicioMes)
      .lte("data_referencia", fimMes);

    if (registrosError) {
      return NextResponse.json(
        { error: "Erro ao buscar resumo do dia." },
        { status: 500 }
      );
    }

    const valoresDia: Record<string, number> = {};
    const valoresMes: Record<string, number> = {};

    for (const etapa of ETAPAS) {
      valoresDia[etapa] = 0;
      valoresMes[etapa] = 0;
    }

    for (const registro of registros || []) {
      const nomeEtapa = Array.isArray(registro.etapas)
        ? registro.etapas[0]?.nome
        : (registro.etapas as { nome: string })?.nome;

      if (!nomeEtapa) continue;

      valoresMes[nomeEtapa] += registro.quantidade;

      if (registro.data_referencia === dataReferencia) {
        valoresDia[nomeEtapa] += registro.quantidade;
      }
    }

    return NextResponse.json({
      ok: true,
      consultor: usuario.nome,
      dia: diaNumero,
      valoresDia,
      valoresMes,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao buscar resumo do dia." },
      { status: 500 }
    );
  }
}