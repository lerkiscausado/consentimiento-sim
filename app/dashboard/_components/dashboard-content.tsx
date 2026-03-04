"use client";

import { useState } from "react";
import Link from "next/link";
import { Resumen } from "./resumen";
import { Resultados } from "./resultados";
import { ResultadosEmpresa } from "./resultados-empresa";

type Props = {
  userName: string;
  tipo?: string;
};

export function DashboardContent({ userName, tipo }: Props) {
  const [refreshKey, setRefreshKey] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Incrementar el refreshKey para forzar la recarga de los componentes
    setRefreshKey((prev) => prev + 1);
    // Simular un pequeño delay para mostrar el estado de carga
    setTimeout(() => {
      setIsRefreshing(false);
    }, 500);
  };

  return (
    <div className="max-w-6xl w-full mx-auto px-6 py-8 flex flex-col gap-8">
      {/* Page heading */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-portal-text dark:text-white text-3xl font-extrabold tracking-tight">
            Bienvenido, {userName}
          </h2>
          <p className="text-portal-muted dark:text-gray-400 text-base font-normal">
            Aquí puedes gestionar los consentimientos informados de los pacientes.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/dashboard/agendar"
            className="flex items-center gap-2 cursor-pointer overflow-hidden rounded-lg h-11 px-5 bg-portal-primary text-white text-sm font-bold tracking-wide shadow-sm hover:bg-portal-primary/90 transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">
              add_circle
            </span>
            <span>Agendar Cita</span>
          </Link>
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center justify-center gap-2 rounded-lg h-11 px-5 bg-[#f0f2f4] dark:bg-gray-800 text-portal-text dark:text-gray-200 text-sm font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRefreshing ? (
              <>
                <span className="material-symbols-outlined animate-spin">refresh</span>
                <span>Actualizando...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined">refresh</span>
                <span>Actualizar Datos</span>
              </>
            )}
          </button>
        </div>
      </div>
      {/* Resumen */}
      <Resumen refreshKey={refreshKey} tipo={tipo} />


      {/* Search + Table */}
      {tipo === "empresa" ? (
        <ResultadosEmpresa refreshKey={refreshKey} />
      ) : (
        <Resultados refreshKey={refreshKey} />
      )}
    </div>
  );
}
