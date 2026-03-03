"use client";

import { useEffect, useState } from "react";

type EstudiosResumen = {
  total: number;
  ultimo_estudio: string | null;
  pendientes: number;
};

type Props = {
  /** Si se pasa, se consulta el resumen para este id_usuario; si no, se usa el de la sesión */
  idUsuario?: number;
};

export function EstudiosTable({ idUsuario }: Props) {
  const [data, setData] = useState<EstudiosResumen | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (idUsuario != null) params.set("id", String(idUsuario));
    fetch(`/api/dashboard/estudios?${params}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.ok) setData(json.data);
      })
      .finally(() => setLoading(false));
  }, [idUsuario]);

  const total = data?.total ?? 0;
  const ultimoEstudio = data?.ultimo_estudio
    ? (() => {
        try {
          const d = new Date(data.ultimo_estudio);
          return Number.isNaN(d.getTime()) ? data.ultimo_estudio : d.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" });
        } catch {
          return data.ultimo_estudio;
        }
      })()
    : "—";
  const pendientes = data?.pendientes ?? 0;

  return (
    <div className="bg-white dark:bg-portal-card rounded-xl border border-portal-border dark:border-gray-700">
      <div className="px-6 py-5 border-b border-portal-border dark:border-gray-700">
        <h3 className="text-portal-text dark:text-white font-semibold text-lg">
          Resumen de estudios
        </h3>
        <p className="text-sm text-portal-muted dark:text-gray-400 mt-0.5">
          Órdenes no canceladas para el usuario consultado.
        </p>
      </div>
      <div className="p-6">
        {loading ? (
          <p className="text-portal-muted dark:text-gray-400">Cargando...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-lg border border-portal-border dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800/50">
              <p className="text-xs text-portal-muted dark:text-gray-400 font-medium uppercase tracking-wider">Total</p>
              <p className="text-xl font-bold text-portal-text dark:text-white mt-1">{total}</p>
            </div>
            <div className="rounded-lg border border-portal-border dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800/50">
              <p className="text-xs text-portal-muted dark:text-gray-400 font-medium uppercase tracking-wider">Último estudio</p>
              <p className="text-xl font-bold text-portal-text dark:text-white mt-1">{ultimoEstudio}</p>
            </div>
            <div className="rounded-lg border border-portal-border dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800/50">
              <p className="text-xs text-portal-muted dark:text-gray-400 font-medium uppercase tracking-wider">Pendientes</p>
              <p className="text-xl font-bold text-portal-text dark:text-white mt-1">{pendientes}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
