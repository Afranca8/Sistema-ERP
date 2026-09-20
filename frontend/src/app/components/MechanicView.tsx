import { useState } from "react";
import { Clock, Wrench, CheckCircle, AlertCircle, Package, History, ChevronDown, ChevronUp } from "lucide-react";

type Page = "kanban" | "execucao";

interface MechanicViewProps {
  currentPage: Page;
}

interface OS {
  id: string;
  placa: string;
  modelo: string;
  cliente: string;
  problema: string;
  status: "aguardando_pecas" | "em_andamento" | "teste_rodagem" | "finalizado";
  mecanico: string;
  prioridade: "alta" | "media" | "baixa";
  inicio: string;
}

const MOCK_OS: OS[] = [
  { id: "OS-2041", placa: "ABC-1234", modelo: "Honda Civic EXL 2021", cliente: "Marcos Oliveira", problema: "Revisão completa + troca de óleo e filtros", status: "em_andamento", mecanico: "Roberto Alves", prioridade: "alta", inicio: "08:30" },
  { id: "OS-2038", placa: "XYZ-5678", modelo: "Toyota Corolla XEI 2020", cliente: "Fernanda Lima", problema: "Barulho no freio dianteiro — verificar pastilhas e disco", status: "aguardando_pecas", mecanico: "Roberto Alves", prioridade: "alta", inicio: "07:15" },
  { id: "OS-2035", placa: "DEF-9012", modelo: "Hyundai HB20 2022", cliente: "Paulo Siqueira", problema: "Troca de correia dentada e tensor", status: "teste_rodagem", mecanico: "Diego Santos", prioridade: "media", inicio: "06:00" },
  { id: "OS-2033", placa: "GHI-3456", modelo: "Chevrolet Onix Plus 2023", cliente: "Aline Nunes", problema: "Diagnóstico — luz do motor acesa (DTC P0420)", status: "finalizado", mecanico: "Fábio Correia", prioridade: "baixa", inicio: "Ontem" },
  { id: "OS-2040", placa: "JKL-7890", modelo: "Volkswagen Polo 200 TSI", cliente: "Ricardo Moura", problema: "Troca de amortecedor dianteiro esquerdo", status: "aguardando_pecas", mecanico: "Roberto Alves", prioridade: "media", inicio: "09:00" },
];

const COLUMNS = [
  { id: "aguardando_pecas", label: "Aguardando Peças", color: "#F59E0B", bg: "#FFFBEB", icon: <Package size={14} /> },
  { id: "em_andamento", label: "Em Andamento", color: "#3B82F6", bg: "#EFF6FF", icon: <Wrench size={14} /> },
  { id: "teste_rodagem", label: "Teste de Rodagem", color: "#8B5CF6", bg: "#F5F3FF", icon: <Clock size={14} /> },
  { id: "finalizado", label: "Finalizado", color: "#22C55E", bg: "#F0FDF4", icon: <CheckCircle size={14} /> },
] as const;

const PRIORIDADE_CONFIG = {
  alta: { label: "Alta", color: "#EF4444", bg: "#FEF2F2" },
  media: { label: "Média", color: "#F59E0B", bg: "#FFFBEB" },
  baixa: { label: "Baixa", color: "#22C55E", bg: "#F0FDF4" },
};

const NEXT_STATUS: Record<OS["status"], OS["status"] | null> = {
  aguardando_pecas: "em_andamento",
  em_andamento: "teste_rodagem",
  teste_rodagem: "finalizado",
  finalizado: null,
};

const NEXT_LABEL: Record<OS["status"], string> = {
  aguardando_pecas: "→ Iniciar Serviço",
  em_andamento: "→ Enviar p/ Teste",
  teste_rodagem: "→ Finalizar OS",
  finalizado: "Concluído",
};

const PECAS_ESTOQUE = [
  { nome: "Pastilha de Freio Diant. (par)", cod: "PF-2241", qtd: 8, unit: 89.9 },
  { nome: "Óleo Motor 5W30 Sintético 1L", cod: "OM-5530", qtd: 24, unit: 28.5 },
  { nome: "Filtro de Óleo Universal", cod: "FO-1001", qtd: 15, unit: 18.0 },
  { nome: "Correia Dentada Honda 1.6", cod: "CD-H16", qtd: 3, unit: 145.0 },
  { nome: "Amortecedor Diant. Polo 1.0", cod: "AM-VW10", qtd: 2, unit: 310.0 },
  { nome: "Tensor Correia Dentada", cod: "TC-0042", qtd: 5, unit: 78.0 },
];

const HISTORICO = [
  { data: "15/03/2026", os: "OS-1987", servico: "Troca de óleo e filtros", km: "87.400 km" },
  { data: "02/12/2025", os: "OS-1721", servico: "Revisão 80.000 km + alinhamento", km: "80.100 km" },
  { data: "14/08/2025", os: "OS-1490", servico: "Troca de pastilhas + disco freio", km: "72.300 km" },
];

function OSCard({ os, onStatusChange }: { os: OS; onStatusChange: (id: string, newStatus: OS["status"]) => void }) {
  const col = COLUMNS.find((c) => c.id === os.status)!;
  const prio = PRIORIDADE_CONFIG[os.prioridade];
  const next = NEXT_STATUS[os.status];

  return (
    <div className="rounded-xl p-4 mb-3" style={{ background: "#fff", border: "1px solid #D1D9E6", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
      <div className="flex items-start justify-between mb-2">
        <span className="text-xs font-semibold" style={{ color: "#0A0F1A", fontFamily: "var(--font-mono)" }}>{os.id}</span>
        <span className="text-xs px-1.5 py-0.5 rounded-full font-medium" style={{ background: prio.bg, color: prio.color }}>
          {prio.label}
        </span>
      </div>
      <div className="flex items-center gap-1.5 mb-2">
        <span className="text-xs font-semibold px-1.5 py-0.5 rounded" style={{ background: "#F0F4F8", color: "#374151", fontFamily: "var(--font-mono)" }}>
          {os.placa}
        </span>
        <span className="text-xs" style={{ color: "#4B5563" }}>{os.modelo}</span>
      </div>
      <p className="text-xs mb-3 leading-relaxed" style={{ color: "#374151" }}>{os.problema}</p>
      <div className="flex items-center justify-between">
        <div className="text-xs" style={{ color: "#9CA3AF" }}>
          Início: {os.inicio}
        </div>
        {next ? (
          <button
            onClick={() => onStatusChange(os.id, next)}
            className="text-xs px-2.5 py-1.5 rounded-lg font-medium transition-colors"
            style={{ background: col.color, color: "#fff", cursor: "pointer", border: "none" }}
          >
            {NEXT_LABEL[os.status]}
          </button>
        ) : (
          <span className="text-xs px-2.5 py-1.5 rounded-lg font-medium" style={{ background: "#F0FDF4", color: "#22C55E" }}>
            ✓ Finalizado
          </span>
        )}
      </div>
    </div>
  );
}

function KanbanPage() {
  const [osList, setOsList] = useState(MOCK_OS);

  function handleStatusChange(id: string, newStatus: OS["status"]) {
    setOsList((prev) => prev.map((o) => o.id === id ? { ...o, status: newStatus } : o));
  }

  return (
    <div>
      <div className="mb-6">
        <h1 style={{ color: "#0A0F1A", fontFamily: "var(--font-family)", fontWeight: 600, fontSize: "1.25rem" }}>
          Painel de Serviços — Kanban
        </h1>
        <p className="text-sm mt-0.5" style={{ color: "#4B5563" }}>
          Visualização em tempo real das ordens em andamento. Arraste ou use os botões para atualizar status.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {COLUMNS.map((col) => {
          const items = osList.filter((o) => o.status === col.id);
          return (
            <div key={col.id}>
              <div
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg mb-3"
                style={{ background: col.bg, border: `1px solid ${col.color}30` }}
              >
                <span style={{ color: col.color }}>{col.icon}</span>
                <span className="text-xs font-semibold" style={{ color: col.color }}>{col.label}</span>
                <span
                  className="ml-auto w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ background: col.color, color: "#fff" }}
                >
                  {items.length}
                </span>
              </div>
              <div>
                {items.map((os) => (
                  <OSCard key={os.id} os={os} onStatusChange={handleStatusChange} />
                ))}
                {items.length === 0 && (
                  <div
                    className="rounded-xl p-4 text-center text-xs"
                    style={{ border: "2px dashed #D1D9E6", color: "#9CA3AF" }}
                  >
                    Nenhuma OS aqui
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ExecucaoPage() {
  const [selectedOS, setSelectedOS] = useState(MOCK_OS[0]);
  const [showEstoque, setShowEstoque] = useState(false);
  const [showHistorico, setShowHistorico] = useState(false);
  const [osList, setOsList] = useState(MOCK_OS.filter((o) => o.status !== "finalizado"));

  function handleStatusChange(id: string, newStatus: OS["status"]) {
    setOsList((prev) => prev.map((o) => o.id === id ? { ...o, status: newStatus } : o));
    setSelectedOS((prev) => prev.id === id ? { ...prev, status: newStatus } : prev);
  }

  const col = COLUMNS.find((c) => c.id === selectedOS.status)!;

  return (
    <div>
      <div className="mb-6">
        <h1 style={{ color: "#0A0F1A", fontFamily: "var(--font-family)", fontWeight: 600, fontSize: "1.25rem" }}>
          Execução de OS
        </h1>
        <p className="text-sm mt-0.5" style={{ color: "#4B5563" }}>Selecione uma OS para gerenciar, consultar estoque e histórico.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* OS list */}
        <div className="rounded-xl overflow-hidden" style={{ background: "#fff", border: "1px solid #D1D9E6", height: "fit-content" }}>
          <div className="px-4 py-3" style={{ borderBottom: "1px solid #F0F4F8" }}>
            <span className="text-sm font-semibold" style={{ color: "#0A0F1A" }}>Minhas OS Ativas</span>
          </div>
          <div>
            {osList.map((o, i) => {
              const c = COLUMNS.find((col) => col.id === o.status)!;
              return (
                <button
                  key={o.id}
                  onClick={() => setSelectedOS(o)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left transition-all"
                  style={{
                    borderTop: i > 0 ? "1px solid #F0F4F8" : "none",
                    background: selectedOS.id === o.id ? "#EFF6FF" : "transparent",
                    borderLeft: selectedOS.id === o.id ? "3px solid #2563EB" : "3px solid transparent",
                  }}
                >
                  <div className="flex-1">
                    <div className="text-xs font-bold" style={{ color: "#0A0F1A", fontFamily: "var(--font-mono)" }}>{o.id}</div>
                    <div className="text-xs mt-0.5" style={{ color: "#4B5563" }}>{o.placa} — {o.cliente}</div>
                  </div>
                  <span className="text-xs px-1.5 py-0.5 rounded-full font-medium" style={{ background: c.bg, color: c.color }}>
                    {c.label.split(" ")[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Detail panel */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl p-6" style={{ background: "#fff", border: "1px solid #D1D9E6" }}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-bold" style={{ color: "#0A0F1A", fontFamily: "var(--font-mono)", fontSize: "1.1rem" }}>{selectedOS.id}</span>
                  <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: col.bg, color: col.color }}>
                    {col.icon} {col.label}
                  </span>
                </div>
                <div className="text-sm font-semibold" style={{ color: "#374151" }}>{selectedOS.cliente}</div>
              </div>
              <div className="text-right">
                <div className="text-xs px-2 py-1 rounded font-semibold" style={{ background: "#F0F4F8", color: "#374151", fontFamily: "var(--font-mono)" }}>
                  {selectedOS.placa}
                </div>
                <div className="text-xs mt-1" style={{ color: "#4B5563" }}>{selectedOS.modelo}</div>
              </div>
            </div>

            <div className="p-4 rounded-lg mb-5" style={{ background: "#F4F6FA", border: "1px solid #F0F4F8" }}>
              <div className="text-xs font-semibold mb-1" style={{ color: "#4B5563" }}>Problema Relatado</div>
              <p className="text-sm" style={{ color: "#0A0F1A" }}>{selectedOS.problema}</p>
            </div>

            {NEXT_STATUS[selectedOS.status] && (
              <button
                onClick={() => handleStatusChange(selectedOS.id, NEXT_STATUS[selectedOS.status]!)}
                className="w-full py-3 rounded-lg font-medium text-white transition-colors"
                style={{ background: col.color, cursor: "pointer" }}
              >
                {NEXT_LABEL[selectedOS.status]}
              </button>
            )}
          </div>

          {/* Estoque accordion */}
          <div className="rounded-xl overflow-hidden" style={{ background: "#fff", border: "1px solid #D1D9E6" }}>
            <button
              onClick={() => setShowEstoque(!showEstoque)}
              className="w-full flex items-center justify-between px-5 py-4"
              style={{ background: "transparent", cursor: "pointer" }}
            >
              <div className="flex items-center gap-2">
                <Package size={16} style={{ color: "#2563EB" }} />
                <span className="font-semibold text-sm" style={{ color: "#0A0F1A" }}>Consultar Estoque de Peças</span>
              </div>
              {showEstoque ? <ChevronUp size={16} style={{ color: "#4B5563" }} /> : <ChevronDown size={16} style={{ color: "#4B5563" }} />}
            </button>
            {showEstoque && (
              <div style={{ borderTop: "1px solid #F0F4F8" }}>
                <table className="w-full">
                  <thead style={{ background: "#F4F6FA" }}>
                    <tr>
                      {["Cód.", "Peça", "Estoque", "Vlr. Unit.", ""].map((h) => (
                        <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold" style={{ color: "#4B5563" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {PECAS_ESTOQUE.map((p, i) => (
                      <tr key={p.cod} style={{ borderTop: i > 0 ? "1px solid #F0F4F8" : "none" }}>
                        <td className="px-4 py-2.5 text-xs" style={{ color: "#4B5563", fontFamily: "var(--font-mono)" }}>{p.cod}</td>
                        <td className="px-4 py-2.5 text-xs" style={{ color: "#374151" }}>{p.nome}</td>
                        <td className="px-4 py-2.5">
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{
                            background: p.qtd <= 3 ? "#FEF2F2" : "#F0FDF4",
                            color: p.qtd <= 3 ? "#EF4444" : "#22C55E"
                          }}>
                            {p.qtd} un.
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-xs font-medium" style={{ color: "#0A0F1A", fontFamily: "var(--font-mono)" }}>
                          R$ {p.unit.toFixed(2)}
                        </td>
                        <td className="px-4 py-2.5">
                          <button className="text-xs px-2 py-1 rounded-md font-medium" style={{ background: "#EFF6FF", color: "#2563EB", cursor: "pointer" }}>
                            + Vincular
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Histórico accordion */}
          <div className="rounded-xl overflow-hidden" style={{ background: "#fff", border: "1px solid #D1D9E6" }}>
            <button
              onClick={() => setShowHistorico(!showHistorico)}
              className="w-full flex items-center justify-between px-5 py-4"
              style={{ background: "transparent", cursor: "pointer" }}
            >
              <div className="flex items-center gap-2">
                <History size={16} style={{ color: "#2563EB" }} />
                <span className="font-semibold text-sm" style={{ color: "#0A0F1A" }}>
                  Histórico do Veículo — {selectedOS.placa}
                </span>
              </div>
              {showHistorico ? <ChevronUp size={16} style={{ color: "#4B5563" }} /> : <ChevronDown size={16} style={{ color: "#4B5563" }} />}
            </button>
            {showHistorico && (
              <div style={{ borderTop: "1px solid #F0F4F8" }}>
                {HISTORICO.map((h, i) => (
                  <div
                    key={h.os}
                    className="flex items-center gap-4 px-5 py-3"
                    style={{ borderTop: i > 0 ? "1px solid #F0F4F8" : "none" }}
                  >
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ background: "#2563EB" }} />
                    <div className="flex-1">
                      <div className="text-xs font-medium" style={{ color: "#0A0F1A" }}>{h.servico}</div>
                      <div className="text-xs mt-0.5" style={{ color: "#4B5563" }}>{h.data} · {h.km}</div>
                    </div>
                    <span className="text-xs" style={{ color: "#9CA3AF", fontFamily: "var(--font-mono)" }}>{h.os}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function MechanicView({ currentPage }: MechanicViewProps) {
  return (
    <div className="flex-1 overflow-auto p-6" style={{ fontFamily: "var(--font-family)" }}>
      {currentPage === "kanban" && <KanbanPage />}
      {currentPage === "execucao" && <ExecucaoPage />}
    </div>
  );
}
