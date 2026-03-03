"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

type Perfil = {
  tipo_identificacion: string;
  identificacion: string;
  primer_nombre: string;
  segundo_nombre: string;
  primer_apellido: string;
  segundo_apellido: string;
  genero: string;
  edad: string;
  direccion: string;
  telefono: string;
  email: string;
};

const initialPerfil: Perfil = {
  tipo_identificacion: "CC",
  identificacion: "",
  primer_nombre: "",
  segundo_nombre: "",
  primer_apellido: "",
  segundo_apellido: "",
  genero: "",
  edad: "",
  direccion: "",
  telefono: "",
  email: "",
};

const tipoLabels: Record<string, string> = {
  CC: "Cédula de ciudadanía",
  CE: "Cédula de extranjería",
  TI: "Tarjeta de identidad",
  PA: "Pasaporte",
};

function formatIdentificacion(tipo: string, num: string) {
  if (!num) return "";
  const label = tipoLabels[tipo] ? `${tipo} ` : "";
  return `${label}${num}`.trim();
}

export default function PerfilPage() {
  const [perfil, setPerfil] = useState<Perfil>(initialPerfil);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/dashboard/perfil")
      .then((res) => res.json())
      .then((data) => {
        if (data.ok && data.perfil) {
          const p = data.perfil;
          setPerfil({
            tipo_identificacion: p.tipo_identificacion ?? "CC",
            identificacion: p.identificacion ?? "",
            primer_nombre: p.primer_nombre ?? "",
            segundo_nombre: p.segundo_nombre ?? "",
            primer_apellido: p.primer_apellido ?? "",
            segundo_apellido: p.segundo_apellido ?? "",
            genero: p.genero ?? "",
            edad: p.edad !== undefined && p.edad !== null ? String(p.edad) : "",
            direccion: p.direccion ?? "",
            telefono: p.telefono ?? "",
            email: p.email ?? "",
          });
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (field: keyof Perfil, value: string) => {
    setPerfil((p) => ({ ...p, [field]: value }));
    setMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/dashboard/perfil", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(perfil),
      });
      const data = await res.json();
      if (data.ok) {
        setMessage({ type: "ok", text: "Perfil actualizado correctamente." });
      } else {
        setMessage({ type: "error", text: data.message || "Error al guardar." });
      }
    } catch {
      setMessage({ type: "error", text: "Error de conexión." });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setMessage(null);
    fetch("/api/dashboard/perfil")
      .then((res) => res.json())
      .then((data) => {
        if (data.ok && data.perfil) {
          const p = data.perfil;
          setPerfil({
            tipo_identificacion: p.tipo_identificacion ?? "CC",
            identificacion: p.identificacion ?? "",
            primer_nombre: p.primer_nombre ?? "",
            segundo_nombre: p.segundo_nombre ?? "",
            primer_apellido: p.primer_apellido ?? "",
            segundo_apellido: p.segundo_apellido ?? "",
            genero: p.genero ?? "",
            edad: p.edad != null ? String(p.edad) : "",
            direccion: p.direccion ?? "",
            telefono: p.telefono ?? "",
            email: p.email ?? "",
          });
        }
      });
  };

  const displayName =
    [perfil.primer_nombre, perfil.segundo_nombre, perfil.primer_apellido, perfil.segundo_apellido]
      .filter(Boolean)
      .join(" ")
      .trim() || "Usuario";
  const identificacionDisplay = formatIdentificacion(perfil.tipo_identificacion, perfil.identificacion) || "—";

  if (loading) {
    return (
      <div className="max-w-4xl w-full mx-auto px-6 py-8">
        <p className="text-portal-muted dark:text-gray-400">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl w-full mx-auto px-6 py-8 space-y-8">
      {/* Header: avatar + nombre + subtítulo + miembro desde */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-6">
        <div className="relative shrink-0">
          <div className="size-20 sm:size-24 rounded-full bg-portal-primary/20 dark:bg-portal-primary/30 border-2 border-portal-border dark:border-gray-600 flex items-center justify-center text-portal-primary">
            <span className="material-symbols-outlined text-4xl sm:text-5xl">person</span>
          </div>
          <button
            type="button"
            className="absolute bottom-0 right-0 size-8 rounded-full bg-portal-primary text-white flex items-center justify-center shadow-md hover:bg-portal-primary/90 transition-colors"
            aria-label="Editar foto de perfil"
          >
            <span className="material-symbols-outlined text-lg">edit</span>
          </button>
        </div>
        <div className="min-w-0">
          <h1 className="text-portal-text dark:text-white text-2xl sm:text-3xl font-bold truncate">
            {displayName}
          </h1>
          <p className="text-portal-muted dark:text-gray-400 text-sm mt-1">
            Gestiona tu información personal y de contacto
          </p>
          <p className="text-portal-primary text-sm font-medium mt-2">
            Miembro desde Octubre 2023
          </p>
        </div>
      </div>

      {/* Formulario de datos personales */}
      <form onSubmit={handleSubmit}>
        <Card className="bg-white dark:bg-portal-card border border-portal-border dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">
          <CardContent className="p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {/* Columna izquierda */}
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="identificacion" className="text-portal-text dark:text-gray-300 font-medium">
                    Identificación
                  </Label>
                  <div className="relative">
                    <Input
                      id="identificacion"
                      readOnly
                      value={identificacionDisplay}
                      className="border-portal-border dark:border-gray-600 dark:bg-gray-800/50 dark:text-gray-300 pr-10 cursor-not-allowed"
                    />
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-portal-muted dark:text-gray-500 text-lg pointer-events-none">
                      lock
                    </span>
                  </div>
                  <p className="text-portal-muted dark:text-gray-500 text-xs">
                    Este campo no puede ser editado por el usuario.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="genero" className="text-portal-text dark:text-gray-300 font-medium">
                    Género
                  </Label>
                  <Select value={perfil.genero || ""} onValueChange={(v) => handleChange("genero", v)}>
                    <SelectTrigger
                      id="genero"
                      className="w-full border-portal-border dark:border-gray-600 bg-transparent dark:text-white"
                    >
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="M">Masculino</SelectItem>
                      <SelectItem value="F">Femenino</SelectItem>
                      <SelectItem value="O">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-portal-text dark:text-gray-300 font-medium">
                    Correo Electrónico
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={perfil.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="correo@ejemplo.com"
                    className="border-portal-border dark:border-gray-600 dark:bg-transparent dark:text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefono" className="text-portal-text dark:text-gray-300 font-medium">
                    Teléfono
                  </Label>
                  <Input
                    id="telefono"
                    type="tel"
                    value={perfil.telefono}
                    onChange={(e) => handleChange("telefono", e.target.value)}
                    placeholder="+56 9 1234 5678"
                    className="border-portal-border dark:border-gray-600 dark:bg-transparent dark:text-white"
                  />
                </div>
              </div>

              {/* Columna derecha */}
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="primer_nombre" className="text-portal-text dark:text-gray-300 font-medium">
                    Primer nombre
                  </Label>
                  <Input
                    id="primer_nombre"
                    value={perfil.primer_nombre}
                    onChange={(e) => handleChange("primer_nombre", e.target.value)}
                    placeholder="Primer nombre"
                    className="border-portal-border dark:border-gray-600 dark:bg-transparent dark:text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="segundo_nombre" className="text-portal-text dark:text-gray-300 font-medium">
                    Segundo nombre
                  </Label>
                  <Input
                    id="segundo_nombre"
                    value={perfil.segundo_nombre}
                    onChange={(e) => handleChange("segundo_nombre", e.target.value)}
                    placeholder="Segundo nombre"
                    className="border-portal-border dark:border-gray-600 dark:bg-transparent dark:text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="primer_apellido" className="text-portal-text dark:text-gray-300 font-medium">
                    Primer apellido
                  </Label>
                  <Input
                    id="primer_apellido"
                    value={perfil.primer_apellido}
                    onChange={(e) => handleChange("primer_apellido", e.target.value)}
                    placeholder="Primer apellido"
                    className="border-portal-border dark:border-gray-600 dark:bg-transparent dark:text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="segundo_apellido" className="text-portal-text dark:text-gray-300 font-medium">
                    Segundo apellido
                  </Label>
                  <Input
                    id="segundo_apellido"
                    value={perfil.segundo_apellido}
                    onChange={(e) => handleChange("segundo_apellido", e.target.value)}
                    placeholder="Segundo apellido"
                    className="border-portal-border dark:border-gray-600 dark:bg-transparent dark:text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edad" className="text-portal-text dark:text-gray-300 font-medium">
                    Edad
                  </Label>
                  <Input
                    id="edad"
                    type="number"
                    min={1}
                    max={150}
                    value={perfil.edad}
                    onChange={(e) => handleChange("edad", e.target.value)}
                    placeholder="Edad"
                    className="border-portal-border dark:border-gray-600 dark:bg-transparent dark:text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="direccion" className="text-portal-text dark:text-gray-300 font-medium">
                    Dirección
                  </Label>
                  <Input
                    id="direccion"
                    value={perfil.direccion}
                    onChange={(e) => handleChange("direccion", e.target.value)}
                    placeholder="Avenida Providencia 1245, Oficina 402"
                    className="border-portal-border dark:border-gray-600 dark:bg-transparent dark:text-white"
                  />
                </div>
              </div>
            </div>

            {message && (
              <p
                className={`mt-4 text-sm ${
                  message.type === "ok"
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {message.text}
              </p>
            )}

            {/* Botones Cancelar y Guardar Cambios */}
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-8 pt-6 border-t border-portal-border dark:border-gray-700">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="border-portal-border dark:border-gray-600 text-portal-text dark:text-gray-300"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="bg-portal-primary hover:bg-portal-primary/90 text-white"
              >
                {saving ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>

      {/* Seguridad de la cuenta */}
      <Card className="bg-white dark:bg-portal-card border border-portal-border dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">
        <CardHeader className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                <span className="material-symbols-outlined text-2xl">shield</span>
              </div>
              <div>
                <h3 className="text-portal-text dark:text-white font-semibold">
                  Seguridad de la cuenta
                </h3>
                <p className="text-portal-muted dark:text-gray-400 text-sm mt-0.5">
                  Tu contraseña fue actualizada hace 3 meses
                </p>
              </div>
            </div>
            <Link
              href="/dashboard/perfil/cambiar-password"
              className="text-portal-primary hover:underline font-medium text-sm shrink-0"
            >
              Cambiar Contraseña
            </Link>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}
