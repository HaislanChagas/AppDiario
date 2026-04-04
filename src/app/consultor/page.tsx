"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const etapas = [
  "Leads",
  "Atendimento",
  "Visitas Agendadas",
  "Visitas Realizadas",
  "Pasta Docs",
  "Crédito Aprovado",
];

type Valores = Record<string, number>;

const etapaConfig: Record<
  string,
  {
    emoji: string;
    cor: string;
    bg: string;
    shadow: string;
  }
> = {
  Leads: {
    emoji: "🔥",
    cor: "#38bdf8",
    bg: "linear-gradient(135deg, rgba(56,189,248,0.18), rgba(56,189,248,0.06))",
    shadow: "0 0 24px rgba(56,189,248,0.20)",
  },
  Atendimento: {
    emoji: "📞",
    cor: "#a78bfa",
    bg: "linear-gradient(135deg, rgba(167,139,250,0.18), rgba(167,139,250,0.06))",
    shadow: "0 0 24px rgba(167,139,250,0.20)",
  },
  "Visitas Agendadas": {
    emoji: "📅",
    cor: "#f59e0b",
    bg: "linear-gradient(135deg, rgba(245,158,11,0.18), rgba(245,158,11,0.06))",
    shadow: "0 0 24px rgba(245,158,11,0.20)",
  },
  "Visitas Realizadas": {
    emoji: "🏠",
    cor: "#fb7185",
    bg: "linear-gradient(135deg, rgba(251,113,133,0.18), rgba(251,113,133,0.06))",
    shadow: "0 0 24px rgba(251,113,133,0.20)",
  },
  "Pasta Docs": {
    emoji: "📂",
    cor: "#22c55e",
    bg: "linear-gradient(135deg, rgba(34,197,94,0.18), rgba(34,197,94,0.06))",
    shadow: "0 0 24px rgba(34,197,94,0.20)",
  },
  "Crédito Aprovado": {
    emoji: "✅",
    cor: "#10b981",
    bg: "linear-gradient(135deg, rgba(16,185,129,0.18), rgba(16,185,129,0.06))",
    shadow: "0 0 24px rgba(16,185,129,0.20)",
  },
};

function HeaderCard({
  consultorNome,
  diaSelecionado,
  ultimoDiaDoMes,
  carregando,
  podeEditar,
  onTrocarConsultor,
  onDiaChange,
}: {
  consultorNome: string;
  diaSelecionado: number;
  ultimoDiaDoMes: number;
  carregando: string | null;
  podeEditar: boolean;
  onTrocarConsultor: () => void;
  onDiaChange: (dia: number) => void;
}) {
  return (
    <section className="glass-card rounded-[30px] p-5 sm:p-6">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-[13px] font-bold text-emerald-300">
            <span>●</span>
            <span>Painel diário</span>
          </div>

          <h1 className="section-title m-0 text-[34px] font-black leading-none sm:text-[38px]">
            Time Aliados
          </h1>

          <p className="mt-3 text-[15px] text-white/70">
            Consultor: <strong className="text-white">{consultorNome}</strong>
          </p>
        </div>

        <button
          onClick={onTrocarConsultor}
          disabled={carregando !== null}
          className="rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-sm font-bold text-white shadow-sm hover:bg-white/12 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Trocar consultor
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="soft-panel rounded-3xl p-4">
          <p className="text-soft m-0 text-[13px]">Dia selecionado</p>

          <select
            value={diaSelecionado}
            onChange={(e) => onDiaChange(Number(e.target.value))}
            disabled={carregando !== null}
            className="mt-3 w-full rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-[15px] font-semibold text-white outline-none disabled:cursor-not-allowed disabled:opacity-60"
          >
            {Array.from({ length: ultimoDiaDoMes }, (_, i) => i + 1).map((dia) => (
              <option key={dia} value={dia} style={{ color: "#111827" }}>
                Dia {dia}
              </option>
            ))}
          </select>
        </div>

        <div className="soft-panel rounded-3xl p-4">
          <p className="text-soft m-0 text-[13px]">Data atual</p>
          <p className="metric-number mt-3 text-[24px] font-black leading-none sm:text-[28px]">
            {new Date().toLocaleDateString("pt-BR")}
          </p>
        </div>

        <div className="soft-panel rounded-3xl p-4">
          <p className="text-soft m-0 text-[13px]">Status</p>
          <p
            className={`metric-number mt-3 text-[22px] font-black leading-none ${
              carregando
                ? "text-yellow-300"
                : podeEditar
                ? "text-emerald-400"
                : "text-orange-300"
            }`}
          >
            {carregando ? "Salvando..." : podeEditar ? "Pronto" : "Somente leitura"}
          </p>
        </div>
      </div>
    </section>
  );
}

function EtapaCard({
  etapa,
  valorDia,
  valorMes,
  carregando,
  podeEditar,
  onSomar,
  onSubtrair,
}: {
  etapa: string;
  valorDia: number;
  valorMes: number;
  carregando: string | null;
  podeEditar: boolean;
  onSomar: () => void;
  onSubtrair: () => void;
}) {
  const config = etapaConfig[etapa];

  return (
    <section className="glass-card rounded-[28px] p-4 sm:p-5">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div
            className="inline-flex items-center gap-2 rounded-full border px-3 py-2"
            style={{
              borderColor: `${config.cor}33`,
              background: config.bg,
              boxShadow: config.shadow,
            }}
          >
            <span className="text-[18px]">{config.emoji}</span>
            <span
              className="text-[14px] font-extrabold"
              style={{ color: config.cor }}
            >
              {etapa}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onSubtrair}
              disabled={carregando !== null || !podeEditar}
              className="h-12 w-12 rounded-2xl border border-white/10 bg-white/6 text-[24px] font-black text-white hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {carregando === `${etapa}-subtrair` ? "..." : "−"}
            </button>

            <button
              onClick={onSomar}
              disabled={carregando !== null || !podeEditar}
              className="h-12 w-14 rounded-2xl border-0 text-[26px] font-black text-white disabled:cursor-not-allowed disabled:opacity-40"
              style={{
                background: `linear-gradient(135deg, ${config.cor}, ${config.cor}cc)`,
                boxShadow: config.shadow,
              }}
            >
              {carregando === `${etapa}-somar` ? "..." : "+"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="soft-panel rounded-3xl p-4">
            <p className="text-softer m-0 text-[13px]">Dia selecionado</p>
            <p className="metric-number mt-2 text-[34px] font-black leading-none">
              {valorDia}
            </p>
          </div>

          <div className="soft-panel rounded-3xl p-4">
            <p className="text-softer m-0 text-[13px]">Acumulado no mês</p>
            <p className="metric-number mt-2 text-[30px] font-black leading-none">
              {valorMes}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ConsultorPage() {
  const router = useRouter();

  const agora = new Date();
  const hoje = agora.getDate();
  const anoAtual = agora.getFullYear();
  const mesAtual = agora.getMonth();
  const ultimoDiaDoMes = new Date(anoAtual, mesAtual + 1, 0).getDate();

  const [consultorNome, setConsultorNome] = useState("");
  const [sessaoCarregada, setSessaoCarregada] = useState(false);
  const [diaSelecionado, setDiaSelecionado] = useState<number>(hoje);
  const [carregando, setCarregando] = useState<string | null>(null);
  const [mensagem, setMensagem] = useState("");
  const [valoresDia, setValoresDia] = useState<Valores>({});
  const [valoresMes, setValoresMes] = useState<Valores>({});

  const podeEditar = diaSelecionado <= hoje;

  useEffect(() => {
    const nome = localStorage.getItem("consultor_nome");

    if (!nome) {
      router.replace("/");
      return;
    }

    setConsultorNome(nome);
    setSessaoCarregada(true);
  }, [router]);

  useEffect(() => {
    if (!sessaoCarregada || !consultorNome) return;
    carregarResumo(diaSelecionado);
  }, [sessaoCarregada, consultorNome, diaSelecionado]);

  async function carregarResumo(dia: number) {
    try {
      const res = await fetch("/api/resumo-dia", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          consultorNome,
          dia,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMensagem(data.error || "Erro ao carregar resumo.");
        return;
      }

      setValoresDia(data.valoresDia || {});
      setValoresMes(data.valoresMes || {});
      setMensagem("");
    } catch {
      setMensagem("Erro ao carregar os dados do dia.");
    }
  }

  async function lancar(etapa: string, operacao: "somar" | "subtrair") {
    if (!podeEditar) {
      setMensagem("Dias futuros estão bloqueados para edição.");
      return;
    }

    const delta = operacao === "somar" ? 1 : -1;

    const valorDiaAnterior = valoresDia[etapa] ?? 0;
    const valorMesAnterior = valoresMes[etapa] ?? 0;

    const novoValorDia = Math.max(0, valorDiaAnterior + delta);
    const novoValorMes = Math.max(0, valorMesAnterior + delta);

    setCarregando(`${etapa}-${operacao}`);
    setMensagem("");

    setValoresDia((prev) => ({
      ...prev,
      [etapa]: novoValorDia,
    }));

    setValoresMes((prev) => ({
      ...prev,
      [etapa]: novoValorMes,
    }));

    try {
      const res = await fetch("/api/lancar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          consultorNome,
          etapa,
          operacao,
          dia: diaSelecionado,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setValoresDia((prev) => ({
          ...prev,
          [etapa]: valorDiaAnterior,
        }));

        setValoresMes((prev) => ({
          ...prev,
          [etapa]: valorMesAnterior,
        }));

        setMensagem(data.error || "Erro ao lançar.");
        return;
      }

      setMensagem(`${data.etapa} do dia ${data.dia} atualizado com sucesso.`);
    } catch {
      setValoresDia((prev) => ({
        ...prev,
        [etapa]: valorDiaAnterior,
      }));

      setValoresMes((prev) => ({
        ...prev,
        [etapa]: valorMesAnterior,
      }));

      setMensagem("Erro de conexão.");
    } finally {
      setCarregando(null);
    }
  }

  function trocarConsultor() {
    localStorage.removeItem("consultor_nome");
    router.replace("/");
  }

  if (!sessaoCarregada) {
    return (
      <main className="app-shell">
        <div className="app-container">
          <div className="glass-card rounded-[30px] p-6 text-white">
            Carregando painel...
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <div className="app-container">
        <HeaderCard
          consultorNome={consultorNome}
          diaSelecionado={diaSelecionado}
          ultimoDiaDoMes={ultimoDiaDoMes}
          carregando={carregando}
          podeEditar={podeEditar}
          onTrocarConsultor={trocarConsultor}
          onDiaChange={setDiaSelecionado}
        />

        <div className="mt-4 grid gap-3">
          {etapas.map((etapa) => (
            <EtapaCard
              key={etapa}
              etapa={etapa}
              valorDia={valoresDia[etapa] ?? 0}
              valorMes={valoresMes[etapa] ?? 0}
              carregando={carregando}
              podeEditar={podeEditar}
              onSomar={() => lancar(etapa, "somar")}
              onSubtrair={() => lancar(etapa, "subtrair")}
            />
          ))}
        </div>

        {mensagem && (
          <div className="glass-card mt-4 rounded-3xl px-4 py-4 text-white">
            {mensagem}
          </div>
        )}

        <div className="bottom-safe-space" />
      </div>
    </main>
  );
}