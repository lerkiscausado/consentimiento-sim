"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { SignatureDialog } from "./_components/signature-dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export default function ConsentimientoPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const id = searchParams.get("id");
    const docType = searchParams.get("type") || "consentimiento";
    const isDisentimiento = docType === "disentimiento";

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Form states
    const [municipio, setMunicipio] = useState("Cartagena de Indias");
    const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
    const [paciente, setPaciente] = useState("");
    const [identificacion, setIdentificacion] = useState("");
    const [firmaPaciente, setFirmaPaciente] = useState<string | null>(null);
    const [acudiente, setAcudiente] = useState("");
    const [relacion, setRelacion] = useState("");
    const [saving, setSaving] = useState(false);

    // Specialist states
    const [especialista, setEspecialista] = useState({
        nombre: "",
        especialidad: "",
        registro: "",
        firma: ""
    });

    const handleSave = async () => {
        if (!id || !firmaPaciente) return;

        setSaving(true);
        try {
            const res = await fetch("/api/dashboard/consentimiento-informado", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id_orden: parseInt(id),
                    fecha: new Date().toISOString(),
                    firma: firmaPaciente,
                    acudiente: acudiente || null,
                    relacion: relacion || null,
                    documento: docType
                }),
            });

            const data = await res.json();
            if (data.success) {
                toast.success("Consentimiento guardado exitosamente");
                // Delay redirect to let toast be visible
                setTimeout(() => {
                    router.push("/dashboard");
                }, 1500);
            } else {
                toast.error(data.error || "Error al guardar el consentimiento");
            }
        } catch (err) {
            console.error("Save error:", err);
            toast.error("Error de conexión al guardar");
        } finally {
            setSaving(false);
        }
    };

    useEffect(() => {
        if (!id) return;

        async function fetchData() {
            setLoading(true);
            try {
                const res = await fetch(`/api/dashboard/paciente-medico?id=${id}`);
                const data = await res.json();

                if (data.ok) {
                    const d = data.datos;
                    // Concatenate names
                    const fullName = [
                        d.primer_nombre,
                        d.segundo_nombre,
                        d.primer_apellido,
                        d.segundo_apellido
                    ].filter(Boolean).join(" ");

                    setPaciente(fullName);
                    setIdentificacion(d.identificacion);
                    setEspecialista({
                        nombre: d.especialista,
                        especialidad: d.especialidad,
                        registro: d.registro_medico,
                        firma: d.firmaMedico
                    });
                } else {
                    setError(data.message || "Error al cargar datos");
                }
            } catch (err) {
                setError("Error de conexión al servidor");
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-portal-primary"></div>
                <p className="mt-4 text-slate-600 dark:text-gray-400 font-medium">Cargando información del formulario...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="bg-white dark:bg-portal-card p-8 rounded-xl shadow-lg border border-red-100 dark:border-red-900/30 text-center max-w-md">
                    <span className="material-symbols-outlined text-red-500 text-5xl mb-4">error</span>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Error de Carga</h2>
                    <p className="text-slate-600 dark:text-gray-400 mb-6">{error}</p>
                    <button
                        onClick={() => router.back()}
                        className="bg-portal-primary text-white px-6 py-2 rounded-lg font-bold hover:bg-portal-primary/90 transition-colors"
                    >
                        Volver al Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-12 transition-colors">
            {/* Header Navigation */}
            <div className="bg-white dark:bg-portal-card border-b border-portal-border dark:border-gray-800 px-6 py-4 mb-8 sticky top-0 z-10 shadow-sm">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.back()}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-portal-text dark:text-white"
                        >
                            <span className="material-symbols-outlined">arrow_back</span>
                        </button>
                        <h1 className="font-bold text-lg text-portal-text dark:text-white">
                            Formulario de {isDisentimiento ? "Disentimiento" : "Consentimiento"}
                        </h1>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6">
                <div className="bg-white dark:bg-portal-card rounded-xl shadow-xl border border-portal-border dark:border-gray-800 overflow-hidden text-slate-800 dark:text-slate-200">

                    {/* Document Header Section */}
                    <div className="p-8 border-b border-portal-border dark:border-gray-800">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                            <div className="flex-1 text-center md:text-left">
                                <h1 className="text-2xl font-black tracking-widest text-portal-text dark:text-white uppercase mb-2">
                                    {isDisentimiento ? "DISENTIMIENTO INFORMADO" : "CONSENTIMIENTO INFORMADO"}
                                </h1>
                                <div className="h-0.5 w-full bg-slate-200 dark:bg-gray-700"></div>
                            </div>
                            <div className="text-xs space-y-1 font-mono text-slate-500 dark:text-gray-400 border-l border-slate-200 dark:border-gray-700 pl-6">
                                <p><span className="font-bold">Código:</span> FOR-CI-01</p>
                                <p><span className="font-bold">Versión:</span> 01</p>
                                <p><span className="font-bold">Vigencia:</span> 09/06/2023</p>
                            </div>
                        </div>
                    </div>

                    {/* Metadata Fields */}
                    <div className="px-8 py-6 bg-slate-50/50 dark:bg-gray-900/50 border-b border-portal-border dark:border-gray-800">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex items-center gap-3">
                                <label className="text-sm font-bold whitespace-nowrap">Municipio/Ciudad:</label>
                                <input
                                    type="text"
                                    value={municipio}
                                    readOnly
                                    onChange={(e) => setMunicipio(e.target.value)}
                                    className="flex-1 bg-slate-50 dark:bg-gray-900 border border-slate-300 dark:border-gray-700 rounded px-3 py-1 focus:outline-none transition-all cursor-default"
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                <label className="text-sm font-bold whitespace-nowrap">Fecha:</label>
                                <input
                                    type="date"
                                    value={fecha}
                                    readOnly
                                    onChange={(e) => setFecha(e.target.value)}
                                    className="flex-1 bg-slate-50 dark:bg-gray-900 border border-slate-300 dark:border-gray-700 rounded px-3 py-1 focus:outline-none transition-all cursor-default"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="p-8 space-y-8">
                        {/* Identity Line */}
                        <div className="flex flex-wrap items-center gap-3 text-base">
                            <span className="font-bold">Yo,</span>
                            <input
                                type="text"
                                value={paciente}
                                readOnly
                                className="min-w-[250px] bg-slate-50 dark:bg-gray-900 border border-slate-300 dark:border-gray-700 rounded px-3 py-1 focus:outline-none transition-all cursor-default"
                                placeholder="Nombre completo"
                            />
                            <span className="font-bold">identificado(a) con</span>
                            <input
                                type="text"
                                value={identificacion}
                                readOnly
                                className="min-w-[200px] bg-slate-50 dark:bg-gray-900 border border-slate-300 dark:border-gray-700 rounded px-3 py-1 focus:outline-none transition-all cursor-default"
                                placeholder="CC/TI/CE"
                            />
                        </div>

                        <div className="space-y-6 text-justify leading-relaxed text-slate-700 dark:text-gray-300">
                            {isDisentimiento ? (
                                <>
                                    <p>
                                        confirmo que he recibido información clara y comprensible sobre mi diagnóstico
                                        y las opciones de tratamiento disponibles, proporcionadas por el <span className="font-bold">Dr. {especialista.nombre || "Marcelo Ramírez Barrios"}</span>. Se me ha
                                        explicado de manera detallada la naturaleza de mi condición, así como los posibles enfoques terapéuticos,
                                        incluyendo los beneficios, riesgos y desventajas de cada uno de ellos.
                                    </p>
                                    <p>
                                        Así mismo, se me ha informado sobre los cuidados necesarios en caso de optar por alguna de las alternativas
                                        propuestas y la importancia de un seguimiento adecuado. Se me ha dejado claro que no seguir los
                                        tratamientos recomendados también puede tener implicaciones para mi salud a largo plazo.
                                    </p>
                                    <p>
                                        A pesar de la información recibida y de haber tenido la oportunidad de hacer preguntas, manifiesto mi
                                        decisión de no seguir los tratamientos propuestos en este momento. Reconozco que esta decisión es
                                        completamente voluntaria y que entiendo las consecuencias de no optar por los tratamientos recomendados.
                                        Declaro que mi decisión de no proceder con los tratamientos recomendados ha sido tomada de manera
                                        informada, consciente y voluntaria.
                                    </p>
                                </>
                            ) : (
                                <>
                                    <p>
                                        obrando en nombre propio y en pleno uso de mis facultades mentales, certifico que he sido informado de manera clara y comprensible sobre el procedimiento médico al cual seré sometido(a).
                                    </p>
                                    <p>
                                        He tenido la oportunidad de formular todas las preguntas necesarias, las cuales han sido resueltas satisfactoriamente. Comprendo la naturaleza del procedimiento, sus beneficios esperados, así como los riesgos inherentes y posibles complicaciones que podrían presentarse durante o después de su ejecución.
                                    </p>
                                    <p>
                                        Entiendo que ningún procedimiento médico está exento de riesgos y que los resultados pueden variar según el caso clínico. Por lo tanto, manifiesto mi voluntad libre y consciente de autorizar al personal médico y asistencial para la realización de dicho procedimiento, asumiendo la responsabilidad que de ello se derive.
                                    </p>
                                </>
                            )}
                        </div>

                        {/* Signature Blocks Container */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
                            {/* Patient Block */}
                            <div className="border border-slate-200 dark:border-gray-700 rounded-xl overflow-hidden flex flex-col group transition-all hover:border-portal-primary/50">
                                <div className="bg-slate-50 dark:bg-gray-800 px-4 py-2 border-b border-slate-200 dark:border-gray-700">
                                    <h3 className="text-xs font-bold uppercase tracking-wider">Firma del paciente o representante legal</h3>
                                </div>
                                <div className="p-6 flex flex-col flex-1">
                                    <div className="flex items-center gap-4 mb-6">
                                        <span className="text-sm font-bold whitespace-nowrap">Firma:</span>
                                        <SignatureDialog
                                            onAccept={(sig) => setFirmaPaciente(sig)}
                                            trigger={
                                                <div className="flex-1 h-32 bg-slate-50 dark:bg-gray-900 border border-slate-300 dark:border-gray-700 rounded-lg flex items-center justify-center overflow-hidden cursor-pointer hover:bg-slate-100 dark:hover:bg-gray-800 transition-all border-dashed relative group">
                                                    {firmaPaciente ? (
                                                        <img
                                                            src={firmaPaciente}
                                                            alt="Firma Paciente"
                                                            className="max-h-full object-contain mix-blend-multiply dark:mix-blend-normal brightness-90 dark:brightness-110"
                                                        />
                                                    ) : (
                                                        <div className="text-center">
                                                            <span className="italic text-xl font-serif text-slate-400 select-none block">{paciente || "Firma pendiente"}</span>
                                                            <span className="text-[10px] text-portal-primary font-bold uppercase tracking-tight opacity-0 group-hover:opacity-100 transition-opacity mt-1">Haga clic para firmar</span>
                                                        </div>
                                                    )}
                                                </div>
                                            }
                                        />
                                    </div>
                                    <div className="space-y-3 mt-auto border-t border-slate-100 dark:border-gray-800 pt-4">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-slate-500 font-medium">Nombre completo:</span>
                                            <span className="font-bold">{paciente || acudiente}</span>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                            <span className="text-slate-500 font-medium">Relación (si no es el paciente):</span>
                                            <input
                                                type="text"
                                                value={relacion}
                                                onChange={(e) => setRelacion(e.target.value)}
                                                placeholder="Ej: Esposo"
                                                className="text-right bg-transparent outline-none font-bold border-b border-dotted border-slate-300"
                                            />
                                        </div>
                                        <div className="flex justify-between text-xs">
                                            <span className="text-slate-500 font-medium">Firma Responsable (si no es paciente):</span>
                                            <input
                                                type="text"
                                                value={acudiente}
                                                onChange={(e) => setAcudiente(e.target.value)}
                                                placeholder="Nombre acudiente"
                                                className="text-right bg-transparent outline-none font-bold border-b border-dotted border-slate-300"
                                            />
                                        </div>
                                        <div className="flex justify-between text-xs">
                                            <span className="text-slate-500 font-medium">Fecha:</span>
                                            <span className="font-bold">{fecha}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Professional Block */}
                            <div className="border border-slate-200 dark:border-gray-700 rounded-xl overflow-hidden flex flex-col">
                                <div className="bg-slate-50 dark:bg-gray-800 px-4 py-2 border-b border-slate-200 dark:border-gray-700">
                                    <h3 className="text-xs font-bold uppercase tracking-wider">Firma del profesional de salud</h3>
                                </div>
                                <div className="p-6 flex flex-col flex-1">
                                    <div className="flex items-center gap-4 mb-6">
                                        <span className="text-sm font-bold whitespace-nowrap">Firma:</span>
                                        <div className="flex-1 h-32 bg-slate-50 dark:bg-gray-900 border border-slate-300 dark:border-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
                                            {especialista.firma ? (
                                                <img
                                                    src={especialista.firma}
                                                    alt="Firma Médica"
                                                    className="max-h-full object-contain mix-blend-multiply dark:mix-blend-normal brightness-90 dark:brightness-110"
                                                />
                                            ) : (
                                                <span className="italic text-xl font-serif text-slate-400 select-none">{especialista.nombre || "Dr. Especialista"}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="space-y-3 mt-auto border-t border-slate-100 dark:border-gray-800 pt-4">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-slate-500 font-medium">Nombre completo:</span>
                                            <span className="font-bold uppercase">{especialista.nombre}</span>
                                        </div>
                                        <div className="flex justify-between text-xs gap-4">
                                            <span className="text-slate-500 font-medium shrink-0">Especialidad:</span>
                                            <span className="font-bold text-right leading-tight">{especialista.especialidad}</span>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                            <span className="text-slate-500 font-medium">Registro profesional:</span>
                                            <span className="font-bold">{especialista.registro}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Primary Button with Confirmation */}
                        <div className="flex justify-center pt-8">
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <button
                                        disabled={saving || !firmaPaciente}
                                        className={`font-bold py-4 px-12 rounded-lg shadow-lg hover:shadow-xl transform transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-3 ${saving || !firmaPaciente
                                            ? 'bg-slate-300 dark:bg-gray-700 cursor-not-allowed opacity-70'
                                            : 'bg-portal-primary hover:bg-portal-primary/90 text-white'
                                            }`}
                                    >
                                        {saving ? (
                                            <>
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                                Guardando...
                                            </>
                                        ) : (
                                            <>
                                                <span className="material-symbols-outlined">save</span>
                                                Guardar {isDisentimiento ? "Disentimiento" : "Consentimiento"}
                                            </>
                                        )}
                                    </button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>¿Está seguro de guardar este {isDisentimiento ? "disentimiento" : "consentimiento"}?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Una vez guardado, el documento quedará registrado en el sistema con la fecha actual y la firma capturada.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                        <AlertDialogAction onClick={handleSave}>
                                            Confirmar y Guardar
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
