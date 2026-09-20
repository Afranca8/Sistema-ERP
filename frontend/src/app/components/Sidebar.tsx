import { Car, LayoutDashboard, Users, FileText, CreditCard, Wrench, Package, BarChart3, UserCog, LogOut, ChevronRight, Truck, PackagePlus, Wallet, HardHat, ClipboardList, ReceiptText, Layers } from "lucide-react";

type UserRole = "admin" | "atendente" | "mecanico";
type Page = string;

interface NavItem {
  id: Page;
  label: string;
  icon: React.ReactNode;
}

const NAV_ITEMS: Record<UserRole, NavItem[]> = {
  atendente: [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { id: "clientes", label: "Clientes & Veículos", icon: <Users size={18} /> },
    { id: "ordens", label: "Ordens de Serviço", icon: <FileText size={18} /> },
    { id: "pagamento", label: "Fechamento & Pagamento", icon: <CreditCard size={18} /> },
  ],
  mecanico: [
    { id: "kanban", label: "Painel de Serviços", icon: <Wrench size={18} /> },
    { id: "execucao", label: "Execução de OS", icon: <FileText size={18} /> },
  ],
  admin: [
    { id: "financeiro", label: "Dashboard Financeiro", icon: <BarChart3 size={18} /> },
    { id: "contas_receber", label: "Contas a Receber", icon: <ReceiptText size={18} /> },
    { id: "contas_prazo", label: "Contas a Prazo", icon: <Layers size={18} /> },
    { id: "catalogo_servicos", label: "Catálogo de Serviços", icon: <ClipboardList size={18} /> },
    { id: "modelos", label: "Modelos de Veículos", icon: <Car size={18} /> },
    { id: "profissionais", label: "Profissionais", icon: <HardHat size={18} /> },
    { id: "usuarios", label: "Gestão de Usuários", icon: <UserCog size={18} /> },
  ],
};

const ROLE_LABELS: Record<UserRole, string> = {
  admin: "Administrador",
  atendente: "Atendente",
  mecanico: "Mecânico",
};

interface SidebarProps {
  role: UserRole;
  userName: string;
  currentPage: Page;
  onPageChange: (page: Page) => void;
  onLogout: () => void;
}

export function Sidebar({ role, userName, currentPage, onPageChange, onLogout }: SidebarProps) {
  const items = NAV_ITEMS[role];

  return (
    <aside
      className="flex flex-col h-full w-60 shrink-0"
      style={{ background: "#0A0F1A", borderRight: "1px solid rgba(255,255,255,0.06)" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: "#2563EB" }}
        >
          <Car size={18} color="#fff" />
        </div>
        <div>
          <div
            className="font-semibold leading-none"
            style={{ color: "#FFFFFF", fontSize: "0.9rem", fontFamily: "var(--font-family)" }}
          >
            Protótipo ERP
          </div>
          <div className="text-xs mt-0.5" style={{ color: "#4D6A82" }}>
            v2.4.1
          </div>
        </div>
      </div>

      {/* Role badge */}
      <div className="px-5 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium"
          style={{ background: "rgba(249,115,22,0.18)", color: "#2563EB" }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: "#2563EB", boxShadow: "0 0 6px #2563EB" }}
          />
          {ROLE_LABELS[role]}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {items.map((item) => {
          const active = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all text-left"
              style={{
                background: active ? "#2563EB" : "transparent",
                color: active ? "#FFFFFF" : "#8AAEC8",
                fontFamily: "var(--font-family)",
                fontWeight: active ? 500 : 400,
              }}
              onMouseEnter={(e) => {
                if (!active) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)";
              }}
              onMouseLeave={(e) => {
                if (!active) (e.currentTarget as HTMLElement).style.background = "transparent";
              }}
            >
              <span style={{ opacity: active ? 1 : 0.7 }}>{item.icon}</span>
              <span className="flex-1">{item.label}</span>
              {active && <ChevronRight size={14} style={{ opacity: 0.7 }} />}
            </button>
          );
        })}
      </nav>

      {/* Bottom — user info + logout */}
      <div className="px-3 pb-4" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="flex items-center gap-3 px-3 py-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-semibold"
            style={{ background: "#1E3A8A", color: "#2563EB" }}
          >
            {userName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div
              className="text-sm font-medium truncate"
              style={{ color: "#C8D5E8", fontFamily: "var(--font-family)" }}
            >
              {userName}
            </div>
            <div className="text-xs" style={{ color: "#4D6A82" }}>
              {ROLE_LABELS[role]}
            </div>
          </div>
          <button
            onClick={onLogout}
            className="p-1.5 rounded-md transition-colors"
            title="Sair"
            style={{ color: "#4D6A82" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#EF4444")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#4D6A82")}
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}