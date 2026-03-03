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
  /** Key para forzar refresh de los datos */
  refreshKey?: number;
  /** Tipo de sesión: 'empresa' usa el endpoint correspondiente */
  tipo?: string;
};

export function Resumen({ idUsuario, refreshKey, tipo }: Props) {
  const [data, setData] = useState<EstudiosResumen | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    let url: string;
    if (tipo === "empresa") {
      url = "/api/dashboard/estudios-empresa";
    } else {
      const params = new URLSearchParams();
      if (idUsuario != null) params.set("id", String(idUsuario));
      url = `/api/dashboard/estudios?${params}`;
    }
    fetch(url)
      .then((r) => r.json())
      .then((json) => {
        if (json.ok) setData(json.data);
      })
      .finally(() => setLoading(false));
  }, [idUsuario, refreshKey, tipo]);

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
    <div>
      {loading ? (
        <p className="text-portal-muted dark:text-gray-400">Cargando...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-portal-card p-5 rounded-xl border border-portal-border dark:border-gray-700 shadow-sm flex items-center gap-4">
            <div className="size-12 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-portal-primary">
              <span className="material-symbols-outlined">folder_shared</span>
            </div>
            <div>
              <p className="text-xs text-portal-muted dark:text-gray-400 font-medium">
                Estudios Totales
              </p>
              <p className="text-xl font-bold dark:text-white">
                {total}
              </p>
            </div>
          </div>
          <div className="bg-white dark:bg-portal-card p-5 rounded-xl border border-portal-border dark:border-gray-700 shadow-sm flex items-center gap-4">
            <div className="size-12 rounded-full bg-green-50 dark:bg-green-900/30 flex items-center justify-center text-green-600">
              <span className="material-symbols-outlined">event_available</span>
            </div>
            <div>
              <p className="text-xs text-portal-muted dark:text-gray-400 font-medium">
                Último Estudio
              </p>
              <p className="text-xl font-bold dark:text-white">{ultimoEstudio}</p>
            </div>
          </div>
          <div className="bg-white dark:bg-portal-card p-5 rounded-xl border border-portal-border dark:border-gray-700 shadow-sm flex items-center gap-4">
            <div className="size-12 rounded-full bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-amber-600">
              <span className="material-symbols-outlined">
                notifications_active
              </span>
            </div>
            <div>
              <p className="text-xs text-portal-muted dark:text-gray-400 font-medium">
                Pendientes
              </p>
              <p className="text-xl font-bold dark:text-white">{pendientes}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
