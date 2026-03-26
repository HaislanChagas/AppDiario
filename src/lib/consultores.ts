import { listarAbas } from "./sheets";

const ABAS_EXCLUIDAS = [
  "PROCESSOS_QUENTES",
  "PROCESSOS QUENTES",
  "Processos Quentes",
  "PIPE",
  "Pipe",
  "METAS",
  "Meta",
  "META",
  "ROLETA",
  "Roleta",
  "ROLETA - CONTROLE DE LEADS",
  "ROLETA – CONTROLE DE LEADS",
];

function normalizar(texto: string) {
  return texto.trim().toLowerCase();
}

export async function listarConsultores() {
  const abas = await listarAbas();

  return abas
    .filter((aba) => !ABAS_EXCLUIDAS.map(normalizar).includes(normalizar(aba)))
    .map((aba) => ({
      nome: aba,
      aba: aba,
    }));
}

export async function encontrarConsultorPorNome(nome: string) {
  const consultores = await listarConsultores();
  return consultores.find((c) => c.nome === nome) || null;
}