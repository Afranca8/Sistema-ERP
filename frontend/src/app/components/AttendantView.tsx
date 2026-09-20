import { useState } from "react";
import {
  Plus, Users, FileText, CreditCard, Search, Phone, Car, CheckCircle, Clock,
  XCircle, Printer, ChevronRight, Trash2, MapPin, Gauge,
} from "lucide-react";
import { SERVICOS_MOCK, type Servico } from "./CatalogoServicosPage";

type Page = "dashboard" | "clientes" | "ordens" | "pagamento";

interface AttendantViewProps {
  currentPage: Page;
  onPageChange: (page: string) => void;
}

const MOCK_OS = [
  { id: "OS-2041", cliente: "Marcos Oliveira", placa: "ABC-1234", modelo: "Civic EXL 2021", problema: "Revisão completa + troca de óleo", status: "aprovado", total: 890.0, data: "10/06/2026" },
  { id: "OS-2042", cliente: "Fernanda Lima", placa: "XYZ-5678", modelo: "Corolla XEI 2020", problema: "Barulho no freio dianteiro", status: "aguardando", total: 320.0, data: "10/06/2026" },
  { id: "OS-2043", cliente: "Paulo Siqueira", placa: "DEF-9012", modelo: "HB20 Comfort 2022", problema: "Troca de correia dentada", status: "aprovado", total: 650.0, data: "09/06/2026" },
  { id: "OS-2044", cliente: "Aline Nunes", placa: "GHI-3456", modelo: "Onix Plus 2023", problema: "Luz do motor acesa", status: "rejeitado", total: 450.0, data: "09/06/2026" },
];

const STATUS_CONFIG = {
  aprovado: { label: "Aprovado", color: "#22C55E", bg: "#F0FDF4", icon: <CheckCircle size={13} /> },
  aguardando: { label: "Aguardando Aprovação", color: "#F59E0B", bg: "#FFFBEB", icon: <Clock size={13} /> },
  rejeitado: { label: "Rejeitado", color: "#EF4444", bg: "#FEF2F2", icon: <XCircle size={13} /> },
};

function PageHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-6">
      <h1 style={{ color: "#0A0F1A", fontFamily: "var(--font-family)", fontWeight: 600, fontSize: "1.25rem" }}>{title}</h1>
      <p className="text-sm mt-0.5" style={{ color: "#4B5563" }}>{subtitle}</p>
    </div>
  );
}

function StatCard({ label, value, delta, color }: { label: string; value: string; delta?: string; color: string }) {
  return (
    <div className="rounded-xl p-5" style={{ background: "#fff", border: "1px solid #D1D9E6" }}>
      <div className="text-sm mb-2" style={{ color: "#4B5563", fontFamily: "var(--font-family)" }}>{label}</div>
      <div className="font-semibold" style={{ color: "#0A0F1A", fontSize: "1.6rem", fontFamily: "var(--font-family)" }}>{value}</div>
      {delta && <div className="text-xs mt-1" style={{ color }}>{delta}</div>}
    </div>
  );
}

function Dashboard({ onPageChange }: { onPageChange: (p: string) => void }) {
  return (
    <div>
      <PageHeader title="Dashboard — Atendente" subtitle="Bem-vindo de volta, Juliana. Aqui está o resumo do dia." />

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatCard label="OS Abertas Hoje" value="7" delta="↑ 2 vs ontem" color="#22C55E" />
        <StatCard label="Aguardando Aprovação" value="3" delta="Ação necessária" color="#F59E0B" />
        <StatCard label="Clientes Atendidos" value="12" delta="Hoje, 10/06" color="#3B82F6" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        <button
          onClick={() => onPageChange("clientes")}
          className="flex items-center gap-4 p-5 rounded-xl transition-all text-left group"
          style={{ background: "#fff", border: "2px dashed #D1D9E6" }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.border = "2px dashed #2563EB")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.border = "2px dashed #D1D9E6")}
        >
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "#EFF6FF" }}>
            <Users size={22} style={{ color: "#2563EB" }} />
          </div>
          <div>
            <div className="font-medium" style={{ color: "#0A0F1A", fontFamily: "var(--font-family)" }}>Cadastrar Cliente</div>
            <div className="text-sm mt-0.5" style={{ color: "#4B5563" }}>Novo cliente e vincular veículo</div>
          </div>
          <ChevronRight size={18} className="ml-auto" style={{ color: "#D1D9E6" }} />
        </button>

        <button
          onClick={() => onPageChange("ordens")}
          className="flex items-center gap-4 p-5 rounded-xl transition-all text-left"
          style={{ background: "#2563EB", border: "2px solid #2563EB" }}
        >
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.2)" }}>
            <FileText size={22} color="#fff" />
          </div>
          <div>
            <div className="font-medium text-white" style={{ fontFamily: "var(--font-family)" }}>Abrir Nova OS</div>
            <div className="text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.75)" }}>Criar ordem de serviço</div>
          </div>
          <ChevronRight size={18} className="ml-auto text-white opacity-70" />
        </button>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 style={{ color: "#0A0F1A", fontFamily: "var(--font-family)", fontWeight: 600, fontSize: "1rem" }}>
            Ordens Recentes
          </h3>
          <button
            onClick={() => onPageChange("ordens")}
            className="text-sm transition-colors"
            style={{ color: "#2563EB", fontFamily: "var(--font-family)" }}
          >
            Ver todas →
          </button>
        </div>
        <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #D1D9E6" }}>
          <table className="w-full">
            <thead style={{ background: "#F4F6FA" }}>
              <tr>
                {["OS", "Cliente", "Veículo", "Placa", "Status", "Total"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: "#4B5563" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MOCK_OS.slice(0, 4).map((os, i) => {
                const s = STATUS_CONFIG[os.status as keyof typeof STATUS_CONFIG];
                return (
                  <tr key={os.id} style={{ borderTop: i > 0 ? "1px solid #F0F4F8" : "none", background: "#fff" }}>
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium" style={{ color: "#0A0F1A", fontFamily: "var(--font-mono)" }}>
                        {os.id}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm" style={{ color: "#374151" }}>{os.cliente}</td>
                    <td className="px-4 py-3 text-sm" style={{ color: "#4B5563" }}>{os.modelo}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-1 rounded font-medium" style={{ background: "#F0F4F8", color: "#374151", fontFamily: "var(--font-mono)" }}>
                        {os.placa}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: s.bg, color: s.color }}>
                        {s.icon} {s.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium" style={{ color: "#0A0F1A", fontFamily: "var(--font-mono)" }}>
                      R$ {os.total.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

interface Cliente {
  id: string;
  nome: string;
  telefone: string;
  cpf: string;
  email: string;
  endereco: string;
}

interface Veiculo {
  id: string;
  clienteId: string;
  placa: string;
  marca: string;
  modelo: string;
  ano: string;
  cor: string;
  km: string;
}

const CLIENTES_INICIAIS: Cliente[] = [
  { id: "c1", nome: "Marcos Oliveira", telefone: "(11) 98765-4321", cpf: "123.456.789-00", email: "marcos@email.com", endereco: "Rua das Flores, 123 — São Paulo, SP" },
  { id: "c2", nome: "Fernanda Lima", telefone: "(11) 91234-5678", cpf: "987.654.321-00", email: "fernanda@email.com", endereco: "Av. Paulista, 456 — São Paulo, SP" },
  { id: "c3", nome: "Paulo Siqueira", telefone: "(21) 99887-6655", cpf: "456.789.123-00", email: "paulo@email.com", endereco: "Rua do Catete, 789 — Rio de Janeiro, RJ" },
];

const VEICULOS_INICIAIS: Veiculo[] = [
  { id: "v1", clienteId: "c1", placa: "ABC-1234", marca: "Honda", modelo: "Civic EXL", ano: "2021", cor: "Prata", km: "92.400" },
  { id: "v2", clienteId: "c1", placa: "MNO-7890", marca: "Honda", modelo: "Fit LX", ano: "2019", cor: "Branco", km: "54.200" },
  { id: "v3", clienteId: "c2", placa: "XYZ-5678", marca: "Toyota", modelo: "Corolla XEI", ano: "2020", cor: "Preto", km: "68.100" },
  { id: "v4", clienteId: "c3", placa: "DEF-9012", marca: "Hyundai", modelo: "HB20 Comfort", ano: "2022", cor: "Vermelho", km: "31.500" },
];

function ClientesPage() {
  const [aba, setAba] = useState<"clientes" | "veiculos">("clientes");
  const [clientes, setClientes] = useState<Cliente[]>(CLIENTES_INICIAIS);
  const [veiculos, setVeiculos] = useState<Veiculo[]>(VEICULOS_INICIAIS);
  const [searchCliente, setSearchCliente] = useState("");
  const [searchVeiculo, setSearchVeiculo] = useState("");

  // Formulário cliente
  const [cNome, setCNome] = useState("");
  const [cTel, setCTel] = useState("");
  const [cCpf, setCCpf] = useState("");
  const [cEmail, setCEmail] = useState("");
  const [cEndereco, setCEndereco] = useState("");
  const [cSaved, setCSaved] = useState(false);

  // Formulário veículo
  const [vClienteId, setVClienteId] = useState("");
  const [vPlaca, setVPlaca] = useState("");
  const [vMarca, setVMarca] = useState("");
  const [vModelo, setVModelo] = useState("");
  const [vAno, setVAno] = useState("");
  const [vCor, setVCor] = useState("");
  const [vKm, setVKm] = useState("");
  const [vSaved, setVSaved] = useState(false);
  const [vError, setVError] = useState("");

  const inputStyle: React.CSSProperties = {
    border: "1.5px solid #D1D9E6",
    background: "#F4F6FA",
    color: "#0A0F1A",
    fontFamily: "var(--font-family)",
    borderRadius: "0.5rem",
    padding: "0.625rem 0.875rem",
    fontSize: "0.875rem",
    outline: "none",
    width: "100%",
    transition: "border-color 0.15s",
  };

  function handleSaveCliente(e: React.FormEvent) {
    e.preventDefault();
    const novo: Cliente = { id: `c${Date.now()}`, nome: cNome, telefone: cTel, cpf: cCpf, email: cEmail, endereco: cEndereco };
    setClientes([...clientes, novo]);
    setCSaved(true);
    setTimeout(() => { setCSaved(false); setCNome(""); setCTel(""); setCCpf(""); setCEmail(""); setCEndereco(""); }, 2000);
  }

  function handleSaveVeiculo(e: React.FormEvent) {
    e.preventDefault();
    setVError("");
    if (!vClienteId) { setVError("Selecione um cliente para vincular o veículo."); return; }
    const novo: Veiculo = { id: `v${Date.now()}`, clienteId: vClienteId, placa: vPlaca, marca: vMarca, modelo: vModelo, ano: vAno, cor: vCor, km: vKm };
    setVeiculos([...veiculos, novo]);
    setVSaved(true);
    setTimeout(() => { setVSaved(false); setVClienteId(""); setVPlaca(""); setVMarca(""); setVModelo(""); setVAno(""); setVCor(""); setVKm(""); }, 2000);
  }

  const clientesFiltrados = clientes.filter((c) =>
    c.nome.toLowerCase().includes(searchCliente.toLowerCase()) ||
    c.telefone.includes(searchCliente)
  );

  const veiculosFiltrados = veiculos.filter((v) => {
    const cliente = clientes.find((c) => c.id === v.clienteId);
    return (
      v.placa.toLowerCase().includes(searchVeiculo.toLowerCase()) ||
      v.modelo.toLowerCase().includes(searchVeiculo.toLowerCase()) ||
      cliente?.nome.toLowerCase().includes(searchVeiculo.toLowerCase())
    );
  });

  const tabStyle = (active: boolean): React.CSSProperties => ({
    padding: "0.625rem 1.25rem",
    borderRadius: "0.5rem",
    fontSize: "0.875rem",
    fontWeight: active ? 600 : 400,
    cursor: "pointer",
    border: "none",
    background: active ? "#2563EB" : "transparent",
    color: active ? "#fff" : "#4B5563",
    fontFamily: "var(--font-family)",
    transition: "all 0.15s",
  });

  return (
    <div>
      <PageHeader title="Clientes & Veículos" subtitle="Cadastre clientes e vincule veículos a eles separadamente." />

      {/* Abas */}
      <div className="flex items-center gap-2 mb-6 p-1 rounded-xl w-fit" style={{ background: "#D1D9E6" }}>
        <button style={tabStyle(aba === "clientes")} onClick={() => setAba("clientes")}>
          <span className="flex items-center gap-2"><Users size={15} /> Clientes</span>
        </button>
        <button style={tabStyle(aba === "veiculos")} onClick={() => setAba("veiculos")}>
          <span className="flex items-center gap-2"><Car size={15} /> Veículos</span>
        </button>
      </div>

      {/* ── ABA CLIENTES ── */}
      {aba === "clientes" && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Formulário */}
          <div className="lg:col-span-2 rounded-xl p-6" style={{ background: "#fff", border: "1px solid #D1D9E6" }}>
            <h3 className="mb-5 font-semibold" style={{ color: "#0A0F1A" }}>Novo Cliente</h3>
            <form onSubmit={handleSaveCliente} className="space-y-4">
              <div>
                <label className="block text-sm mb-1.5 font-medium" style={{ color: "#374151" }}>Nome Completo *</label>
                <input value={cNome} onChange={(e) => setCNome(e.target.value)} placeholder="João da Silva" required style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = "#2563EB")} onBlur={(e) => (e.target.style.borderColor = "#D1D9E6")} />
              </div>
              <div>
                <label className="block text-sm mb-1.5 font-medium" style={{ color: "#374151" }}>Telefone *</label>
                <div className="relative">
                  <Phone size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }} />
                  <input value={cTel} onChange={(e) => setCTel(e.target.value)} placeholder="(11) 99999-9999" required
                    style={{ ...inputStyle, paddingLeft: "2.25rem" }}
                    onFocus={(e) => (e.target.style.borderColor = "#2563EB")} onBlur={(e) => (e.target.style.borderColor = "#D1D9E6")} />
                </div>
              </div>
              <div>
                <label className="block text-sm mb-1.5 font-medium" style={{ color: "#374151" }}>CPF</label>
                <input value={cCpf} onChange={(e) => setCCpf(e.target.value)} placeholder="000.000.000-00" style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = "#2563EB")} onBlur={(e) => (e.target.style.borderColor = "#D1D9E6")} />
              </div>
              <div>
                <label className="block text-sm mb-1.5 font-medium" style={{ color: "#374151" }}>E-mail</label>
                <input type="email" value={cEmail} onChange={(e) => setCEmail(e.target.value)} placeholder="joao@email.com" style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = "#2563EB")} onBlur={(e) => (e.target.style.borderColor = "#D1D9E6")} />
              </div>
              <div>
                <label className="block text-sm mb-1.5 font-medium" style={{ color: "#374151" }}>Endereço</label>
                <div className="relative">
                  <MapPin size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }} />
                  <input value={cEndereco} onChange={(e) => setCEndereco(e.target.value)}
                    placeholder="Rua, número — Cidade, UF"
                    style={{ ...inputStyle, paddingLeft: "2.25rem" }}
                    onFocus={(e) => (e.target.style.borderColor = "#2563EB")} onBlur={(e) => (e.target.style.borderColor = "#D1D9E6")} />
                </div>
              </div>
              <button type="submit" className="w-full py-3 rounded-lg font-medium text-white transition-colors"
                style={{ background: cSaved ? "#22C55E" : "#2563EB", cursor: "pointer", fontFamily: "var(--font-family)" }}
                onMouseEnter={(e) => !cSaved && ((e.currentTarget as HTMLElement).style.background = "#1D4ED8")}
                onMouseLeave={(e) => !cSaved && ((e.currentTarget as HTMLElement).style.background = "#2563EB")}
              >
                {cSaved ? "✓ Cliente Cadastrado!" : "Salvar Cliente"}
              </button>
            </form>
          </div>

          {/* Lista de clientes */}
          <div className="lg:col-span-3 rounded-xl overflow-hidden" style={{ background: "#fff", border: "1px solid #D1D9E6" }}>
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid #F0F4F8" }}>
              <span className="font-semibold text-sm" style={{ color: "#0A0F1A" }}>
                {clientesFiltrados.length} cliente{clientesFiltrados.length !== 1 ? "s" : ""} cadastrado{clientesFiltrados.length !== 1 ? "s" : ""}
              </span>
              <div className="relative">
                <Search size={13} style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }} />
                <input value={searchCliente} onChange={(e) => setSearchCliente(e.target.value)} placeholder="Buscar..."
                  className="pl-7 pr-3 py-1.5 rounded-lg text-sm outline-none"
                  style={{ border: "1px solid #D1D9E6", background: "#F4F6FA", color: "#0A0F1A", width: 150 }} />
              </div>
            </div>
            <table className="w-full">
              <thead style={{ background: "#F4F6FA" }}>
                <tr>
                  {["Nome", "Telefone", "CPF", "Endereço", "Veículos"].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold" style={{ color: "#4B5563" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {clientesFiltrados.map((c, i) => {
                  const qtdVeiculos = veiculos.filter((v) => v.clienteId === c.id).length;
                  return (
                    <tr key={c.id} style={{ borderTop: i > 0 ? "1px solid #F0F4F8" : "none" }}>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                            style={{ background: "#F0F4F8", color: "#374151" }}>
                            {c.nome.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                          </div>
                          <div>
                            <div className="text-sm font-medium" style={{ color: "#0A0F1A" }}>{c.nome}</div>
                            <div className="text-xs" style={{ color: "#9CA3AF" }}>{c.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-sm" style={{ color: "#374151" }}>{c.telefone}</td>
                      <td className="px-5 py-3 text-xs" style={{ color: "#4B5563", fontFamily: "var(--font-mono)" }}>{c.cpf}</td>
                      <td className="px-5 py-3">
                        {c.endereco ? (
                          <div className="flex items-center gap-1 text-xs" style={{ color: "#4B5563" }}>
                            <MapPin size={10} style={{ color: "#9CA3AF", flexShrink: 0 }} />
                            <span className="truncate max-w-[160px]">{c.endereco}</span>
                          </div>
                        ) : <span style={{ color: "#D1D9E6" }}>—</span>}
                      </td>
                      <td className="px-5 py-3">
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{ background: qtdVeiculos > 0 ? "#EFF6FF" : "#F4F6FA", color: qtdVeiculos > 0 ? "#2563EB" : "#9CA3AF" }}>
                          {qtdVeiculos} veíc.
                        </span>
                      </td>
                    </tr>
                  );
                })}
                {clientesFiltrados.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-5 py-8 text-center text-sm" style={{ color: "#9CA3AF" }}>
                      Nenhum cliente encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── ABA VEÍCULOS ── */}
      {aba === "veiculos" && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Formulário */}
          <div className="lg:col-span-2 rounded-xl p-6" style={{ background: "#fff", border: "1px solid #D1D9E6" }}>
            <h3 className="mb-5 font-semibold" style={{ color: "#0A0F1A" }}>Cadastrar Veículo</h3>
            <form onSubmit={handleSaveVeiculo} className="space-y-4">
              {/* Vincular cliente */}
              <div>
                <label className="block text-sm mb-1.5 font-medium" style={{ color: "#374151" }}>
                  Vincular ao Cliente *
                </label>
                <select
                  value={vClienteId}
                  onChange={(e) => { setVClienteId(e.target.value); setVError(""); }}
                  style={{ ...inputStyle, cursor: "pointer" }}
                  onFocus={(e) => (e.target.style.borderColor = "#2563EB")} onBlur={(e) => (e.target.style.borderColor = "#D1D9E6")}
                >
                  <option value="">— Selecione o cliente —</option>
                  {clientes.map((c) => (
                    <option key={c.id} value={c.id}>{c.nome} · {c.telefone}</option>
                  ))}
                </select>
                {vError && (
                  <p className="text-xs mt-1" style={{ color: "#EF4444" }}>{vError}</p>
                )}
                {vClienteId && (
                  <div className="mt-2 flex items-center gap-2 px-3 py-2 rounded-lg"
                    style={{ background: "#EFF6FF", border: "1px solid #BFDBFE" }}>
                    <CheckCircle size={13} style={{ color: "#2563EB" }} />
                    <span className="text-xs font-medium" style={{ color: "#2563EB" }}>
                      Cliente: {clientes.find((c) => c.id === vClienteId)?.nome}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm mb-1.5 font-medium" style={{ color: "#374151" }}>Placa *</label>
                <input value={vPlaca} onChange={(e) => setVPlaca(e.target.value.toUpperCase())} placeholder="ABC-1234" required
                  style={{ ...inputStyle, fontFamily: "var(--font-mono)" }}
                  onFocus={(e) => (e.target.style.borderColor = "#2563EB")} onBlur={(e) => (e.target.style.borderColor = "#D1D9E6")} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm mb-1.5 font-medium" style={{ color: "#374151" }}>Marca *</label>
                  <input value={vMarca} onChange={(e) => setVMarca(e.target.value)} placeholder="Honda" required style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = "#2563EB")} onBlur={(e) => (e.target.style.borderColor = "#D1D9E6")} />
                </div>
                <div>
                  <label className="block text-sm mb-1.5 font-medium" style={{ color: "#374151" }}>Modelo *</label>
                  <input value={vModelo} onChange={(e) => setVModelo(e.target.value)} placeholder="Civic EXL" required style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = "#2563EB")} onBlur={(e) => (e.target.style.borderColor = "#D1D9E6")} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm mb-1.5 font-medium" style={{ color: "#374151" }}>Ano</label>
                  <input value={vAno} onChange={(e) => setVAno(e.target.value)} placeholder="2022" style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = "#2563EB")} onBlur={(e) => (e.target.style.borderColor = "#D1D9E6")} />
                </div>
                <div>
                  <label className="block text-sm mb-1.5 font-medium" style={{ color: "#374151" }}>Cor</label>
                  <input value={vCor} onChange={(e) => setVCor(e.target.value)} placeholder="Prata" style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = "#2563EB")} onBlur={(e) => (e.target.style.borderColor = "#D1D9E6")} />
                </div>
              </div>

              <div>
                <label className="block text-sm mb-1.5 font-medium" style={{ color: "#374151" }}>KM Actual</label>
                <div className="relative">
                  <Gauge size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }} />
                  <input value={vKm} onChange={(e) => setVKm(e.target.value)} placeholder="Ex: 45.000"
                    style={{ ...inputStyle, paddingLeft: "2.25rem" }}
                    onFocus={(e) => (e.target.style.borderColor = "#2563EB")} onBlur={(e) => (e.target.style.borderColor = "#D1D9E6")} />
                </div>
              </div>

              <button type="submit" className="w-full py-3 rounded-lg font-medium text-white"
                style={{ background: vSaved ? "#22C55E" : "#2563EB", cursor: "pointer", fontFamily: "var(--font-family)" }}
                onMouseEnter={(e) => !vSaved && ((e.currentTarget as HTMLElement).style.background = "#1D4ED8")}
                onMouseLeave={(e) => !vSaved && ((e.currentTarget as HTMLElement).style.background = "#2563EB")}
              >
                {vSaved ? "✓ Veículo Cadastrado!" : "Salvar Veículo"}
              </button>
            </form>
          </div>

          {/* Lista de veículos */}
          <div className="lg:col-span-3 rounded-xl overflow-hidden" style={{ background: "#fff", border: "1px solid #D1D9E6" }}>
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid #F0F4F8" }}>
              <span className="font-semibold text-sm" style={{ color: "#0A0F1A" }}>
                {veiculosFiltrados.length} veículo{veiculosFiltrados.length !== 1 ? "s" : ""} cadastrado{veiculosFiltrados.length !== 1 ? "s" : ""}
              </span>
              <div className="relative">
                <Search size={13} style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }} />
                <input value={searchVeiculo} onChange={(e) => setSearchVeiculo(e.target.value)} placeholder="Placa, modelo, cliente..."
                  className="pl-7 pr-3 py-1.5 rounded-lg text-sm outline-none"
                  style={{ border: "1px solid #D1D9E6", background: "#F4F6FA", color: "#0A0F1A", width: 180 }} />
              </div>
            </div>
            <table className="w-full">
              <thead style={{ background: "#F4F6FA" }}>
                <tr>
                  {["Placa", "Veículo", "Ano / Cor", "KM", "Proprietário"].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold" style={{ color: "#4B5563" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {veiculosFiltrados.map((v, i) => {
                  const cliente = clientes.find((c) => c.id === v.clienteId);
                  return (
                    <tr key={v.id} style={{ borderTop: i > 0 ? "1px solid #F0F4F8" : "none" }}>
                      <td className="px-5 py-3">
                        <span className="text-sm font-bold px-2 py-1 rounded"
                          style={{ background: "#F0F4F8", color: "#0A0F1A", fontFamily: "var(--font-mono)" }}>
                          {v.placa}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="text-sm font-medium" style={{ color: "#0A0F1A" }}>{v.marca} {v.modelo}</div>
                      </td>
                      <td className="px-5 py-3">
                        <div className="text-xs" style={{ color: "#374151" }}>{v.ano}</div>
                        <div className="text-xs" style={{ color: "#9CA3AF" }}>{v.cor}</div>
                      </td>
                      <td className="px-5 py-3">
                        {v.km ? (
                          <div className="flex items-center gap-1">
                            <Gauge size={11} style={{ color: "#9CA3AF" }} />
                            <span className="text-xs font-medium" style={{ color: "#374151", fontFamily: "var(--font-mono)" }}>{v.km} km</span>
                          </div>
                        ) : <span style={{ color: "#D1D9E6" }}>—</span>}
                      </td>
                      <td className="px-5 py-3">
                        {cliente ? (
                          <div>
                            <div className="text-sm font-medium" style={{ color: "#0A0F1A" }}>{cliente.nome}</div>
                            <div className="text-xs" style={{ color: "#9CA3AF" }}>{cliente.telefone}</div>
                          </div>
                        ) : (
                          <span className="text-xs" style={{ color: "#EF4444" }}>Sem vínculo</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {veiculosFiltrados.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-sm" style={{ color: "#9CA3AF" }}>
                      Nenhum veículo encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// LINK_OS: each OS has linked services (from catalog) and parts
interface LinkServico {
  linkId: string;
  servicoId: string;
  descricao: string;
  valor: number;
}

interface LinkPeca {
  linkId: string;
  nome: string;
  qty: number;
  unit: number;
}

const IS = (): React.CSSProperties => ({
  border: "1.5px solid #D1D9E6",
  background: "#F4F6FA",
  color: "#0A0F1A",
  fontFamily: "var(--font-family)",
  borderRadius: "0.5rem",
  padding: "0.5rem 0.75rem",
  fontSize: "0.8125rem",
  outline: "none",
  width: "100%",
});

function OrdensPage() {
  const [os, setOs] = useState(MOCK_OS);
  const [showNew, setShowNew] = useState(false);
  const [newCliente, setNewCliente] = useState("");
  const [newPlaca, setNewPlaca] = useState("");
  const [newProblema, setNewProblema] = useState("");

  // LINK_OS — serviços ligados ao catálogo (TOTAL_SERVICOS)
  const [linkServicos, setLinkServicos] = useState<LinkServico[]>([
    { linkId: "ls1", servicoId: "s1", descricao: "Troca de Óleo + Filtro", valor: 80.0 },
  ]);
  // Peças vinculadas à OS
  const [linkPecas, setLinkPecas] = useState<LinkPeca[]>([
    { linkId: "lp1", nome: "Óleo 5W30", qty: 4, unit: 28.0 },
  ]);

  // TOTAL_SERVICOS breakdown
  const totalServicos = linkServicos.reduce((s, sv) => s + sv.valor, 0);
  const totalPecas = linkPecas.reduce((s, p) => s + p.qty * p.unit, 0);
  const totalGeral = totalServicos + totalPecas;

  function addServicoCatalogo(s: Servico) {
    if (linkServicos.find((ls) => ls.servicoId === s.id)) return;
    setLinkServicos([...linkServicos, { linkId: `ls${Date.now()}`, servicoId: s.id, descricao: s.descricao, valor: s.preco }]);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <PageHeader title="Ordens de Serviço" subtitle="Abertura, orçamentos e aprovação de OS." />
        <button
          onClick={() => setShowNew(!showNew)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-white transition-colors"
          style={{ background: "#2563EB", fontFamily: "var(--font-family)", cursor: "pointer" }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#1D4ED8")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#2563EB")}
        >
          <Plus size={16} /> Nova OS
        </button>
      </div>

      {showNew && (
        <div className="rounded-xl p-6 mb-6" style={{ background: "#fff", border: "1px solid #D1D9E6" }}>
          <h3 className="font-semibold mb-5" style={{ color: "#0A0F1A" }}>Abrir Nova Ordem de Serviço</h3>

          {/* Dados gerais */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
            <div>
              <label className="block text-xs mb-1.5 font-medium" style={{ color: "#4B5563" }}>Cliente *</label>
              <input value={newCliente} onChange={(e) => setNewCliente(e.target.value)} placeholder="Nome do cliente"
                style={IS()} onFocus={(e) => (e.target.style.borderColor = "#2563EB")} onBlur={(e) => (e.target.style.borderColor = "#D1D9E6")} />
            </div>
            <div>
              <label className="block text-xs mb-1.5 font-medium" style={{ color: "#4B5563" }}>Placa *</label>
              <input value={newPlaca} onChange={(e) => setNewPlaca(e.target.value.toUpperCase())} placeholder="ABC-1234"
                style={{ ...IS(), fontFamily: "var(--font-mono)" }} onFocus={(e) => (e.target.style.borderColor = "#2563EB")} onBlur={(e) => (e.target.style.borderColor = "#D1D9E6")} />
            </div>
            <div>
              <label className="block text-xs mb-1.5 font-medium" style={{ color: "#4B5563" }}>Mecânico Responsável</label>
              <select style={{ ...IS(), cursor: "pointer" }}>
                <option>Roberto Alves</option>
                <option>Diego Santos</option>
                <option>Fábio Correia</option>
              </select>
            </div>
          </div>
          <div className="mb-5">
            <label className="block text-xs mb-1.5 font-medium" style={{ color: "#4B5563" }}>Problema Relatado *</label>
            <textarea value={newProblema} onChange={(e) => setNewProblema(e.target.value)} rows={2}
              placeholder="Descreva o problema relatado pelo cliente..."
              style={{ ...IS(), resize: "vertical" }}
              onFocus={(e) => (e.target.style.borderColor = "#2563EB")} onBlur={(e) => (e.target.style.borderColor = "#D1D9E6")} />
          </div>

          {/* LINK_OS — Serviços do catálogo */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold" style={{ color: "#0A0F1A" }}>Serviços (Catálogo)</span>
            </div>
            {/* Seletor do catálogo */}
            <div className="rounded-lg p-3 mb-3" style={{ background: "#F4F6FA", border: "1px solid #F0F4F8" }}>
              <p className="text-xs mb-2" style={{ color: "#4B5563" }}>Selecione do catálogo:</p>
              <div className="flex flex-wrap gap-2">
                {SERVICOS_MOCK.map((s) => {
                  const linked = linkServicos.some((ls) => ls.servicoId === s.id);
                  return (
                    <button key={s.id} type="button" onClick={() => addServicoCatalogo(s)}
                      className="text-xs px-2.5 py-1 rounded-full transition-all"
                      style={{
                        background: linked ? "#2563EB" : "#fff",
                        color: linked ? "#fff" : "#374151",
                        border: `1px solid ${linked ? "#2563EB" : "#D1D9E6"}`,
                        cursor: linked ? "default" : "pointer",
                      }}>
                      {linked ? "✓ " : "+ "}{s.descricao} · R$ {s.preco.toFixed(2)}
                    </button>
                  );
                })}
              </div>
            </div>
            {/* Serviços vinculados (LINK_OS) */}
            {linkServicos.length > 0 && (
              <div className="space-y-1.5">
                {linkServicos.map((ls) => (
                  <div key={ls.linkId} className="flex items-center gap-3 px-3 py-2 rounded-lg" style={{ background: "#EFF6FF", border: "1px solid #BFDBFE" }}>
                    <FileText size={13} style={{ color: "#2563EB", flexShrink: 0 }} />
                    <span className="flex-1 text-xs font-medium" style={{ color: "#0A0F1A" }}>{ls.descricao}</span>
                    <input type="number" value={ls.valor} step="0.01"
                      onChange={(e) => setLinkServicos(linkServicos.map((x) => x.linkId === ls.linkId ? { ...x, valor: +e.target.value } : x))}
                      style={{ ...IS(), width: 90, fontFamily: "var(--font-mono)", padding: "0.25rem 0.5rem", fontSize: "0.75rem" }} />
                    <button type="button" onClick={() => setLinkServicos(linkServicos.filter((x) => x.linkId !== ls.linkId))}>
                      <Trash2 size={13} style={{ color: "#EF4444" }} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Peças */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold" style={{ color: "#0A0F1A" }}>Peças</span>
              <button type="button" onClick={() => setLinkPecas([...linkPecas, { linkId: `lp${Date.now()}`, nome: "", qty: 1, unit: 0 }])}
                className="text-xs flex items-center gap-1" style={{ color: "#2563EB", background: "none", border: "none", cursor: "pointer" }}>
                <Plus size={12} /> Adicionar
              </button>
            </div>
            <div className="space-y-2">
              {linkPecas.map((p) => (
                <div key={p.linkId} className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-6">
                    <input value={p.nome} onChange={(e) => setLinkPecas(linkPecas.map((x) => x.linkId === p.linkId ? { ...x, nome: e.target.value } : x))}
                      placeholder="Nome da peça" style={IS()} />
                  </div>
                  <div className="col-span-2">
                    <input type="number" value={p.qty} onChange={(e) => setLinkPecas(linkPecas.map((x) => x.linkId === p.linkId ? { ...x, qty: +e.target.value } : x))}
                      placeholder="Qtd" style={IS()} />
                  </div>
                  <div className="col-span-3">
                    <input type="number" value={p.unit} onChange={(e) => setLinkPecas(linkPecas.map((x) => x.linkId === p.linkId ? { ...x, unit: +e.target.value } : x))}
                      placeholder="R$ unit." style={IS()} />
                  </div>
                  <button type="button" onClick={() => setLinkPecas(linkPecas.filter((x) => x.linkId !== p.linkId))} className="col-span-1 flex justify-center">
                    <Trash2 size={14} style={{ color: "#EF4444" }} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* TOTAL_SERVICOS breakdown */}
          <div className="rounded-xl p-4 mb-4" style={{ background: "#F4F6FA", border: "1px solid #F0F4F8" }}>
            <p className="text-xs font-semibold mb-2" style={{ color: "#4B5563" }}>TOTAL_SERVICOS</p>
            <div className="space-y-1">
              <div className="flex justify-between text-xs" style={{ color: "#374151" }}>
                <span>Subtotal Serviços ({linkServicos.length} item{linkServicos.length !== 1 ? "s" : ""})</span>
                <span style={{ fontFamily: "var(--font-mono)" }}>R$ {totalServicos.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs" style={{ color: "#374151" }}>
                <span>Subtotal Peças ({linkPecas.length} item{linkPecas.length !== 1 ? "s" : ""})</span>
                <span style={{ fontFamily: "var(--font-mono)" }}>R$ {totalPecas.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 mt-1" style={{ borderTop: "1px solid #D1D9E6" }}>
                <span className="text-sm font-bold" style={{ color: "#0A0F1A" }}>Total Geral</span>
                <span className="text-sm font-bold" style={{ color: "#2563EB", fontFamily: "var(--font-mono)" }}>R$ {totalGeral.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button type="button" className="px-5 py-2.5 rounded-lg font-medium text-white" style={{ background: "#2563EB", cursor: "pointer" }}>
              Salvar & Enviar Orçamento
            </button>
            <button type="button" onClick={() => setShowNew(false)} className="px-5 py-2.5 rounded-lg font-medium"
              style={{ background: "#F0F4F8", color: "#4B5563", cursor: "pointer" }}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* OS table */}
      <div className="rounded-xl overflow-hidden" style={{ background: "#fff", border: "1px solid #D1D9E6" }}>
        <table className="w-full">
          <thead style={{ background: "#F4F6FA" }}>
            <tr>
              {["OS", "Cliente", "Veículo/Placa", "Problema", "Status", "Total", "Data"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: "#4B5563" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {os.map((o, i) => {
              const s = STATUS_CONFIG[o.status as keyof typeof STATUS_CONFIG];
              return (
                <tr key={o.id} style={{ borderTop: i > 0 ? "1px solid #F0F4F8" : "none" }}>
                  <td className="px-4 py-3">
                    <span className="text-sm font-semibold" style={{ color: "#0A0F1A", fontFamily: "var(--font-mono)" }}>{o.id}</span>
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color: "#374151" }}>{o.cliente}</td>
                  <td className="px-4 py-3">
                    <div className="text-xs" style={{ color: "#4B5563" }}>{o.modelo}</div>
                    <span className="text-xs px-1.5 py-0.5 rounded font-medium mt-0.5 inline-block" style={{ background: "#F0F4F8", color: "#374151", fontFamily: "var(--font-mono)" }}>
                      {o.placa}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs max-w-[160px]" style={{ color: "#4B5563" }}>
                    <span className="line-clamp-2">{o.problema}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: s.bg, color: s.color }}>
                      {s.icon} {s.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold" style={{ color: "#0A0F1A", fontFamily: "var(--font-mono)" }}>
                    R$ {o.total.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: "#4B5563" }}>{o.data}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PagamentoPage() {
  const [selectedOS, setSelectedOS] = useState(MOCK_OS[0]);
  const [metodo, setMetodo] = useState<"pix" | "cartao" | "dinheiro">("pix");
  const [paid, setPaid] = useState(false);

  const aprovadas = MOCK_OS.filter((o) => o.status === "aprovado");

  const metodosConfig = [
    { id: "pix", label: "Pix", icon: "⚡" },
    { id: "cartao", label: "Cartão", icon: "💳" },
    { id: "dinheiro", label: "Dinheiro", icon: "💵" },
  ] as const;

  return (
    <div>
      <PageHeader title="Fechamento & Pagamento" subtitle="Finalize OS aprovadas e emita comprovantes." />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl p-6" style={{ background: "#fff", border: "1px solid #D1D9E6" }}>
          <h3 className="font-semibold mb-4" style={{ color: "#0A0F1A" }}>Selecionar OS para Fechar</h3>
          <div className="space-y-2 mb-6">
            {aprovadas.map((o) => (
              <button
                key={o.id}
                onClick={() => { setSelectedOS(o); setPaid(false); }}
                className="w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all"
                style={{
                  border: selectedOS.id === o.id ? "2px solid #2563EB" : "2px solid #F0F4F8",
                  background: selectedOS.id === o.id ? "#EFF6FF" : "#F4F6FA",
                }}
              >
                <div className="flex-1">
                  <div className="text-sm font-medium" style={{ color: "#0A0F1A" }}>{o.id} — {o.cliente}</div>
                  <div className="text-xs mt-0.5" style={{ color: "#4B5563" }}>{o.placa} · {o.modelo}</div>
                </div>
                <div className="font-semibold" style={{ color: "#0A0F1A", fontFamily: "var(--font-mono)", fontSize: "0.875rem" }}>
                  R$ {o.total.toFixed(2)}
                </div>
              </button>
            ))}
          </div>

          <div className="mb-5">
            <label className="block text-sm font-semibold mb-3" style={{ color: "#0A0F1A" }}>Forma de Pagamento</label>
            <div className="grid grid-cols-3 gap-2">
              {metodosConfig.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMetodo(m.id)}
                  className="flex flex-col items-center gap-1.5 py-3 rounded-lg transition-all"
                  style={{
                    border: metodo === m.id ? "2px solid #2563EB" : "2px solid #D1D9E6",
                    background: metodo === m.id ? "#EFF6FF" : "#F4F6FA",
                    cursor: "pointer",
                  }}
                >
                  <span style={{ fontSize: "1.25rem" }}>{m.icon}</span>
                  <span className="text-sm font-medium" style={{ color: metodo === m.id ? "#2563EB" : "#374151" }}>{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {!paid ? (
            <button
              onClick={() => setPaid(true)}
              className="w-full py-3 rounded-lg font-medium text-white transition-colors"
              style={{ background: "#22C55E", cursor: "pointer" }}
            >
              ✓ Confirmar Pagamento via {metodosConfig.find((m) => m.id === metodo)?.label}
            </button>
          ) : (
            <div>
              <div className="text-center py-3 rounded-lg mb-3" style={{ background: "#F0FDF4", color: "#22C55E", fontWeight: 600 }}>
                ✓ Pagamento Confirmado!
              </div>
              <button
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium transition-colors"
                style={{ background: "#F0F4F8", color: "#374151", cursor: "pointer" }}
              >
                <Printer size={16} /> Gerar Comprovante
              </button>
            </div>
          )}
        </div>

        <div className="rounded-xl p-6" style={{ background: "#fff", border: "1px solid #D1D9E6" }}>
          <h3 className="font-semibold mb-4" style={{ color: "#0A0F1A" }}>Resumo da OS</h3>
          <div className="space-y-3">
            {[
              ["Número", selectedOS.id],
              ["Cliente", selectedOS.cliente],
              ["Placa", selectedOS.placa],
              ["Veículo", selectedOS.modelo],
              ["Data", selectedOS.data],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between py-2" style={{ borderBottom: "1px solid #F0F4F8" }}>
                <span className="text-sm" style={{ color: "#4B5563" }}>{k}</span>
                <span className="text-sm font-medium" style={{ color: "#0A0F1A", fontFamily: k === "Placa" || k === "Número" ? "var(--font-mono)" : undefined }}>
                  {v}
                </span>
              </div>
            ))}
            <div className="flex justify-between py-3 mt-2 rounded-lg px-3" style={{ background: "#EFF6FF" }}>
              <span className="font-semibold" style={{ color: "#0A0F1A" }}>Total a Pagar</span>
              <span className="font-bold text-lg" style={{ color: "#2563EB", fontFamily: "var(--font-mono)" }}>
                R$ {selectedOS.total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AttendantView({ currentPage, onPageChange }: AttendantViewProps) {
  return (
    <div className="flex-1 overflow-auto p-6" style={{ fontFamily: "var(--font-family)" }}>
      {currentPage === "dashboard" && <Dashboard onPageChange={onPageChange} />}
      {currentPage === "clientes" && <ClientesPage />}
      {currentPage === "ordens" && <OrdensPage />}
      {currentPage === "pagamento" && <PagamentoPage />}
    </div>
  );
}
