import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Car, Lock, User } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

export function LoginScreen() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { signIn } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // O sistema envia os dados e o backend descobre o perfil automaticamente
      await signIn(login, password);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Credenciais inválidas. Verifique usuário e senha.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex"
      style={{ background: "linear-gradient(135deg, #0A0F1A 0%, #1E3A8A 60%, #0A0F1A 100%)" }}
    >
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-[480px] p-12">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ background: "#2563EB" }}
          >
            <Car size={22} color="#fff" />
          </div>
          <div>
            <div className="text-white font-semibold tracking-wide" style={{ fontFamily: "var(--font-family, sans-serif)" }}>
              Protótipo ERP
            </div>
            <div className="text-xs" style={{ color: "#8AAEC8" }}>
              Sistema Integrado de Gestão
            </div>
          </div>
        </div>

        <div>
          <h1
            className="text-4xl font-light text-white leading-tight mb-6"
            style={{ fontFamily: "var(--font-family, sans-serif)", letterSpacing: "-0.5px" }}
          >
            Gestão completa da sua{" "}
            <span style={{ color: "#2563EB", fontWeight: 600 }}>oficina</span> e{" "}
            <span style={{ color: "#2563EB", fontWeight: 600 }}>varejo</span> em um só lugar.
          </h1>
          <div className="space-y-4">
            {[
              "Ordens de serviço integradas com estoque",
              "Painel Kanban em tempo real para mecânicos",
              "Dashboard financeiro consolidado",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <div
                  className="w-1.5 h-1.5 rounded-full mt-2 shrink-0"
                  style={{ background: "#2563EB" }}
                />
                <span className="text-sm" style={{ color: "#8AAEC8", fontFamily: "var(--font-family, sans-serif)" }}>
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-xs" style={{ color: "#4D6A82", fontFamily: "var(--font-family, sans-serif)" }}>
          © 2026 Protótipo ERP · Todos os direitos reservados
        </div>
      </div>

      {/* Right panel — login card */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div
          className="w-full max-w-[420px] rounded-2xl p-8 shadow-2xl"
          style={{ background: "#FFFFFF" }}
        >
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-8">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ background: "#2563EB" }}
            >
              <Car size={18} color="#fff" />
            </div>
            <span className="font-semibold" style={{ color: "#0A0F1A", fontFamily: "var(--font-family, sans-serif)" }}>
              Protótipo ERP
            </span>
          </div>

          <h2
            className="mb-1"
            style={{ color: "#0A0F1A", fontFamily: "var(--font-family, sans-serif)", fontWeight: 600, fontSize: "1.375rem" }}
          >
            Entrar no sistema
          </h2>
          <p className="text-sm mb-8" style={{ color: "#4B5563" }}>
            Insira suas credenciais de acesso
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Campo de Usuário (Login) */}
            <div>
              <label className="block text-sm mb-1.5" style={{ color: "#374151", fontWeight: 500 }}>
                Usuário
              </label>
              <div className="relative">
                <User size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }} />
                <input
                  type="text"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  placeholder="ex: carlos.ramos"
                  required
                  className="w-full pl-9 pr-4 py-3 rounded-lg text-sm outline-none transition-all"
                  style={{
                    border: "1.5px solid #D1D9E6",
                    background: "#F4F6FA",
                    color: "#0A0F1A",
                    fontFamily: "var(--font-family, sans-serif)",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#2563EB")}
                  onBlur={(e) => (e.target.style.borderColor = "#D1D9E6")}
                />
              </div>
            </div>

            {/* Campo de Senha */}
            <div>
              <label className="block text-sm mb-1.5" style={{ color: "#374151", fontWeight: 500 }}>
                Senha
              </label>
              <div className="relative">
                <Lock size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-9 pr-4 py-3 rounded-lg text-sm outline-none transition-all"
                  style={{
                    border: "1.5px solid #D1D9E6",
                    background: "#F4F6FA",
                    color: "#0A0F1A",
                    fontFamily: "var(--font-family, sans-serif)",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#2563EB")}
                  onBlur={(e) => (e.target.style.borderColor = "#D1D9E6")}
                />
              </div>
            </div>

            {/* Mensagem de Erro */}
            {error && (
              <div
                className="text-sm px-4 py-3 rounded-lg"
                style={{ background: "#FEF2F2", color: "#DC2626", border: "1px solid #FECACA" }}
              >
                {error}
              </div>
            )}

            {/* Botão de Entrar */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-medium text-white transition-all"
              style={{
                background: loading ? "#9CA3AF" : "#2563EB",
                cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "var(--font-family, sans-serif)",
              }}
              onMouseEnter={(e) => !loading && ((e.target as HTMLElement).style.background = "#1D4ED8")}
              onMouseLeave={(e) => !loading && ((e.target as HTMLElement).style.background = "#2563EB")}
            >
              {loading ? "Verificando..." : "Entrar no Sistema"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}