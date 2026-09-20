import { useState } from "react";
import { Plus, Edit2, Trash2, Search, Wrench, Check, X } from "lucide-react";

export interface Servico {
  id: string;
  descricao: string;
  categoria: string;
  preco: number;
  tempoEstimado: string;
}

const CATEGORIAS = [
  "Revisão",
  "Motor",
  "Freios",
  "Suspensão",
  "Elétrica",
  "Ar-Condicionado",
  "Transmissão",
  "Funilaria",
  "Diagnóstico",
  "Outro",
];

export const SERVICOS_MOCK: Servico[] = [
  { id: "s1", descricao: "Troca de Óleo + Filtro", categoria: "Revisão", preco: 80.0, tempoEstimado: "30 min" },
  { id: "s2", descricao: "Alinhamento e Balanceamento", categoria: "Suspensão", preco: 120.0, tempoEstimado: "1h" },
  { id: "s3", descricao: "Revisão de Freios (par)", categoria: "Freios", preco: 150.0, tempoEstimado: "2h" },
  { id: "s4", descricao: "Troca de Correia Dentada", categoria: "Motor", preco: 250.0, tempoEstimado: "3h" },
  { id: "s5", descricao: "Diagnóstico Eletrônico (Scanner)", categoria: "Diagnóstico", preco: 90.0, tempoEstimado: "1h" },
  { id: "s6", descricao: "Revisão Completa 10.000 km", categoria: "Revisão", preco: 320.0, tempoEstimado: "4h" },
  { id: "s7", descricao: "Higienização do Ar-Condicionado", categoria: "Ar-Condicionado", preco: 180.0, tempoEstimado: "2h" },
  { id: "s8", descricao: "Troca de Amortecedor (unidade)", categoria: "Suspensão", preco: 200.0, tempoEstimado: "2h" },
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

export function CatalogoServicosPage() {
  const [servicos, setServicos] = useState<Servico[]>(SERVICOS_MOCK);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ descricao: "", categoria: "", preco: "", tempoEstimado: "" });
  const [saved, setSaved] = useState(false);

  const filtered = servicos.filter((s) =>
    s.descricao.toLowerCase().includes(search.toLowerCase()) ||
    s.categoria.toLowerCase().includes(search.toLowerCase())
  );

  const totalServicos = servicos.length;
  const precoMedio = servicos.reduce((sum, s) => sum + s.preco, 0) / (servicos.length || 1);
  const categorias = new Set(servicos.map((s) => s.categoria)).size;

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (editingId) {
      setServicos(servicos.map((s) =>
        s.id === editingId
          ? { ...s, descricao: form.descricao, categoria: form.categoria, preco: Number(form.preco), tempoEstimado: form.tempoEstimado }
          : s
      ));
      setEditingId(null);
    } else {
      setServicos([...servicos, {
        id: `s${Date.now()}`,
        descricao: form.descricao,
        categoria: form.categoria,
        preco: Number(form.preco),
        tempoEstimado: form.tempoEstimado,
      }]);
    }
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setForm({ descricao: "", categoria: "", preco: "", tempoEstimado: "" });
      setShowForm(false);
    }, 1500);
  }

  function handleEdit(s: Servico) {
    setForm({ descricao: s.descricao, categoria: s.categoria, preco: String(s.preco), tempoEstimado: s.tempoEstimado });
    setEditingId(s.id);
    setShowForm(true);
  }

  function handleCancel() {
    setShowForm(false);
    setEditingId(null);
    setForm({ descricao: "", categoria: "", preco: "", tempoEstimado: "" });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <PageHeader title="Catálogo de Serviços" subtitle="Defina os serviços disponíveis com descrição e preço base." />
        <button
          onClick={() => { setShowForm(!showForm); setEditingId(null); setForm({ descricao: "", categoria: "", preco: "", tempoEstimado: "" }); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-white"
          style={{ background: "#2563EB", cursor: "pointer", fontFamily: "var(--font-family)" }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#1D4ED8")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#2563EB")}
        >
          <Plus size={16} /> Novo Serviço
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="rounded-xl p-4" style={{ background: "#fff", border: "1px solid #D1D9E6" }}>
          <div className="text-xs mb-1" style={{ color: "#4B5563" }}>Serviços Cadastrados</div>
          <div className="font-bold" style={{ color: "#0A0F1A", fontSize: "1.5rem", fontFamily: "var(--font-mono)" }}>{totalServicos}</div>
        </div>
        <div className="rounded-xl p-4" style={{ background: "#fff", border: "1px solid #D1D9E6" }}>
          <div className="text-xs mb-1" style={{ color: "#4B5563" }}>Preço Médio</div>
          <div className="font-bold" style={{ color: "#2563EB", fontSize: "1.5rem", fontFamily: "var(--font-mono)" }}>
            R$ {precoMedio.toFixed(2)}
          </div>
        </div>
        <div className="rounded-xl p-4" style={{ background: "#fff", border: "1px solid #D1D9E6" }}>
          <div className="text-xs mb-1" style={{ color: "#4B5563" }}>Categorias</div>
          <div className="font-bold" style={{ color: "#3B82F6", fontSize: "1.5rem", fontFamily: "var(--font-mono)" }}>{categorias}</div>
        </div>
      </div>

      {showForm && (
        <div className="rounded-xl p-6 mb-6" style={{ background: "#fff", border: "1px solid #D1D9E6" }}>
          <h3 className="font-semibold mb-5" style={{ color: "#0A0F1A" }}>
            {editingId ? "Editar Serviço" : "Cadastrar Novo Serviço"}
          </h3>
          <form onSubmit={handleAdd}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
              <div className="lg:col-span-2">
                <label className="block text-sm mb-1.5 font-medium" style={{ color: "#374151" }}>Descrição do Serviço *</label>
                <input required value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                  placeholder="Ex: Troca de óleo + filtro" style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = "#2563EB")} onBlur={(e) => (e.target.style.borderColor = "#D1D9E6")} />
              </div>
              <div>
                <label className="block text-sm mb-1.5 font-medium" style={{ color: "#374151" }}>Categoria *</label>
                <select required value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                  style={{ ...inputStyle, cursor: "pointer" }}
                  onFocus={(e) => (e.target.style.borderColor = "#2563EB")} onBlur={(e) => (e.target.style.borderColor = "#D1D9E6")}>
                  <option value="">— Selecione —</option>
                  {CATEGORIAS.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1.5 font-medium" style={{ color: "#374151" }}>Preço Base (R$) *</label>
                <input type="number" required step="0.01" min={0} value={form.preco}
                  onChange={(e) => setForm({ ...form, preco: e.target.value })}
                  placeholder="0,00" style={{ ...inputStyle, fontFamily: "var(--font-mono)" }}
                  onFocus={(e) => (e.target.style.borderColor = "#2563EB")} onBlur={(e) => (e.target.style.borderColor = "#D1D9E6")} />
              </div>
              <div>
                <label className="block text-sm mb-1.5 font-medium" style={{ color: "#374151" }}>Tempo Estimado</label>
                <input value={form.tempoEstimado} onChange={(e) => setForm({ ...form, tempoEstimado: e.target.value })}
                  placeholder="Ex: 1h30min" style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = "#2563EB")} onBlur={(e) => (e.target.style.borderColor = "#D1D9E6")} />
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="px-5 py-2.5 rounded-lg font-medium text-white"
                style={{ background: saved ? "#22C55E" : "#2563EB", cursor: "pointer" }}>
                {saved ? "✓ Guardado!" : editingId ? "Atualizar Serviço" : "Salvar Serviço"}
              </button>
              <button type="button" onClick={handleCancel} className="px-5 py-2.5 rounded-lg font-medium"
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
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar serviço ou categoria..."
            className="pl-8 pr-4 py-2 rounded-lg text-sm outline-none w-full"
            style={{ border: "1px solid #D1D9E6", background: "#fff", color: "#0A0F1A" }} />
        </div>
        <span className="text-sm" style={{ color: "#4B5563" }}>{filtered.length} serviço{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #D1D9E6" }}>
        <table className="w-full">
          <thead style={{ background: "#F4F6FA" }}>
            <tr>
              {["ID", "Descrição", "Categoria", "Tempo Est.", "Preço Base", "Ações"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: "#4B5563" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((s, i) => (
              <tr key={s.id} style={{ borderTop: i > 0 ? "1px solid #F0F4F8" : "none", background: "#fff" }}>
                <td className="px-4 py-3">
                  <span className="text-xs font-semibold" style={{ color: "#9CA3AF", fontFamily: "var(--font-mono)" }}>{s.id}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Wrench size={13} style={{ color: "#2563EB", flexShrink: 0 }} />
                    <span className="text-sm font-medium" style={{ color: "#0A0F1A" }}>{s.descricao}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#F0F4F8", color: "#374151" }}>{s.categoria}</span>
                </td>
                <td className="px-4 py-3 text-xs" style={{ color: "#4B5563" }}>{s.tempoEstimado || "—"}</td>
                <td className="px-4 py-3 text-sm font-semibold" style={{ color: "#22C55E", fontFamily: "var(--font-mono)" }}>
                  R$ {s.preco.toFixed(2)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1.5">
                    <button onClick={() => handleEdit(s)} className="p-1.5 rounded-md" style={{ background: "#F0F4F8", cursor: "pointer" }} title="Editar">
                      <Edit2 size={12} style={{ color: "#4B5563" }} />
                    </button>
                    <button onClick={() => setServicos(servicos.filter((x) => x.id !== s.id))}
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
                  Nenhum serviço encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}