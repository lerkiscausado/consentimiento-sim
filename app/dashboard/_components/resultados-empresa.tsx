"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type ResultadoEmpresa = {
    id: number;
    consecutivo: string | null;
    fecha_ingreso: string | null;
    identificacion: string;
    paciente: string;
    estudio: string;
    entidad: string;
    estado: string | null;
};

type Props = {
    refreshKey?: number;
};

export function ResultadosEmpresa({ refreshKey }: Props = {}) {
    const router = useRouter();
    const [data, setData] = useState<ResultadoEmpresa[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        setLoading(true);
        setError(null);
        fetch("/api/dashboard/resultados-empresa")
            .then((r) => r.json())
            .then((json) => {
                if (json.ok) {
                    setData(json.data || []);
                } else {
                    setError(json.message || "Error al cargar resultados");
                }
            })
            .catch(() => setError("Error al conectar con el servidor"))
            .finally(() => setLoading(false));
    }, [refreshKey]);

    const filteredData = data.filter((item) => {
        if (!searchTerm) return true;
        const s = searchTerm.toLowerCase();
        return (
            item.paciente.toLowerCase().includes(s) ||
            item.identificacion.toLowerCase().includes(s) ||
            item.estudio.toLowerCase().includes(s) ||
            item.entidad.toLowerCase().includes(s) ||
            (item.consecutivo && String(item.consecutivo).toLowerCase().includes(s))
        );
    });

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, refreshKey]);

    const formatDate = (dateString: string | null) => {
        if (!dateString) return "—";
        try {
            const date = new Date(dateString);
            if (Number.isNaN(date.getTime())) return dateString;
            return date.toLocaleDateString("es-ES", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            });
        } catch {
            return dateString;
        }
    };

    const [descargandoId, setDescargandoId] = useState<number | null>(null);
    const [errorDescarga, setErrorDescarga] = useState<string | null>(null);

    const descargarReportePdf = async (resultado: ResultadoEmpresa) => {
        setErrorDescarga(null);
        setDescargandoId(resultado.id);
        try {
            const params = new URLSearchParams({ consecutivo: String(resultado.id) });
            const res = await fetch(`/api/dashboard/reporte?${params}`);
            const data = await res.json();
            if (!data.ok) throw new Error(data.message || "Error al obtener el reporte");
            const pdfBase64 = data.data.pdf.data;
            if (!pdfBase64) throw new Error("No se recibió el PDF");
            const byteArray = new Uint8Array(pdfBase64);
            const blob = new Blob([byteArray], { type: "application/pdf" });
            const pdfUrl = URL.createObjectURL(blob);
            window.open(pdfUrl, "_blank");
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Error al descargar el PDF";
            setErrorDescarga(message);
        } finally {
            setDescargandoId(null);
        }
    };

    return (
        <div className="bg-white dark:bg-portal-card rounded-xl border border-portal-border dark:border-gray-700">
            <div className="px-6 py-5 border-b border-portal-border dark:border-gray-700">
                <h3 className="text-portal-text dark:text-white font-semibold text-lg">
                    Listado de pacientes Consentimientos Informados
                </h3>
                <p className="text-sm text-portal-muted dark:text-gray-400 mt-0.5">
                    Últimos 50 pacientes en admisiones.
                </p>
            </div>

            {/* Barra de búsqueda */}
            <div className="px-6 py-4 border-b border-portal-border dark:border-gray-700">
                <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-portal-muted dark:text-gray-400 text-lg">
                        search
                    </span>
                    <input
                        type="text"
                        placeholder="Buscar por paciente, identificación, estudio o entidad..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-portal-border dark:border-gray-700 rounded-lg text-sm text-portal-text dark:text-white placeholder:text-portal-muted dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-portal-primary/20 focus:border-portal-primary"
                    />
                </div>
            </div>

            <div className="p-6">
                {errorDescarga && (
                    <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm flex items-center justify-between gap-2">
                        <span>{errorDescarga}</span>
                        <button
                            type="button"
                            onClick={() => setErrorDescarga(null)}
                            className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/40"
                            aria-label="Cerrar"
                        >
                            <span className="material-symbols-outlined text-lg">close</span>
                        </button>
                    </div>
                )}

                {loading ? (
                    <div className="flex items-center justify-center py-8">
                        <p className="text-portal-muted dark:text-gray-400">Cargando resultados...</p>
                    </div>
                ) : error ? (
                    <div className="flex items-center justify-center py-8">
                        <p className="text-red-600 dark:text-red-400">{error}</p>
                    </div>
                ) : filteredData.length === 0 ? (
                    <div className="flex items-center justify-center py-8">
                        <p className="text-portal-muted dark:text-gray-400">
                            {searchTerm ? "No se encontraron resultados para tu búsqueda" : "No hay resultados disponibles"}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-portal-border dark:border-gray-700">
                                        <th className="text-left py-2.5 px-4 text-xs font-bold text-portal-text dark:text-white uppercase tracking-wider">Fecha</th>
                                        <th className="text-left py-2.5 px-4 text-xs font-bold text-portal-text dark:text-white uppercase tracking-wider">Paciente</th>
                                        <th className="text-left py-2.5 px-4 text-xs font-bold text-portal-text dark:text-white uppercase tracking-wider">Estudio</th>
                                        <th className="text-left py-2.5 px-4 text-xs font-bold text-portal-text dark:text-white uppercase tracking-wider">Entidad</th>
                                        <th className="text-left py-2.5 px-4 text-xs font-bold text-portal-text dark:text-white uppercase tracking-wider">Estado</th>
                                        <th className="text-left py-2.5 px-4 text-xs font-bold text-portal-text dark:text-white uppercase tracking-wider">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedData.map((resultado) => (
                                        <tr
                                            key={resultado.id}
                                            className="border-b border-portal-border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                        >
                                            <td className="py-3 px-4 text-xs text-portal-text dark:text-white whitespace-nowrap">
                                                {formatDate(resultado.fecha_ingreso)}
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-bold text-portal-text dark:text-white">
                                                        {resultado.paciente}
                                                    </span>
                                                    <span className="text-[10px] text-portal-muted dark:text-gray-400 mt-0.5">
                                                        {resultado.identificacion}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-xs text-portal-text dark:text-white">
                                                {resultado.estudio}
                                            </td>
                                            <td className="py-3 px-4 text-xs text-portal-text dark:text-white">
                                                {resultado.entidad}
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className={`px-2 py-1 text-[10px] font-bold rounded-full uppercase ${resultado.estado?.toUpperCase() === 'PENDIENTE'
                                                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                                    : resultado.estado?.toUpperCase() === 'CANCELADO'
                                                        ? 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                                                        : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                    }`}>
                                                    {resultado.estado || 'SIN ESTADO'}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => router.push(`/dashboard/consentimiento?id=${resultado.id}`)}
                                                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors flex items-center gap-1.5 border border-green-200 dark:border-green-800"
                                                    >
                                                        <span className="material-symbols-outlined text-sm">assignment_turned_in</span>
                                                        Consentimiento
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors flex items-center gap-1.5 border border-red-200 dark:border-red-800"
                                                    >
                                                        <span className="material-symbols-outlined text-sm">assignment_late</span>
                                                        Disentimiento
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Paginación */}
                        {totalPages > 1 && (
                            <div className="mt-6 flex items-center justify-between">
                                <p className="text-sm text-portal-muted dark:text-gray-400">
                                    Mostrando {paginatedData.length} de {filteredData.length} estudios
                                </p>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                                        disabled={currentPage === 1}
                                        className="p-2 rounded-lg border border-portal-border dark:border-gray-700 text-portal-text dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-lg">chevron_left</span>
                                    </button>
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                        <button
                                            key={page}
                                            type="button"
                                            onClick={() => setCurrentPage(page)}
                                            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${currentPage === page
                                                ? "bg-portal-primary text-white"
                                                : "text-portal-text dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                                        disabled={currentPage === totalPages}
                                        className="p-2 rounded-lg border border-portal-border dark:border-gray-700 text-portal-text dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-lg">chevron_right</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
