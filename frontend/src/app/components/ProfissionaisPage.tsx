import { useState } from "react";
import { Plus, Edit2, Trash2, Search, Wrench, Phone, Mail, Star } from "lucide-react";

export interface Profissional {
  id: string;
  nome: string;
  especialidade: string;
  telefone: string;
  email: string;
  status: "ativo" | "inativo";
  desde: string;
}

const PROFISSIONAIS_MOCK: Profissional[] = [
  { id: "p1", nome: "Roberto Alves", especialidade: "Motor & Transmissão", telefone: "(11) 98001-1111", email: "roberto@erp.com.br", status: "ativo", desde: "Mar/2023" },
  { id: "p2", nome: "Diego Santos", especialidade: "Elétrica Automotiva", telefone: "(11) 98002-2222", email: "diego@erp.com.br", status: "ativo", desde: "Jul/2023" },
  { id: "p3", nome: "Fábio Correia", especialidade: "Suspensão & Freios", telefone: "(11) 98003-3333", email: "fabio@erp.com.br", status: "ativo", desde: "Out/2023" },
  { id: "p4", nome: "Leandro Mota", especialidade: "Funilaria & Pintura", telefone: "(11) 98004-4444", email: "leandro@erp.com.br", status: "inativo", desde: "Jan/2024" },
];

const ESPECIALIDADES = [
  "Motor & Transmissão",
  "Elétrica Automotiva",
  "Suspensão & Freios",
  "Funilaria & Pintura",
  "Ar-Condicionado",
  "Injeção Eletrônica",
  "Polimento & Estética",
  "Geral",
];

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

function PageHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-6">
      <h1 style={{ color: "#0A0F1A", fontFamily: "var(--font-family)", fontWeight: 600, fontSize: "1.25rem" }}>{title}</h1>
      <p className="text-sm mt-0.5" style={{ color: "#4B5563" }}>{subtitle}</p>
    </div>
  );
}

export function ProfissionaisPage() {
  const [profissionais, setProfissionais] = useState<Profissional[]>(PROFISSIONAIS_MOCK);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ nome: "", especialidade: "", telefone: "", email: "" });
  const [saved, setSaved] = useState(false);

  const filtered = profissionais.filter((p) =>
    p.nome.toLowerCase().includes(search.toLowerCase()) ||
    p.especialidade.toLowerCase().includes(search.toLowerCase())
  );

  const ativos = profissionais.filter((p) => p.status === "ativo").length;

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setProfissionais([...profissionais, {
      ...form,
      id: `p${Date.now()}`,
      status: "ativo",
      desde: "Jun/2026",
    }]);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setForm({ nome: "", especialidade: "", telefone: "", email: "" });
      setShowForm(false);
    }, 1500);
  }

  function toggleStatus(id: string) {
    setProfissionais(profissionais.map((p) =>
      p.id === id ? { ...p, status: p.status === "ativo" ? "inativo" : "ativo" } : p
    ));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <PageHeader title="Profissionais" subtitle="Cadastre e gerencie a equipe de mecânicos e técnicos." />
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-white"
          style={{ background: "#2563EB", cursor: "pointer", fontFamily: "var(--font-family)" }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#1D4ED8")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#2563EB")}
        >
          <Plus size={16} /> Novo Profissional
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Cadastrados", value: profissionais.length, color: "#3B82F6" },
          { label: "Ativos", value: ativos, color: "#22C55E" },
          { label: "Inativos", value: profissionais.length - ativos, color: "#9CA3AF" },
          { label: "Especialidades", value: new Set(profissionais.map((p) => p.especialidade)).size, color: "#2563EB" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl p-4" style={{ background: "#fff", border: "1px solid #D1D9E6" }}>
            <div className="text-xs mb-1" style={{ color: "#4B5563" }}>{s.label}</div>
            <div className="font-bold" style={{ color: "#0A0F1A", fontSize: "1.5rem", fontFamily: "var(--font-mono)" }}>{s.value}</div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="rounded-xl p-6 mb-6" style={{ background: "#fff", border: "1px solid #D1D9E6" }}>
          <h3 className="font-semibold mb-5" style={{ color: "#0A0F1A" }}>Cadastrar Profissional</h3>
          <form onSubmit={handleAdd}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm mb-1.5 font-medium" style={{ color: "#374151" }}>Nome Completo *</label>
                <input required value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  placeholder="João da Silva" style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = "#2563EB")} onBlur={(e) => (e.target.style.borderColor = "#D1D9E6")} />
              </div>
              <div>
                <label className="block text-sm mb-1.5 font-medium" style={{ color: "#374151" }}>Especialidade *</label>
                <select required value={form.especialidade} onChange={(e) => setForm({ ...form, especialidade: e.target.value })}
                  style={{ ...inputStyle, cursor: "pointer" }}
                  onFocus={(e) => (e.target.style.borderColor = "#2563EB")} onBlur={(e) => (e.target.style.borderColor = "#D1D9E6")}>
                  <option value="">— Selecione —</option>
                  {ESPECIALIDADES.map((esp) => <option key={esp}>{esp}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1.5 font-medium" style={{ color: "#374151" }}>Telefone *</label>
                <div className="relative">
                  <Phone size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }} />
                  <input required value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })}
                    placeholder="(11) 99999-9999" style={{ ...inputStyle, paddingLeft: "2.25rem" }}
                    onFocus={(e) => (e.target.style.borderColor = "#2563EB")} onBlur={(e) => (e.target.style.borderColor = "#D1D9E6")} />
                </div>
              </div>
              <div>
                <label className="block text-sm mb-1.5 font-medium" style={{ color: "#374151" }}>E-mail</label>
                <div className="relative">
                  <Mail size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }} />
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="nome@erp.com.br" style={{ ...inputStyle, paddingLeft: "2.25rem" }}
                    onFocus={(e) => (e.target.style.borderColor = "#2563EB")} onBlur={(e) => (e.target.style.borderColor = "#D1D9E6")} />
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="px-5 py-2.5 rounded-lg font-medium text-white"
                style={{ background: saved ? "#22C55E" : "#2563EB", cursor: "pointer" }}>
                {saved ? "✓ Cadastrado!" : "Salvar Profissional"}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 rounded-lg font-medium"
                style={{ background: "#F0F4F8", color: "#4B5563", cursor: "pointer" }}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por nome ou especialidade..."
            className="pl-8 pr-4 py-2 rounded-lg text-sm outline-none w-full"
            style={{ border: "1px solid #D1D9E6", background: "#fff", color: "#0A0F1A" }} />
        </div>
        <span className="text-sm" style={{ color: "#4B5563" }}>{filtered.length} profissional{filtered.length !== 1 ? "is" : ""}</span>
      </div>

      <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #D1D9E6" }}>
        <table className="w-full">
          <thead style={{ background: "#F4F6FA" }}>
            <tr>
              {["Profissional", "Especialidade", "Contacto", "Status", "Membro desde", "Ações"].map((h) => (
                <th key={h} className="text-left px-5 py-3 text-xs font-semibold" style={{ color: "#4B5563" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, i) => (
              <tr key={p.id} style={{ borderTop: i > 0 ? "1px solid #F0F4F8" : "none", background: "#fff" }}>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                      style={{ background: "#EFF6FF", color: "#2563EB" }}>
                      <Wrench size={15} />
                    </div>
                    <div>
                      <div className="text-sm font-medium" style={{ color: "#0A0F1A" }}>{p.nome}</div>
                      <div className="text-xs" style={{ color: "#9CA3AF" }}>{p.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full"
                    style={{ background: "#F0F4F8", color: "#374151" }}>
                    <Star size={10} style={{ color: "#2563EB" }} /> {p.especialidade}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-1.5 text-xs" style={{ color: "#374151" }}>
                    <Phone size={11} style={{ color: "#9CA3AF" }} /> {p.telefone}
                  </div>
                </td>
                <td className="px-5 py-3">
                  <button onClick={() => toggleStatus(p.id)}
                    className="text-xs px-2.5 py-1 rounded-full font-medium cursor-pointer"
                    style={{
                      background: p.status === "ativo" ? "#F0FDF4" : "#F4F6FA",
                      color: p.status === "ativo" ? "#22C55E" : "#9CA3AF",
                      border: "none",
                    }}>
                    {p.status === "ativo" ? "● Ativo" : "○ Inativo"}
                  </button>
                </td>
                <td className="px-5 py-3 text-sm" style={{ color: "#4B5563" }}>{p.desde}</td>
                <td className="px-5 py-3">
                  <div className="flex gap-1.5">
                    <button className="p-1.5 rounded-md" style={{ background: "#F0F4F8", cursor: "pointer" }} title="Editar">
                      <Edit2 size={12} style={{ color: "#4B5563" }} />
                    </button>
                    <button onClick={() => setProfissionais(profissionais.filter((x) => x.id !== p.id))}
                      className="p-1.5 rounded-md" style={{ background: "#FEF2F2", cursor: "pointer" }} title="Remover">
                      <Trash2 size={12} style={{ color: "#EF4444" }} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-sm" style={{ color: "#9CA3AF" }}>
                  Nenhum profissional encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
