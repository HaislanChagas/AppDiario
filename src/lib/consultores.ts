import { supabase } from "./supabase";

export async function listarConsultores() {
  const { data, error } = await supabase
    .from("usuarios")
    .select("id, nome")
    .eq("ativo", true)
    .order("nome", { ascending: true });

  if (error) {
    throw new Error(`Erro ao listar consultores: ${error.message}`);
  }

  return (data || []).map((usuario) => ({
    id: usuario.id,
    nome: usuario.nome,
  }));
}

export async function encontrarConsultorPorNome(nome: string) {
  const { data, error } = await supabase
    .from("usuarios")
    .select("id, nome")
    .eq("nome", nome)
    .eq("ativo", true)
    .maybeSingle();

  if (error) {
    throw new Error(`Erro ao buscar consultor: ${error.message}`);
  }

  return data || null;
}