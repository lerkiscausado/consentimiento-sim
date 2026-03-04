"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

type Session = { id: number; nombre: string; tipo?: string };

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [session, setSession] = useState<Session | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.ok && data.session) {
          setSession({ id: data.session.id, nombre: data.session.nombre, tipo: data.session.tipo });
        }
      });
  }, []);

  // Cerrar sidebar al cambiar de ruta
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  const isActive = (path: string) => pathname === path;

  const SidebarContent = () => (
    <>
      <div className="flex flex-col gap-8">
        {/* Logo/Brand */}
        <div className="flex items-center gap-3 px-2">
          <div className="bg-portal-primary flex items-center justify-center rounded-lg size-10 text-white shrink-0">
            <span className="material-symbols-outlined">medical_services</span>
          </div>
          <div className="flex flex-col min-w-0">
            <h1 className="text-portal-text dark:text-white text-base font-bold leading-tight truncate">
              Portal Médico
            </h1>
            <p className="text-portal-muted dark:text-gray-400 text-xs font-medium">
              {session?.tipo === "empresa" ? "Acceso Empresa" : "Acceso Pacientes"}
            </p>
          </div>
        </div>
        {/* Navigation */}
        <nav className="flex flex-col gap-2">
          <Link
            href="/dashboard"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive("/dashboard")
              ? "bg-portal-primary/10 text-portal-primary"
              : "text-portal-text dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
          >
            <span className="material-symbols-outlined text-[24px]">
              description
            </span>
            <p className={`text-sm ${isActive("/dashboard") ? "font-semibold" : "font-medium"}`}>
              Pacientes            </p>
          </Link>
          {session?.tipo !== "empresa" && (
            <Link
              href="/dashboard/perfil"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive("/dashboard/perfil")
                ? "bg-portal-primary/10 text-portal-primary"
                : "text-portal-text dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
            >
              <span className="material-symbols-outlined text-[24px]">person</span>
              <p className={`text-sm ${isActive("/dashboard/perfil") ? "font-semibold" : "font-medium"}`}>
                Mi Perfil
              </p>
            </Link>
          )}
          <Link
            href="/dashboard/ayuda"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-portal-text dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <span className="material-symbols-outlined text-[24px]">help</span>
            <p className="text-sm font-medium">Ayuda</p>
          </Link>
        </nav>
      </div>
      {/* Footer Sidebar */}
      <div className="flex flex-col gap-4 border-t border-portal-border dark:border-gray-700 pt-6">
        <div className="flex items-center gap-3 px-2">
          <div className="size-10 rounded-full bg-portal-primary/20 flex items-center justify-center text-portal-primary border border-portal-border shrink-0">
            <span className="material-symbols-outlined text-[24px]">person</span>
          </div>
          <div className="flex flex-col overflow-hidden min-w-0">
            <p className="text-portal-text dark:text-white text-sm font-semibold truncate">
              {session?.nombre ?? "..."}
            </p>
            <p className="text-portal-muted dark:text-gray-400 text-xs truncate">
              {session?.tipo === "empresa" ? "Acceso Empresa" : "Acceso Pacientes"}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full"
        >
          <span className="material-symbols-outlined text-[24px]">logout</span>
          <p className="text-sm font-semibold">Cerrar Sesión</p>
        </button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-portal-bg-light dark:bg-portal-bg-dark font-[family-name:var(--font-manrope)] text-portal-text dark:text-white transition-colors duration-200">

      {/* ── MOBILE TOPBAR ── */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 h-14 bg-white dark:bg-portal-card border-b border-portal-border dark:border-gray-700">
        <div className="flex items-center gap-2">
          <div className="bg-portal-primary flex items-center justify-center rounded-lg size-8 text-white">
            <span className="material-symbols-outlined text-[18px]">medical_services</span>
          </div>
          <span className="font-bold text-sm text-portal-text dark:text-white">Portal Médico</span>
        </div>
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-portal-text dark:text-white transition-colors"
          aria-label="Abrir menú"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
      </header>

      {/* ── MOBILE OVERLAY ── */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── SIDEBAR (desktop: static | mobile: slide-in drawer) ── */}
      <aside
        className={`
          fixed lg:sticky top-0 h-screen z-50
          w-64 bg-white dark:bg-portal-card border-r border-portal-border dark:border-gray-700
          flex flex-col justify-between py-6 px-4 shrink-0
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* Close button — mobile only */}
        <button
          type="button"
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden absolute top-3 right-3 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-portal-muted transition-colors"
          aria-label="Cerrar menú"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        <SidebarContent />
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 flex flex-col min-w-0 pt-14 lg:pt-0">
        {children}
      </main>
    </div>
  );
}
