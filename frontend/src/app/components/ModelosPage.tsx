import { useState } from "react";
import { Plus, Edit2, Trash2, Search, Car } from "lucide-react";

export interface Modelo {
  id: string;
  marca: string;
  modelo: string;
}

export const MODELOS_MOCK: Modelo[] = [
  { id: "m1", marca: "Honda", modelo: "Civic EXL 2021" },
  { id: "m2", marca: "Toyota", modelo: "Corolla XEI 2020" },
  { id: "m3", marca: "Hyundai", modelo: "HB20 Comfort 2022" },
  { id: "m4", marca: "Chevrolet", modelo: "Onix Plus 2023" },
  { id: "m5", marca: "Volkswagen", modelo: "Polo 1.0 TSI 2022" },
  { id: "m6", marca: "Fiat", modelo: "Argo 1.3 2021" },
  { id: "m7", marca: "Jeep", modelo: "Compass Sport 2023" },
  { id: "m8", marca: "Ford", modelo: "Ka SE 1.0 2020" },
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

export function ModelosPage() {
  const [modelos, setModelos] = useState<Modelo[]>(MODELOS_MOCK);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ marca: "", modelo: "" });
  const [saved, setSaved] = useState(false);

  const filtered = modelos.filter((m) =>
    m.marca.toLowerCase().includes(search.toLowerCase()) ||
    m.modelo.toLowerCase().includes(search.toLowerCase())
  );

  const totalModelos = modelos.length;
  const marcas = new Set(modelos.map((m) => m.marca)).size;

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (editingId) {
      setModelos(modelos.map((m) =>
        m.id === editingId
          ? { ...m, marca: form.marca, modelo: form.modelo }
          : m
      ));
      setEditingId(null);
    } else {
      setModelos([...modelos, {
        id: `m${Date.now()}`,
        marca: form.marca,
        modelo: form.modelo,
      }]);
    }
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setForm({ marca: "", modelo: "" });
      setShowForm(false);
    }, 1500);
  }

  function handleEdit(m: Modelo) {
    setForm({ marca: m.marca, modelo: m.modelo });
    setEditingId(m.id);
    setShowForm(true);
  }

  function handleCancel() {
    setShowForm(false);
    setEditingId(null);
    setForm({ marca: "", modelo: "" });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <PageHeader title="Modelos de Veículos" subtitle="Cadastre marcas e modelos para vincular aos veículos dos clientes." />
        <button
          onClick={() => { setShowForm(!showForm); setEditingId(null); setForm({ marca: "", modelo: "" }); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-white"
          style={{ background: "#2563EB", cursor: "pointer", fontFamily: "var(--font-family)" }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#1D4ED8")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#2563EB")}
        >
          <Plus size={16} /> Novo Modelo
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="rounded-xl p-4" style={{ background: "#fff", border: "1px solid #D1D9E6" }}>
          <div className="text-xs mb-1" style={{ color: "#4B5563" }}>Modelos Cadastrados</div>
          <div className="font-bold" style={{ color: "#0A0F1A", fontSize: "1.5rem", fontFamily: "var(--font-mono)" }}>{totalModelos}</div>
        </div>
        <div className="rounded-xl p-4" style={{ background: "#fff", border: "1px solid #D1D9E6" }}>
          <div className="text-xs mb-1" style={{ color: "#4B5563" }}>Marcas Diferentes</div>
          <div className="font-bold" style={{ color: "#2563EB", fontSize: "1.5rem", fontFamily: "var(--font-mono)" }}>{marcas}</div>
        </div>
      </div>

      {showForm && (
        <div className="rounded-xl p-6 mb-6" style={{ background: "#fff", border: "1px solid #D1D9E6" }}>
          <h3 className="font-semibold mb-5" style={{ color: "#0A0F1A" }}>
            {editingId ? "Editar Modelo" : "Cadastrar Novo Modelo"}
          </h3>
          <form onSubmit={handleAdd}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm mb-1.5 font-medium" style={{ color: "#374151" }}>Marca *</label>
                <input required value={form.marca} onChange={(e) => setForm({ ...form, marca: e.target.value })}
                  placeholder="Ex: Honda" style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = "#2563EB")} onBlur={(e) => (e.target.style.borderColor = "#D1D9E6")} />
              </div>
              <div>
                <label className="block text-sm mb-1.5 font-medium" style={{ color: "#374151" }}>Modelo *</label>
                <input required value={form.modelo} onChange={(e) => setForm({ ...form, modelo: e.target.value })}
                  placeholder="Ex: Civic EXL 2021" style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = "#2563EB")} onBlur={(e) => (e.target.style.borderColor = "#D1D9E6")} />
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="px-5 py-2.5 rounded-lg font-medium text-white"
                style={{ background: saved ? "#22C55E" : "#2563EB", cursor: "pointer" }}>
                {saved ? "✓ Guardado!" : editingId ? "Atualizar Modelo" : "Salvar Modelo"}
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
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar marca ou modelo..."
            className="pl-8 pr-4 py-2 rounded-lg text-sm outline-none w-full"
            style={{ border: "1px solid #D1D9E6", background: "#fff", color: "#0A0F1A" }} />
        </div>
        <span className="text-sm" style={{ color: "#4B5563" }}>{filtered.length} modelo{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #D1D9E6" }}>
        <table className="w-full">
          <thead style={{ background: "#F4F6FA" }}>
            <tr>
              {["ID", "Marca", "Modelo", "Ações"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: "#4B5563" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((m, i) => (
              <tr key={m.id} style={{ borderTop: i > 0 ? "1px solid #F0F4F8" : "none", background: "#fff" }}>
                <td className="px-4 py-3">
                  <span className="text-xs font-semibold" style={{ color: "#9CA3AF", fontFamily: "var(--font-mono)" }}>{m.id}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Car size={13} style={{ color: "#2563EB", flexShrink: 0 }} />
                    <span className="text-sm font-medium" style={{ color: "#0A0F1A" }}>{m.marca}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm" style={{ color: "#4B5563" }}>{m.modelo}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1.5">
                    <button onClick={() => handleEdit(m)} className="p-1.5 rounded-md" style={{ background: "#F0F4F8", cursor: "pointer" }} title="Editar">
                      <Edit2 size={12} style={{ color: "#4B5563" }} />
                    </button>
                    <button onClick={() => setModelos(modelos.filter((x) => x.id !== m.id))}
                      className="p-1.5 rounded-md" style={{ background: "#FEF2F2", cursor: "pointer" }} title="Remover">
                      <Trash2 size={12} style={{ color: "#EF4444" }} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-sm" style={{ color: "#9CA3AF" }}>
                  Nenhum modelo encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
