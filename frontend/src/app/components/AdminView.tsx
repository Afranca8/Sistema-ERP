import { useState } from "react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { Plus, AlertTriangle, Search, Edit2, Trash2, ShieldCheck, UserCheck, Wrench, ChevronDown, Phone, Mail, Truck, Clock, AlertCircle, ChevronRight, CheckCircle, DollarSign, Layers, } from "lucide-react";
import { ProfissionaisPage } from "./ProfissionaisPage";
import { CatalogoServicosPage } from "./CatalogoServicosPage";
import { ModelosPage } from "./ModelosPage";

type Page = "financeiro" | "usuarios" | "profissionais" | "catalogo_servicos" | "modelos" | "contas_receber" | "contas_prazo";

interface AdminViewProps {
  currentPage: Page;
}

// ─── Financial Data ───────────────────────────────────────────────────────────
const RECEITA_MENSAL = [
  { mes: "Jan", receita: 42500, despesas: 18200, os: 87 },
  { mes: "Fev", receita: 38900, despesas: 16800, os: 79 },
  { mes: "Mar", receita: 51200, despesas: 21000, os: 104 },
  { mes: "Abr", receita: 47800, despesas: 19500, os: 96 },
  { mes: "Mai", receita: 55600, despesas: 22400, os: 112 },
  { mes: "Jun", receita: 48300, despesas: 20100, os: 98 },
];


// ─── Usuarios ─────────────────────────────────────────────────────────────────
interface Usuario {
  id: string;
  nome: string;
  email: string;
  perfil: "admin" | "atendente" | "mecanico";
  status: "ativo" | "inativo";
  desde: string;
}

const USUARIOS_MOCK: Usuario[] = [
  { id: "1", nome: "Carlos Mendes", email: "carlos@erp.com.br", perfil: "admin", status: "ativo", desde: "Jan/2023" },
  { id: "2", nome: "Juliana Costa", email: "juliana@erp.com.br", perfil: "atendente", status: "ativo", desde: "Mar/2023" },
  { id: "3", nome: "Roberto Alves", email: "roberto@erp.com.br", perfil: "mecanico", status: "ativo", desde: "Mar/2023" },
  { id: "4", nome: "Diego Santos", email: "diego@erp.com.br", perfil: "mecanico", status: "ativo", desde: "Jul/2023" },
  { id: "5", nome: "Fábio Correia", email: "fabio@erp.com.br", perfil: "mecanico", status: "ativo", desde: "Out/2023" },
  { id: "6", nome: "Ana Rodrigues", email: "ana@erp.com.br", perfil: "atendente", status: "inativo", desde: "Abr/2024" },
];

const PERFIL_CONFIG = {
  admin: { label: "Administrador", color: "#7C3AED", bg: "#F5F3FF", icon: <ShieldCheck size={13} /> },
  atendente: { label: "Atendente", color: "#0EA5E9", bg: "#EFF6FF", icon: <UserCheck size={13} /> },
  mecanico: { label: "Mecânico", color: "#2563EB", bg: "#EFF6FF", icon: <Wrench size={13} /> },
};

function PageHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-6">
      <h1 style={{ color: "#0A0F1A", fontFamily: "var(--font-family)", fontWeight: 600, fontSize: "1.25rem" }}>{title}</h1>
      <p className="text-sm mt-0.5" style={{ color: "#4B5563" }}>{subtitle}</p>
    </div>
  );
}

function FinanceiroPage() {
  const totalReceita = RECEITA_MENSAL.reduce((s, r) => s + r.receita, 0);
  const totalOS = RECEITA_MENSAL.reduce((s, r) => s + r.os, 0);
  const lucroMedio = RECEITA_MENSAL.reduce((s, r) => s + (r.receita - r.despesas), 0) / RECEITA_MENSAL.length;

  const stats = [
    { label: "Receita Acumulada (2026)", value: `R$ ${(totalReceita / 1000).toFixed(1)}k`, sub: "Jan–Jun 2026", color: "#22C55E" },
    { label: "Total de OS Concluídas", value: `${totalOS}`, sub: "Jan–Jun 2026", color: "#3B82F6" },
    { label: "Lucro Médio Mensal", value: `R$ ${(lucroMedio / 1000).toFixed(1)}k`, sub: "Receita − Despesas", color: "#2563EB" },
    { label: "Ticket Médio por OS", value: `R$ ${(totalReceita / totalOS).toFixed(0)}`, sub: "Média geral", color: "#8B5CF6" },
  ];

  return (
    <div>
      <PageHeader title="Dashboard Financeiro" subtitle="Visão consolidada de receitas, despesas e volume de OS — 2026." />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl p-5" style={{ background: "#fff", border: "1px solid #D1D9E6" }}>
            <div className="text-xs mb-2" style={{ color: "#4B5563" }}>{s.label}</div>
            <div className="font-bold" style={{ color: "#0A0F1A", fontSize: "1.75rem", fontFamily: "var(--font-mono)" }}>{s.value}</div>
            <div className="text-xs mt-1" style={{ color: s.color }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Area chart */}
        <div className="lg:col-span-2 rounded-xl p-6" style={{ background: "#fff", border: "1px solid #D1D9E6" }}>
          <h3 className="font-semibold mb-4 text-sm" style={{ color: "#0A0F1A" }}>Receita vs. Despesas — Jan a Jun/2026</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart id="area-receita-despesas" data={RECEITA_MENSAL} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F4F8" vertical={false} />
              <XAxis dataKey="mes" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false}
                tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ background: "#fff", border: "1px solid #D1D9E6", borderRadius: 8, fontSize: 12 }}
                formatter={(v: number) => [`R$ ${v.toLocaleString("pt-BR")}`, undefined]}
              />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
              <Area type="monotone" dataKey="receita" name="Receita" stroke="#2563EB" strokeWidth={2} fill="#2563EB" fillOpacity={0.08} dot={{ r: 3, fill: "#2563EB" }} />
              <Area type="monotone" dataKey="despesas" name="Despesas" stroke="#1E3A8A" strokeWidth={2} fill="#1E3A8A" fillOpacity={0.08} dot={{ r: 3, fill: "#1E3A8A" }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Bar chart OS */}
        <div className="rounded-xl p-6" style={{ background: "#fff", border: "1px solid #D1D9E6" }}>
          <h3 className="font-semibold mb-4 text-sm" style={{ color: "#0A0F1A" }}>Volume de OS por Mês</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart id="bar-os-mensal" data={RECEITA_MENSAL} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F4F8" vertical={false} />
              <XAxis dataKey="mes" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#fff", border: "1px solid #D1D9E6", borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="os" name="OS" fill="#1E3A8A" radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden" style={{ background: "#fff", border: "1px solid #D1D9E6" }}>
        <div className="px-5 py-3" style={{ borderBottom: "1px solid #F0F4F8" }}>
          <h3 className="font-semibold text-sm" style={{ color: "#0A0F1A" }}>Histórico Financeiro Consolidado</h3>
        </div>
        <table className="w-full">
          <thead style={{ background: "#F4F6FA" }}>
            <tr>
              {["Período", "Receita", "Despesas", "Lucro Líquido", "OS Concluídas", "Margem"].map((h) => (
                <th key={h} className="text-left px-5 py-3 text-xs font-semibold" style={{ color: "#4B5563" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {RECEITA_MENSAL.map((r, i) => {
              const lucro = r.receita - r.despesas;
              const margem = ((lucro / r.receita) * 100).toFixed(1);
              return (
                <tr key={r.mes} style={{ borderTop: i > 0 ? "1px solid #F0F4F8" : "none" }}>
                  <td className="px-5 py-3 text-sm font-medium" style={{ color: "#0A0F1A" }}>{r.mes}/2026</td>
                  <td className="px-5 py-3 text-sm font-medium" style={{ color: "#22C55E", fontFamily: "var(--font-mono)" }}>
                    R$ {r.receita.toLocaleString("pt-BR")}
                  </td>
                  <td className="px-5 py-3 text-sm" style={{ color: "#EF4444", fontFamily: "var(--font-mono)" }}>
                    R$ {r.despesas.toLocaleString("pt-BR")}
                  </td>
                  <td className="px-5 py-3 text-sm font-semibold" style={{ color: "#0A0F1A", fontFamily: "var(--font-mono)" }}>
                    R$ {lucro.toLocaleString("pt-BR")}
                  </td>
                  <td className="px-5 py-3 text-sm" style={{ color: "#374151" }}>{r.os}</td>
                  <td className="px-5 py-3">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: "#F0FDF4", color: "#22C55E" }}>
                      {margem}%
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Contas a Receber ─────────────────────────────────────────────────────────
interface ContaReceber {
  id: string;
  cliente: string;
  os: string;
  dataVencimento: string;
  valor: number;
  status: "pendente" | "atrasado" | "recebido";
  descricao: string;
}

const CONTAS_RECEBER_MOCK: ContaReceber[] = [
  { id: "cr1", cliente: "João Pereira", os: "OS-2031", dataVencimento: "2026-09-05", valor: 680.00, status: "atrasado", descricao: "Revisão geral + troca de óleo" },
  { id: "cr2", cliente: "Mariana Lima", os: "OS-2034", dataVencimento: "2026-09-10", valor: 1240.00, status: "pendente", descricao: "Troca de correia dentada + tensor" },
  { id: "cr3", cliente: "Carlos Souza", os: "OS-2035", dataVencimento: "2026-09-12", valor: 390.00, status: "pendente", descricao: "Pastilhas de freio dianteiras" },
  { id: "cr4", cliente: "Ana Ferreira", os: "OS-2028", dataVencimento: "2026-08-28", valor: 2100.00, status: "atrasado", descricao: "Motor — troca de velas e bobinas" },
  { id: "cr5", cliente: "Pedro Nunes", os: "OS-2030", dataVencimento: "2026-08-20", valor: 560.00, status: "recebido", descricao: "Alinhamento e balanceamento" },
  { id: "cr6", cliente: "Beatriz Castro", os: "OS-2037", dataVencimento: "2026-09-20", valor: 870.00, status: "pendente", descricao: "Suspensão — amortecedores dianteiros" },
  { id: "cr7", cliente: "Roberto Almeida", os: "OS-2022", dataVencimento: "2026-07-30", valor: 1350.00, status: "recebido", descricao: "Câmbio — revisão completa" },
];

const STATUS_CR = {
  pendente: { label: "Pendente", color: "#F59E0B", bg: "#FFFBEB", icon: <Clock size={12} /> },
  atrasado: { label: "Atrasado", color: "#EF4444", bg: "#FEF2F2", icon: <AlertCircle size={12} /> },
  recebido: { label: "Recebido", color: "#22C55E", bg: "#F0FDF4", icon: <CheckCircle size={12} /> },
};

function ContasReceberPage() {
  const [contas, setContas] = useState<ContaReceber[]>(CONTAS_RECEBER_MOCK);
  const [filtro, setFiltro] = useState<"todos" | "pendente" | "atrasado" | "recebido">("todos");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [nova, setNova] = useState({ cliente: "", os: "", dataVencimento: "", valor: 0, descricao: "" });

  const inputStyle: React.CSSProperties = {
    border: "1.5px solid #D1D9E6", background: "#F4F6FA", color: "#0A0F1A",
    fontFamily: "var(--font-family)", borderRadius: "0.5rem",
    padding: "0.5rem 0.75rem", fontSize: "0.8125rem", outline: "none", width: "100%",
  };

  const filtered = contas.filter((c) => {
    const matchFiltro = filtro === "todos" || c.status === filtro;
    const matchSearch = c.cliente.toLowerCase().includes(search.toLowerCase()) || c.os.toLowerCase().includes(search.toLowerCase());
    return matchFiltro && matchSearch;
  });

  const totalPendente = contas.filter((c) => c.status === "pendente").reduce((s, c) => s + c.valor, 0);
  const totalAtrasado = contas.filter((c) => c.status === "atrasado").reduce((s, c) => s + c.valor, 0);
  const totalRecebido = contas.filter((c) => c.status === "recebido").reduce((s, c) => s + c.valor, 0);

  function marcarRecebido(id: string) {
    setContas(contas.map((c) => c.id === id ? { ...c, status: "recebido" } : c));
  }

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setContas([...contas, { ...nova, id: String(Date.now()), status: "pendente" as const }]);
    setNova({ cliente: "", os: "", dataVencimento: "", valor: 0, descricao: "" });
    setShowForm(false);
  }

  const FILTROS: Array<{ key: typeof filtro; label: string }> = [
    { key: "todos", label: "Todos" },
    { key: "pendente", label: "Pendentes" },
    { key: "atrasado", label: "Atrasados" },
    { key: "recebido", label: "Recebidos" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <PageHeader title="Contas a Receber" subtitle="Controle de valores devidos pelos clientes vinculados a Ordens de Serviço." />
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-white"
          style={{ background: "#2563EB", cursor: "pointer", fontFamily: "var(--font-family)" }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#1D4ED8")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#2563EB")}
        >
          <Plus size={16} /> Nova Conta a Receber
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {[
          { label: "A Receber (Pendente)", value: totalPendente, color: "#F59E0B", bg: "#FFFBEB", border: "#FDE68A" },
          { label: "Em Atraso", value: totalAtrasado, color: "#EF4444", bg: "#FEF2F2", border: "#FECACA" },
          { label: "Recebido (total)", value: totalRecebido, color: "#22C55E", bg: "#F0FDF4", border: "#BBF7D0" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl p-5" style={{ background: s.bg, border: `1px solid ${s.border}` }}>
            <div className="text-xs font-medium mb-2" style={{ color: s.color }}>{s.label}</div>
            <div className="font-bold" style={{ color: "#0A0F1A", fontSize: "1.6rem", fontFamily: "var(--font-mono)" }}>
              R$ {s.value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="rounded-xl p-6 mb-6" style={{ background: "#fff", border: "1px solid #D1D9E6" }}>
          <h3 className="font-semibold mb-4" style={{ color: "#0A0F1A" }}>Registrar Nova Conta a Receber</h3>
          <form onSubmit={handleAdd}>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
              <div>
                <label className="block text-xs mb-1 font-medium" style={{ color: "#4B5563" }}>Cliente *</label>
                <input required value={nova.cliente} onChange={(e) => setNova({ ...nova, cliente: e.target.value })}
                  placeholder="Nome do cliente" style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = "#2563EB")} onBlur={(e) => (e.target.style.borderColor = "#D1D9E6")} />
              </div>
              <div>
                <label className="block text-xs mb-1 font-medium" style={{ color: "#4B5563" }}>Nº da OS</label>
                <input value={nova.os} onChange={(e) => setNova({ ...nova, os: e.target.value })}
                  placeholder="OS-0000" style={{ ...inputStyle, fontFamily: "var(--font-mono)" }}
                  onFocus={(e) => (e.target.style.borderColor = "#2563EB")} onBlur={(e) => (e.target.style.borderColor = "#D1D9E6")} />
              </div>
              <div>
                <label className="block text-xs mb-1 font-medium" style={{ color: "#4B5563" }}>Vencimento *</label>
                <input type="date" required value={nova.dataVencimento} onChange={(e) => setNova({ ...nova, dataVencimento: e.target.value })}
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = "#2563EB")} onBlur={(e) => (e.target.style.borderColor = "#D1D9E6")} />
              </div>
              <div>
                <label className="block text-xs mb-1 font-medium" style={{ color: "#4B5563" }}>Valor (R$) *</label>
                <input type="number" step="0.01" required value={nova.valor || ""} onChange={(e) => setNova({ ...nova, valor: +e.target.value })}
                  placeholder="0,00" style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = "#2563EB")} onBlur={(e) => (e.target.style.borderColor = "#D1D9E6")} />
              </div>
              <div className="lg:col-span-2">
                <label className="block text-xs mb-1 font-medium" style={{ color: "#4B5563" }}>Descrição</label>
                <input value={nova.descricao} onChange={(e) => setNova({ ...nova, descricao: e.target.value })}
                  placeholder="Serviço realizado..." style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = "#2563EB")} onBlur={(e) => (e.target.style.borderColor = "#D1D9E6")} />
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="px-5 py-2.5 rounded-lg font-medium text-white" style={{ background: "#2563EB", cursor: "pointer" }}>
                Salvar
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 rounded-lg font-medium"
                style={{ background: "#F0F4F8", color: "#4B5563", cursor: "pointer" }}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters + search */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex gap-1 rounded-lg p-1" style={{ background: "#F0F4F8" }}>
          {FILTROS.map((f) => (
            <button key={f.key} onClick={() => setFiltro(f.key)}
              className="px-3 py-1.5 rounded-md text-xs font-medium transition-all"
              style={{
                background: filtro === f.key ? "#2563EB" : "transparent",
                color: filtro === f.key ? "#fff" : "#4B5563",
                cursor: "pointer",
              }}>
              {f.label}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar cliente ou OS..."
            className="pl-8 pr-4 py-2 rounded-lg text-sm outline-none"
            style={{ border: "1px solid #D1D9E6", background: "#fff", color: "#0A0F1A", width: 220 }} />
        </div>
        <span className="text-sm ml-auto" style={{ color: "#4B5563" }}>{filtered.length} registro{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #D1D9E6" }}>
        <table className="w-full">
          <thead style={{ background: "#F4F6FA" }}>
            <tr>
              {["Cliente", "OS", "Descrição", "Vencimento", "Valor", "Status", "Ações"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: "#4B5563" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((c, i) => {
              const st = STATUS_CR[c.status];
              return (
                <tr key={c.id} style={{ borderTop: i > 0 ? "1px solid #F0F4F8" : "none", background: "#fff" }}>
                  <td className="px-4 py-3 text-sm font-medium" style={{ color: "#0A0F1A" }}>{c.cliente}</td>
                  <td className="px-4 py-3 text-xs font-semibold" style={{ color: "#2563EB", fontFamily: "var(--font-mono)" }}>{c.os}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: "#4B5563", maxWidth: 200 }}>{c.descricao}</td>
                  <td className="px-4 py-3 text-sm" style={{ color: c.status === "atrasado" ? "#EF4444" : "#374151", fontFamily: "var(--font-mono)" }}>
                    {new Date(c.dataVencimento + "T12:00:00").toLocaleDateString("pt-BR")}
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold" style={{ color: "#0A0F1A", fontFamily: "var(--font-mono)" }}>
                    R$ {c.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium"
                      style={{ background: st.bg, color: st.color }}>
                      {st.icon} {st.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5">
                      {c.status !== "recebido" && (
                        <button onClick={() => marcarRecebido(c.id)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium text-white"
                          style={{ background: "#22C55E", cursor: "pointer" }} title="Marcar como recebido">
                          <CheckCircle size={12} /> Receber
                        </button>
                      )}
                      <button onClick={() => setContas(contas.filter((x) => x.id !== c.id))}
                        className="p-1.5 rounded-md" style={{ background: "#FEF2F2", cursor: "pointer" }} title="Remover">
                        <Trash2 size={12} style={{ color: "#EF4444" }} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="px-5 py-8 text-center text-sm" style={{ color: "#9CA3AF" }}>
                Nenhuma conta encontrada.
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Contas a Prazo ───────────────────────────────────────────────────────────
interface Parcela {
  numero: number;
  vencimento: string;
  valor: number;
  pago: boolean;
}

interface ContaPrazo {
  id: string;
  cliente: string;
  os: string;
  descricao: string;
  valorTotal: number;
  numParcelas: number;
  parcelas: Parcela[];
  dataCriacao: string;
  status: "ativo" | "quitado" | "inadimplente";
}

function gerarParcelas(valorTotal: number, numParcelas: number, dataInicio: string): Parcela[] {
  const valorParcela = valorTotal / numParcelas;
  return Array.from({ length: numParcelas }, (_, i) => {
    const d = new Date(dataInicio + "T12:00:00");
    d.setMonth(d.getMonth() + i + 1);
    return {
      numero: i + 1,
      vencimento: d.toISOString().split("T")[0],
      valor: valorParcela,
      pago: false,
    };
  });
}

const CONTAS_PRAZO_MOCK: ContaPrazo[] = [
  {
    id: "cp1", cliente: "Mariana Lima", os: "OS-2034", descricao: "Troca de correia dentada + tensor",
    valorTotal: 1240.00, numParcelas: 4, dataCriacao: "2026-08-01", status: "ativo",
    parcelas: [
      { numero: 1, vencimento: "2026-09-01", valor: 310.00, pago: true },
      { numero: 2, vencimento: "2026-10-01", valor: 310.00, pago: false },
      { numero: 3, vencimento: "2026-11-01", valor: 310.00, pago: false },
      { numero: 4, vencimento: "2026-12-01", valor: 310.00, pago: false },
    ],
  },
  {
    id: "cp2", cliente: "Pedro Nunes", os: "OS-2039", descricao: "Suspensão traseira completa",
    valorTotal: 2400.00, numParcelas: 6, dataCriacao: "2026-07-15", status: "inadimplente",
    parcelas: [
      { numero: 1, vencimento: "2026-08-15", valor: 400.00, pago: true },
      { numero: 2, vencimento: "2026-09-15", valor: 400.00, pago: false },
      { numero: 3, vencimento: "2026-10-15", valor: 400.00, pago: false },
      { numero: 4, vencimento: "2026-11-15", valor: 400.00, pago: false },
      { numero: 5, vencimento: "2026-12-15", valor: 400.00, pago: false },
      { numero: 6, vencimento: "2027-01-15", valor: 400.00, pago: false },
    ],
  },
  {
    id: "cp3", cliente: "Beatriz Castro", os: "OS-2025", descricao: "Motor — revisão completa",
    valorTotal: 3600.00, numParcelas: 3, dataCriacao: "2026-06-01", status: "quitado",
    parcelas: [
      { numero: 1, vencimento: "2026-07-01", valor: 1200.00, pago: true },
      { numero: 2, vencimento: "2026-08-01", valor: 1200.00, pago: true },
      { numero: 3, vencimento: "2026-09-01", valor: 1200.00, pago: true },
    ],
  },
];

const STATUS_CP = {
  ativo: { label: "Ativo", color: "#2563EB", bg: "#EFF6FF" },
  quitado: { label: "Quitado", color: "#22C55E", bg: "#F0FDF4" },
  inadimplente: { label: "Inadimplente", color: "#EF4444", bg: "#FEF2F2" },
};

function ContasPrazoPage() {
  const [contas, setContas] = useState<ContaPrazo[]>(CONTAS_PRAZO_MOCK);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [filtro, setFiltro] = useState<"todos" | "ativo" | "inadimplente" | "quitado">("todos");
  const [nova, setNova] = useState({ cliente: "", os: "", descricao: "", valorTotal: 0, numParcelas: 2, dataInicio: "" });

  const inputStyle: React.CSSProperties = {
    border: "1.5px solid #D1D9E6", background: "#F4F6FA", color: "#0A0F1A",
    fontFamily: "var(--font-family)", borderRadius: "0.5rem",
    padding: "0.5rem 0.75rem", fontSize: "0.8125rem", outline: "none", width: "100%",
  };

  const filtered = contas.filter((c) => filtro === "todos" || c.status === filtro);

  const totalEmAberto = contas
    .filter((c) => c.status !== "quitado")
    .reduce((s, c) => s + c.parcelas.filter((p) => !p.pago).reduce((ps, p) => ps + p.valor, 0), 0);

  const totalInadimplente = contas
    .filter((c) => c.status === "inadimplente")
    .reduce((s, c) => s + c.parcelas.filter((p) => !p.pago).reduce((ps, p) => ps + p.valor, 0), 0);

  const totalQuitado = contas
    .filter((c) => c.status === "quitado")
    .reduce((s, c) => s + c.valorTotal, 0);

  function pagarParcela(contaId: string, parcelaNum: number) {
    setContas(contas.map((c) => {
      if (c.id !== contaId) return c;
      const novasParcelas = c.parcelas.map((p) => p.numero === parcelaNum ? { ...p, pago: true } : p);
      const todasPagas = novasParcelas.every((p) => p.pago);
      return { ...c, parcelas: novasParcelas, status: todasPagas ? "quitado" : c.status };
    }));
  }

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!nova.dataInicio) return;
    const parcelas = gerarParcelas(nova.valorTotal, nova.numParcelas, nova.dataInicio);
    setContas([...contas, {
      id: String(Date.now()), ...nova,
      parcelas, status: "ativo" as const, dataCriacao: nova.dataInicio,
    }]);
    setNova({ cliente: "", os: "", descricao: "", valorTotal: 0, numParcelas: 2, dataInicio: "" });
    setShowForm(false);
  }

  const FILTROS: Array<{ key: typeof filtro; label: string }> = [
    { key: "todos", label: "Todos" },
    { key: "ativo", label: "Ativos" },
    { key: "inadimplente", label: "Inadimplentes" },
    { key: "quitado", label: "Quitados" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <PageHeader title="Contas a Prazo" subtitle="Gestão de parcelamentos e acordos de pagamento a prazo com clientes." />
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-white"
          style={{ background: "#2563EB", cursor: "pointer", fontFamily: "var(--font-family)" }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#1D4ED8")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#2563EB")}
        >
          <Plus size={16} /> Novo Parcelamento
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total em Aberto", value: totalEmAberto, color: "#2563EB", bg: "#EFF6FF", border: "#BFDBFE" },
          { label: "Inadimplência", value: totalInadimplente, color: "#EF4444", bg: "#FEF2F2", border: "#FECACA" },
          { label: "Total Quitado", value: totalQuitado, color: "#22C55E", bg: "#F0FDF4", border: "#BBF7D0" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl p-5" style={{ background: s.bg, border: `1px solid ${s.border}` }}>
            <div className="text-xs font-medium mb-2" style={{ color: s.color }}>{s.label}</div>
            <div className="font-bold" style={{ color: "#0A0F1A", fontSize: "1.6rem", fontFamily: "var(--font-mono)" }}>
              R$ {s.value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="rounded-xl p-6 mb-6" style={{ background: "#fff", border: "1px solid #D1D9E6" }}>
          <h3 className="font-semibold mb-4" style={{ color: "#0A0F1A" }}>Registrar Novo Parcelamento</h3>
          <form onSubmit={handleAdd}>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
              <div>
                <label className="block text-xs mb-1 font-medium" style={{ color: "#4B5563" }}>Cliente *</label>
                <input required value={nova.cliente} onChange={(e) => setNova({ ...nova, cliente: e.target.value })}
                  placeholder="Nome do cliente" style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = "#2563EB")} onBlur={(e) => (e.target.style.borderColor = "#D1D9E6")} />
              </div>
              <div>
                <label className="block text-xs mb-1 font-medium" style={{ color: "#4B5563" }}>Nº da OS</label>
                <input value={nova.os} onChange={(e) => setNova({ ...nova, os: e.target.value })}
                  placeholder="OS-0000" style={{ ...inputStyle, fontFamily: "var(--font-mono)" }}
                  onFocus={(e) => (e.target.style.borderColor = "#2563EB")} onBlur={(e) => (e.target.style.borderColor = "#D1D9E6")} />
              </div>
              <div>
                <label className="block text-xs mb-1 font-medium" style={{ color: "#4B5563" }}>Data de Início *</label>
                <input type="date" required value={nova.dataInicio} onChange={(e) => setNova({ ...nova, dataInicio: e.target.value })}
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = "#2563EB")} onBlur={(e) => (e.target.style.borderColor = "#D1D9E6")} />
              </div>
              <div>
                <label className="block text-xs mb-1 font-medium" style={{ color: "#4B5563" }}>Valor Total (R$) *</label>
                <input type="number" step="0.01" required value={nova.valorTotal || ""}
                  onChange={(e) => setNova({ ...nova, valorTotal: +e.target.value })}
                  placeholder="0,00" style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = "#2563EB")} onBlur={(e) => (e.target.style.borderColor = "#D1D9E6")} />
              </div>
              <div>
                <label className="block text-xs mb-1 font-medium" style={{ color: "#4B5563" }}>Nº de Parcelas *</label>
                <select value={nova.numParcelas} onChange={(e) => setNova({ ...nova, numParcelas: +e.target.value })}
                  style={{ ...inputStyle, cursor: "pointer" }}>
                  {[2, 3, 4, 5, 6, 8, 10, 12].map((n) => <option key={n} value={n}>{n}x</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs mb-1 font-medium" style={{ color: "#4B5563" }}>Valor por Parcela</label>
                <div className="px-3 py-2 rounded-lg text-sm font-semibold" style={{ background: "#F0F4F8", color: "#2563EB", fontFamily: "var(--font-mono)" }}>
                  {nova.valorTotal && nova.numParcelas
                    ? `R$ ${(nova.valorTotal / nova.numParcelas).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
                    : "—"}
                </div>
              </div>
              <div className="lg:col-span-3">
                <label className="block text-xs mb-1 font-medium" style={{ color: "#4B5563" }}>Descrição</label>
                <input value={nova.descricao} onChange={(e) => setNova({ ...nova, descricao: e.target.value })}
                  placeholder="Serviço realizado..." style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = "#2563EB")} onBlur={(e) => (e.target.style.borderColor = "#D1D9E6")} />
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="px-5 py-2.5 rounded-lg font-medium text-white" style={{ background: "#2563EB", cursor: "pointer" }}>
                Criar Parcelamento
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 rounded-lg font-medium"
                style={{ background: "#F0F4F8", color: "#4B5563", cursor: "pointer" }}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-1 rounded-lg p-1 mb-4 w-fit" style={{ background: "#F0F4F8" }}>
        {FILTROS.map((f) => (
          <button key={f.key} onClick={() => setFiltro(f.key)}
            className="px-3 py-1.5 rounded-md text-xs font-medium transition-all"
            style={{ background: filtro === f.key ? "#2563EB" : "transparent", color: filtro === f.key ? "#fff" : "#4B5563", cursor: "pointer" }}>
            {f.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((c) => {
          const expanded = expandedId === c.id;
          const pagas = c.parcelas.filter((p) => p.pago).length;
          const valorPago = c.parcelas.filter((p) => p.pago).reduce((s, p) => s + p.valor, 0);
          const valorRestante = c.valorTotal - valorPago;
          const st = STATUS_CP[c.status];
          const progresso = (pagas / c.numParcelas) * 100;

          return (
            <div key={c.id} className="rounded-xl overflow-hidden" style={{ background: "#fff", border: "1px solid #D1D9E6" }}>
              {/* Header row */}
              <div
                className="flex items-center gap-4 px-5 py-4 cursor-pointer"
                style={{ borderBottom: expanded ? "1px solid #F0F4F8" : "none" }}
                onClick={() => setExpandedId(expanded ? null : c.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm" style={{ color: "#0A0F1A" }}>{c.cliente}</span>
                    <span className="text-xs font-semibold" style={{ color: "#2563EB", fontFamily: "var(--font-mono)" }}>{c.os}</span>
                    <span className="inline-flex items-center text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ background: st.bg, color: st.color }}>{st.label}</span>
                  </div>
                  <div className="text-xs" style={{ color: "#4B5563" }}>{c.descricao}</div>
                </div>

                <div className="flex items-center gap-6 shrink-0">
                  <div className="text-right">
                    <div className="text-xs" style={{ color: "#4B5563" }}>Parcelas</div>
                    <div className="text-sm font-semibold" style={{ color: "#0A0F1A" }}>{pagas}/{c.numParcelas}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs" style={{ color: "#4B5563" }}>Valor Total</div>
                    <div className="text-sm font-semibold" style={{ color: "#0A0F1A", fontFamily: "var(--font-mono)" }}>
                      R$ {c.valorTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs" style={{ color: "#4B5563" }}>Restante</div>
                    <div className="text-sm font-semibold" style={{ color: c.status === "quitado" ? "#22C55E" : "#EF4444", fontFamily: "var(--font-mono)" }}>
                      R$ {valorRestante.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                  <div style={{ width: 80 }}>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "#F0F4F8" }}>
                      <div className="h-full rounded-full transition-all" style={{ width: `${progresso}%`, background: c.status === "quitado" ? "#22C55E" : "#2563EB" }} />
                    </div>
                    <div className="text-xs mt-1 text-right" style={{ color: "#4B5563" }}>{Math.round(progresso)}%</div>
                  </div>
                  <ChevronRight size={16} style={{ color: "#9CA3AF", transform: expanded ? "rotate(90deg)" : "none", transition: "transform 0.2s" }} />
                </div>
              </div>

              {/* Expanded parcelas */}
              {expanded && (
                <div className="px-5 py-4">
                  <div className="text-xs font-semibold mb-3" style={{ color: "#4B5563" }}>DETALHAMENTO DAS PARCELAS</div>
                  <div className="grid grid-cols-1 gap-2">
                    {c.parcelas.map((p) => (
                      <div key={p.numero} className="flex items-center gap-4 px-4 py-3 rounded-lg"
                        style={{ background: p.pago ? "#F0FDF4" : "#F8FAFC", border: `1px solid ${p.pago ? "#BBF7D0" : "#E2E8F0"}` }}>
                        <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold"
                          style={{ background: p.pago ? "#22C55E" : "#E2E8F0", color: p.pago ? "#fff" : "#64748B" }}>
                          {p.numero}
                        </div>
                        <div className="flex-1">
                          <span className="text-xs" style={{ color: "#4B5563" }}>
                            Vencimento: <span style={{ fontFamily: "var(--font-mono)" }}>
                              {new Date(p.vencimento + "T12:00:00").toLocaleDateString("pt-BR")}
                            </span>
                          </span>
                        </div>
                        <div className="font-semibold text-sm" style={{ color: "#0A0F1A", fontFamily: "var(--font-mono)" }}>
                          R$ {p.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </div>
                        {p.pago ? (
                          <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium"
                            style={{ background: "#F0FDF4", color: "#22C55E" }}>
                            <CheckCircle size={11} /> Pago
                          </span>
                        ) : (
                          <button onClick={() => pagarParcela(c.id, p.numero)}
                            className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg font-medium text-white"
                            style={{ background: "#2563EB", cursor: "pointer" }}>
                            <DollarSign size={11} /> Registrar Pagto.
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="rounded-xl py-12 text-center" style={{ background: "#fff", border: "1px solid #D1D9E6" }}>
            <Layers size={32} style={{ color: "#D1D9E6", margin: "0 auto 8px" }} />
            <p className="text-sm" style={{ color: "#9CA3AF" }}>Nenhum parcelamento encontrado.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function UsuariosPage() {
  const [usuarios, setUsuarios] = useState(USUARIOS_MOCK);
  const [showForm, setShowForm] = useState(false);
  const [newUser, setNewUser] = useState({ nome: "", email: "", perfil: "atendente" as Usuario["perfil"] });

  const inputStyle = {
    border: "1.5px solid #D1D9E6",
    background: "#F4F6FA",
    color: "#0A0F1A",
    fontFamily: "var(--font-family)",
    borderRadius: "0.5rem",
    padding: "0.625rem 0.875rem",
    fontSize: "0.875rem",
    outline: "none",
    width: "100%",
  };

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setUsuarios([...usuarios, { ...newUser, id: String(Date.now()), status: "ativo", desde: "Jun/2026" }]);
    setNewUser({ nome: "", email: "", perfil: "atendente" });
    setShowForm(false);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <PageHeader title="Gestão de Usuários" subtitle="Cadastre funcionários e defina níveis de acesso ao sistema." />
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-white"
          style={{ background: "#2563EB", cursor: "pointer", fontFamily: "var(--font-family)" }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#1D4ED8")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#2563EB")}
        >
          <Plus size={16} /> Novo Usuário
        </button>
      </div>

      {showForm && (
        <div className="rounded-xl p-6 mb-6" style={{ background: "#fff", border: "1px solid #D1D9E6" }}>
          <h3 className="font-semibold mb-5" style={{ color: "#0A0F1A" }}>Cadastrar Funcionário</h3>
          <form onSubmit={handleAdd} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm mb-1.5 font-medium" style={{ color: "#374151" }}>Nome Completo *</label>
              <input required value={newUser.nome} onChange={(e) => setNewUser({ ...newUser, nome: e.target.value })}
                placeholder="João da Silva" style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "#2563EB")} onBlur={(e) => (e.target.style.borderColor = "#D1D9E6")} />
            </div>
            <div>
              <label className="block text-sm mb-1.5 font-medium" style={{ color: "#374151" }}>E-mail *</label>
              <input type="email" required value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                placeholder="joao@erp.com.br" style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "#2563EB")} onBlur={(e) => (e.target.style.borderColor = "#D1D9E6")} />
            </div>
            <div>
              <label className="block text-sm mb-1.5 font-medium" style={{ color: "#374151" }}>Perfil de Acesso *</label>
              <select value={newUser.perfil} onChange={(e) => setNewUser({ ...newUser, perfil: e.target.value as Usuario["perfil"] })}
                style={{ ...inputStyle, cursor: "pointer" }}>
                <option value="admin">Administrador</option>
                <option value="atendente">Atendente</option>
                <option value="mecanico">Mecânico</option>
              </select>
            </div>
            <div className="lg:col-span-3 flex gap-3">
              <button type="submit" className="px-5 py-2.5 rounded-lg font-medium text-white"
                style={{ background: "#2563EB", cursor: "pointer" }}>
                Criar Usuário
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 rounded-lg font-medium"
                style={{ background: "#F0F4F8", color: "#4B5563", cursor: "pointer" }}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #D1D9E6" }}>
        <table className="w-full">
          <thead style={{ background: "#F4F6FA" }}>
            <tr>
              {["Usuário", "E-mail", "Perfil / Acesso", "Status", "Membro desde", "Ações"].map((h) => (
                <th key={h} className="text-left px-5 py-3 text-xs font-semibold" style={{ color: "#4B5563" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u, i) => {
              const perfil = PERFIL_CONFIG[u.perfil];
              return (
                <tr key={u.id} style={{ borderTop: i > 0 ? "1px solid #F0F4F8" : "none", background: "#fff" }}>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{ background: "#F0F4F8", color: "#374151" }}>
                        {u.nome.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </div>
                      <span className="text-sm font-medium" style={{ color: "#0A0F1A" }}>{u.nome}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm" style={{ color: "#4B5563" }}>{u.email}</td>
                  <td className="px-5 py-3">
                    <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium"
                      style={{ background: perfil.bg, color: perfil.color }}>
                      {perfil.icon} {perfil.label}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-xs px-2.5 py-1 rounded-full font-medium"
                      style={{ background: u.status === "ativo" ? "#F0FDF4" : "#F4F6FA", color: u.status === "ativo" ? "#22C55E" : "#9CA3AF" }}>
                      {u.status === "ativo" ? "● Ativo" : "○ Inativo"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-sm" style={{ color: "#4B5563" }}>{u.desde}</td>
                  <td className="px-5 py-3">
                    <div className="flex gap-1.5">
                      <button className="p-1.5 rounded-md" style={{ background: "#F0F4F8", cursor: "pointer" }} title="Editar">
                        <Edit2 size={12} style={{ color: "#4B5563" }} />
                      </button>
                      <button
                        onClick={() => setUsuarios(usuarios.filter((x) => x.id !== u.id))}
                        className="p-1.5 rounded-md" style={{ background: "#FEF2F2", cursor: "pointer" }} title="Remover">
                        <Trash2 size={12} style={{ color: "#EF4444" }} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

 export function AdminView({ currentPage }: AdminViewProps) {
  return (
    <div className="flex-1 overflow-auto p-6" style={{ fontFamily: "var(--font-family)" }}>
      {currentPage === "financeiro" && <FinanceiroPage />}
      {currentPage === "contas_receber" && <ContasReceberPage />}
      {currentPage === "contas_prazo" && <ContasPrazoPage />}
      {currentPage === "usuarios" && <UsuariosPage />}
      {currentPage === "profissionais" && <ProfissionaisPage />}
      {currentPage === "catalogo_servicos" && <CatalogoServicosPage />}
      {currentPage === "modelos" && <ModelosPage />}
    </div>
  );
}