import { useState } from "react";
import { Car, Lock, User, ChevronDown } from "lucide-react";

type UserRole = "admin" | "atendente" | "mecanico";

interface LoginScreenProps {
  onLogin: (role: UserRole, name: string) => void;
}

const PROFILES: { value: UserRole; label: string; description: string }[] = [
  { value: "admin", label: "Administrador", description: "Acesso total ao sistema" },
  { value: "atendente", label: "Atendente", description: "Atendimento e ordens de serviço" },
  { value: "mecanico", label: "Mecânico", description: "Execução de serviços na oficina" },
];

const DEMO_USERS: Record<UserRole, { email: string; password: string; name: string }> = {
  admin: { email: "admin@erp.com.br", password: "admin123", name: "Carlos Mendes" },
  atendente: { email: "atendente@erp.com.br", password: "atend123", name: "Juliana Costa" },
  mecanico: { email: "mecanico@erp.com.br", password: "mec123", name: "Roberto Alves" },
};

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("atendente");
  const [profileOpen, setProfileOpen] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const selectedProfile = PROFILES.find((p) => p.value === role)!;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      const demo = DEMO_USERS[role];
      if (email === demo.email && password === demo.password) {
        onLogin(role, demo.name);
      } else {
        setError("Credenciais inválidas. Verifique e-mail, senha e perfil.");
      }
      setLoading(false);
    }, 800);
  }

  function fillDemo() {
    const demo = DEMO_USERS[role];
    setEmail(demo.email);
    setPassword(demo.password);
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
            <div className="text-white font-semibold tracking-wide" style={{ fontFamily: "var(--font-family)" }}>
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
            style={{ fontFamily: "var(--font-family)", letterSpacing: "-0.5px" }}
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
                <span className="text-sm" style={{ color: "#8AAEC8", fontFamily: "var(--font-family)" }}>
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-xs" style={{ color: "#4D6A82", fontFamily: "var(--font-family)" }}>
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
            <span className="font-semibold" style={{ color: "#0A0F1A", fontFamily: "var(--font-family)" }}>
              Protótipo ERP
            </span>
          </div>

          <h2
            className="mb-1"
            style={{ color: "#0A0F1A", fontFamily: "var(--font-family)", fontWeight: 600, fontSize: "1.375rem" }}
          >
            Entrar no sistema
          </h2>
          <p className="text-sm mb-8" style={{ color: "#4B5563" }}>
            Selecione seu perfil e insira as credenciais
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Profile selector */}
            <div>
              <label
                className="block text-sm mb-1.5"
                style={{ color: "#374151", fontWeight: 500, fontFamily: "var(--font-family)" }}
              >
                Perfil / Cargo
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-lg border text-left transition-all"
                  style={{
                    border: profileOpen ? "1.5px solid #2563EB" : "1.5px solid #D1D9E6",
                    background: "#F4F6FA",
                    fontFamily: "var(--font-family)",
                  }}
                >
                  <div>
                    <div className="text-sm font-medium" style={{ color: "#0A0F1A" }}>
                      {selectedProfile.label}
                    </div>
                    <div className="text-xs" style={{ color: "#4B5563" }}>
                      {selectedProfile.description}
                    </div>
                  </div>
                  <ChevronDown
                    size={16}
                    style={{ color: "#4B5563", transform: profileOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}
                  />
                </button>
                {profileOpen && (
                  <div
                    className="absolute top-full left-0 right-0 mt-1 rounded-lg border shadow-lg z-10 overflow-hidden"
                    style={{ background: "#FFFFFF", border: "1px solid #D1D9E6" }}
                  >
                    {PROFILES.map((p) => (
                      <button
                        key={p.value}
                        type="button"
                        onClick={() => { setRole(p.value); setProfileOpen(false); }}
                        className="w-full flex items-start gap-3 px-4 py-3 text-left transition-colors"
                        style={{
                          background: role === p.value ? "#EFF6FF" : "transparent",
                          borderLeft: role === p.value ? "3px solid #2563EB" : "3px solid transparent",
                        }}
                      >
                        <div>
                          <div className="text-sm font-medium" style={{ color: "#0A0F1A" }}>{p.label}</div>
                          <div className="text-xs" style={{ color: "#4B5563" }}>{p.description}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm mb-1.5" style={{ color: "#374151", fontWeight: 500 }}>
                E-mail / Usuário
              </label>
              <div className="relative">
                <User size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com.br"
                  required
                  className="w-full pl-9 pr-4 py-3 rounded-lg text-sm outline-none transition-all"
                  style={{
                    border: "1.5px solid #D1D9E6",
                    background: "#F4F6FA",
                    color: "#0A0F1A",
                    fontFamily: "var(--font-family)",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#2563EB")}
                  onBlur={(e) => (e.target.style.borderColor = "#D1D9E6")}
                />
              </div>
            </div>

            {/* Password */}
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
                    fontFamily: "var(--font-family)",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#2563EB")}
                  onBlur={(e) => (e.target.style.borderColor = "#D1D9E6")}
                />
              </div>
            </div>

            {error && (
              <div
                className="text-sm px-4 py-3 rounded-lg"
                style={{ background: "#FEF2F2", color: "#DC2626", border: "1px solid #FECACA" }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-medium text-white transition-all"
              style={{
                background: loading ? "#9CA3AF" : "#2563EB",
                cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "var(--font-family)",
              }}
              onMouseEnter={(e) => !loading && ((e.target as HTMLElement).style.background = "#1D4ED8")}
              onMouseLeave={(e) => !loading && ((e.target as HTMLElement).style.background = "#2563EB")}
            >
              {loading ? "Verificando..." : "Entrar no Sistema"}
            </button>

            <button
              type="button"
              onClick={fillDemo}
              className="w-full py-2 rounded-lg text-sm transition-colors"
              style={{
                background: "transparent",
                color: "#4B5563",
                border: "1px dashed #D1D9E6",
                fontFamily: "var(--font-family)",
                cursor: "pointer",
              }}
            >
              Preencher credenciais demo ({selectedProfile.label})
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
