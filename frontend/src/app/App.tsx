import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginScreen } from "./components/LoginScreen";
import { Sidebar } from "./components/Sidebar";
import { AttendantView } from "./components/AttendantView";
import { MechanicView } from "./components/MechanicView";
import { AdminView } from "./components/AdminView";
import { Bell, Menu, X } from "lucide-react";
import { useAuth } from "../contexts/AuthContext.tsx";

type UserRole = "admin" | "atendente" | "mecanico";

const DEFAULT_PAGE: Record<UserRole, string> = {
  admin: "financeiro",
  atendente: "dashboard",
  mecanico: "kanban",
};

const NOTIFICATIONS = [
  { id: 1, text: "OS-2038 aguardando peças há 2h", type: "warning" },
  { id: 2, text: "Estoque crítico: Correia Dentada (3 un.)", type: "error" },
  { id: 3, text: "OS-2041 aprovada pelo cliente", type: "success" },
];

export default function App() {
  // Usando o contexto de autenticação em vez de estado local
  const { user, isAuthenticated, isLoading, signOut } = useAuth();
  const navigate = useNavigate();
  
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotif, setShowNotif] = useState(false);

  // Tela de carregamento enquanto verifica o token
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-blue-600 font-semibold text-lg">Carregando sistema...</div>
      </div>
    );
  }

  // Se não estiver autenticado, mostra a tela de login (sem passar props)
  if (!isAuthenticated || !user) {
    return <LoginScreen />;
  }

  // Define o role com base no que veio do backend, com fallback seguro
  const role = (user.perfil === "admin" || user.perfil === "atendente" || user.perfil === "mecanico") 
    ? user.perfil 
    : "atendente";

  const userName = user.nome || "Usuário";

  function handleLogout() {
    signOut();
    navigate("/");
    setSidebarOpen(false);
  }

  const notifColors: Record<string, string> = {
    warning: "#F59E0B",
    error: "#EF4444",
    success: "#22C55E",
  };

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: "#F0F4F8", fontFamily: "var(--font-family, sans-serif)" }}
    >
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 lg:hidden"
          style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — fixed on desktop, drawer on mobile */}
      <div
        className="fixed lg:static inset-y-0 left-0 z-30 transition-transform lg:translate-x-0 flex-shrink-0"
        style={{
          transform: sidebarOpen ? "translateX(0)" : undefined,
          width: 240,
        }}
      >
        <div className="h-full">
          <Sidebar
            role={role}
            userName={userName}
            currentPage={currentPage}
            onPageChange={(page) => {
              setCurrentPage(page);
              setSidebarOpen(false);
            }}
            onLogout={handleLogout}
          />
        </div>
      </div>

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Topbar */}
        <header
          className="flex items-center justify-between px-5 py-3 shrink-0"
          style={{
            background: "#FFFFFF",
            borderBottom: "1px solid #D1D9E6",
            height: 56,
          }}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-1.5 rounded-lg transition-colors"
              style={{ color: "#4B5563" }}
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div>
              <span className="text-sm font-semibold" style={{ color: "#0A0F1A" }}>
                Protótipo ERP
              </span>
              <span className="hidden sm:inline text-xs ml-2 px-2 py-0.5 rounded-full" style={{ background: "#EFF6FF", color: "#2563EB" }}>
                {role === "admin" ? "Módulo Gerencial" : role === "atendente" ? "Módulo Atendimento" : "Módulo Oficina"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotif(!showNotif)}
                className="relative p-2 rounded-lg transition-colors"
                style={{ color: "#4B5563", background: showNotif ? "#F0F4F8" : "transparent" }}
              >
                <Bell size={18} />
                <span
                  className="absolute top-1 right-1 w-2 h-2 rounded-full"
                  style={{ background: "#EF4444" }}
                />
              </button>
              {showNotif && (
                <div
                  className="absolute right-0 top-full mt-2 w-80 rounded-xl shadow-xl z-40 overflow-hidden"
                  style={{ background: "#fff", border: "1px solid #D1D9E6" }}
                >
                  <div className="px-4 py-3" style={{ borderBottom: "1px solid #F0F4F8" }}>
                    <span className="text-sm font-semibold" style={{ color: "#0A0F1A" }}>Notificações</span>
                  </div>
                  {NOTIFICATIONS.map((n) => (
                    <div
                      key={n.id}
                      className="flex items-start gap-3 px-4 py-3"
                      style={{ borderBottom: "1px solid #F0F4F8" }}
                    >
                      <span
                        className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                        style={{ background: notifColors[n.type] }}
                      />
                      <span className="text-xs" style={{ color: "#374151" }}>{n.text}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* User avatar */}
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold cursor-pointer"
              style={{ background: "#1E3A8A", color: "#fff" }}
            >
              {userName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto">
          {role === "atendente" && (
            <AttendantView currentPage={currentPage as any} onPageChange={setCurrentPage} />
          )}
          {role === "mecanico" && (
            <MechanicView currentPage={currentPage as any} />
          )}
          {role === "admin" && (
            <AdminView currentPage={currentPage as any} />
          )}
        </main>
      </div>
    </div>
  );
}