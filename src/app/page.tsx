"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Consultor = {
  nome: string;
  aba: string;
};

export default function HomePage() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [consultores, setConsultores] = useState<Consultor[]>([]);
  const [mensagem, setMensagem] = useState("Carregando consultores...");

  useEffect(() => {
    carregarConsultores();
  }, []);

  async function carregarConsultores() {
    try {
      const res = await fetch("/api/consultores");
      const data = await res.json();

      if (!res.ok) {
        setMensagem(data.error || "Erro ao carregar consultores.");
        return;
      }

      setConsultores(data.consultores || []);
      setMensagem("");
    } catch {
      setMensagem("Erro de conexão ao carregar consultores.");
    }
  }

  function entrar() {
    if (!nome) return;

    const consultorSelecionado = consultores.find((c) => c.nome === nome);
    if (!consultorSelecionado) return;

    localStorage.setItem("consultor_nome", consultorSelecionado.nome);
    localStorage.setItem("consultor_aba", consultorSelecionado.aba);

    router.push("/consultor");
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #0f172a 0%, #111827 45%, #14532d 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.12)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          borderRadius: 28,
          padding: 28,
          boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
          color: "#fff",
        }}
      >
        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 14px",
              borderRadius: 999,
              background: "rgba(34,197,94,0.18)",
              border: "1px solid rgba(34,197,94,0.28)",
              fontSize: 13,
              fontWeight: 600,
              marginBottom: 16,
            }}
          >
            <span>●</span>
            <span>Produtividade diária</span>
          </div>

          <h1
            style={{
              fontSize: 34,
              lineHeight: 1.1,
              margin: 0,
              fontWeight: 800,
              letterSpacing: "-0.02em",
            }}
          >
            Time Aliados
          </h1>

          <p
            style={{
              marginTop: 12,
              marginBottom: 0,
              fontSize: 15,
              lineHeight: 1.6,
              color: "rgba(255,255,255,0.72)",
            }}
          >
            Selecione seu nome para acessar e lançar sua produtividade no app.
          </p>
        </div>

        <div style={{ display: "grid", gap: 14 }}>
          <div>
            <label
              style={{
                display: "block",
                fontSize: 14,
                fontWeight: 600,
                marginBottom: 8,
                color: "rgba(255,255,255,0.88)",
              }}
            >
              Seu nome
            </label>

            <select
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              style={{
                width: "100%",
                padding: "16px 18px",
                borderRadius: 16,
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(255,255,255,0.08)",
                color: "#fff",
                fontSize: 15,
                outline: "none",
              }}
            >
              <option value="" style={{ color: "#111" }}>
                Selecione seu nome
              </option>
              {consultores.map((c) => (
                <option key={c.nome} value={c.nome} style={{ color: "#111" }}>
                  {c.nome}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={entrar}
            style={{
              width: "100%",
              padding: "16px 18px",
              borderRadius: 18,
              border: "none",
              background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
              color: "#fff",
              fontSize: 16,
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 12px 30px rgba(34,197,94,0.35)",
              marginTop: 6,
            }}
          >
            Entrar no painel
          </button>
        </div>

        {mensagem && (
          <p
            style={{
              marginTop: 18,
              fontSize: 14,
              color: "rgba(255,255,255,0.72)",
            }}
          >
            {mensagem}
          </p>
        )}
      </div>
    </main>
  );
}