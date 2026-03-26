import { NextRequest, NextResponse } from "next/server";
import { lerIntervalo } from "@/lib/sheets";

const ETAPAS = [
  "Leads",
  "Atendimento",
  "Agendamento Visita",
  "Pasta Docs",
  "Crédito Aprovado",
];

function parseNumero(valor: unknown) {
  return Number(String(valor ?? "0").replace(",", ".")) || 0;
}

function numeroParaColuna(numero: number): string {
  let coluna = "";
  let n = numero;

  while (n > 0) {
    const resto = (n - 1) % 26;
    coluna = String.fromCharCode(65 + resto) + coluna;
    n = Math.floor((n - 1) / 26);
  }

  return coluna;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { consultorNome, consultorAba, dia } = body;

    if (!consultorNome || !consultorAba || !dia) {
      return NextResponse.json(
        { error: "Consultor, aba ou dia não informado." },
        { status: 400 }
      );
    }

    const diaNumero = Number(dia);

    const agora = new Date();
    const ultimoDiaDoMes = new Date(
      agora.getFullYear(),
      agora.getMonth() + 1,
      0
    ).getDate();

    if (
      Number.isNaN(diaNumero) ||
      diaNumero < 1 ||
      diaNumero > ultimoDiaDoMes
    ) {
      return NextResponse.json({ error: "Dia inválido." }, { status: 400 });
    }

    const colunaFim = numeroParaColuna(ultimoDiaDoMes + 1);
    const intervalo = `B5:${colunaFim}9`;

    const bloco = await lerIntervalo(consultorAba, intervalo);

    const valoresDia: Record<string, number> = {};
    const valoresMes: Record<string, number> = {};

    for (let i = 0; i < ETAPAS.length; i++) {
      const etapa = ETAPAS[i];
      const linha = bloco[i] || [];

      const valorDia = parseNumero(linha[diaNumero - 1]);
      const totalMes = linha.reduce(
        (acc: number, item: unknown) => acc + parseNumero(item),
        0
      );

      valoresDia[etapa] = valorDia;
      valoresMes[etapa] = totalMes;
    }

    return NextResponse.json({
      ok: true,
      consultor: consultorNome,
      aba: consultorAba,
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