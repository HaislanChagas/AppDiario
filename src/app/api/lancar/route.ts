import { NextRequest, NextResponse } from "next/server";
import { lerCelula, escreverCelula } from "@/lib/sheets";

const MAPA_LINHAS: Record<string, number> = {
  "Leads": 5,
  "Atendimento": 6,
  "Agendamento Visita": 7,
  "Pasta Docs": 8,
  "Crédito Aprovado": 9,
};

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
    const { consultorNome, consultorAba, etapa, operacao, dia } = body;

    if (!consultorNome || !consultorAba || !etapa || !operacao || !dia) {
      return NextResponse.json(
        { error: "Dados obrigatórios ausentes." },
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

    const linha = MAPA_LINHAS[etapa];
    if (!linha) {
      return NextResponse.json({ error: "Etapa inválida." }, { status: 400 });
    }

    const colunaNumero = diaNumero + 1;
    const coluna = numeroParaColuna(colunaNumero);
    const celula = `${coluna}${linha}`;

    const atualBruto = await lerCelula(consultorAba, celula);
    const atual = Number(String(atualBruto).replace(",", ".")) || 0;

    let novoValor = atual;
    if (operacao === "somar") novoValor += 1;
    if (operacao === "subtrair") novoValor = Math.max(0, atual - 1);

    await escreverCelula(consultorAba, celula, novoValor);

    return NextResponse.json({
      ok: true,
      consultor: consultorNome,
      aba: consultorAba,
      etapa,
      dia: diaNumero,
      celula,
      valorAnterior: atual,
      valorAtual: novoValor,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao lançar no Google Sheets." },
      { status: 500 }
    );
  }
}