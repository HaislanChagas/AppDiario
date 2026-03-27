import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { consultorNome, etapa, operacao, dia } = body;

    if (!consultorNome || !etapa || !operacao || !dia) {
      return NextResponse.json(
        { error: "Dados obrigatórios ausentes." },
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

    const { data: usuario, error: usuarioError } = await supabase
      .from("usuarios")
      .select("id, nome")
      .eq("nome", consultorNome)
      .eq("ativo", true)
      .maybeSingle();

    if (usuarioError || !usuario) {
      return NextResponse.json({ error: "Consultor não encontrado." }, { status: 404 });
    }

    const { data: etapaRow, error: etapaError } = await supabase
      .from("etapas")
      .select("id, nome")
      .eq("nome", etapa)
      .eq("ativo", true)
      .maybeSingle();

    if (etapaError || !etapaRow) {
      return NextResponse.json({ error: "Etapa inválida." }, { status: 404 });
    }

    const { data: registroAtual, error: registroError } = await supabase
      .from("produtividade_diaria")
      .select("id, quantidade")
      .eq("usuario_id", usuario.id)
      .eq("etapa_id", etapaRow.id)
      .eq("data_referencia", dataReferencia)
      .maybeSingle();

    if (registroError) {
      return NextResponse.json(
        { error: "Erro ao consultar lançamento atual." },
        { status: 500 }
      );
    }

    const atual = registroAtual?.quantidade ?? 0;
    let novoValor = atual;

    if (operacao === "somar") novoValor += 1;
    if (operacao === "subtrair") novoValor = Math.max(0, atual - 1);

    const payload = {
      usuario_id: usuario.id,
      etapa_id: etapaRow.id,
      data_referencia: dataReferencia,
      quantidade: novoValor,
      updated_at: new Date().toISOString(),
    };

    const { error: upsertError } = await supabase
      .from("produtividade_diaria")
      .upsert(payload, {
        onConflict: "usuario_id,etapa_id,data_referencia",
      });

    if (upsertError) {
      return NextResponse.json(
        { error: "Erro ao salvar lançamento." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      consultor: usuario.nome,
      etapa: etapaRow.nome,
      dia: diaNumero,
      dataReferencia,
      valorAnterior: atual,
      valorAtual: novoValor,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao lançar no Supabase." },
      { status: 500 }
    );
  }
}