"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { es } from "date-fns/locale";

type Perfil = {
  tipo_identificacion: string;
  identificacion: string;
  primer_nombre: string;
  segundo_nombre: string;
  primer_apellido: string;
  segundo_apellido: string;
  genero: string;
  edad: string;
  fecha_nacimiento: string;
  direccion: string;
  telefono: string;
  email: string;
  foto?: string | null;
};

const initialPerfil: Perfil = {
  tipo_identificacion: "",
  identificacion: "",
  primer_nombre: "",
  segundo_nombre: "",
  primer_apellido: "",
  segundo_apellido: "",
  genero: "",
  edad: "",
  fecha_nacimiento: "",
  direccion: "",
  telefono: "",
  email: "",
  foto: null,
};

const generoLabels: Record<string, string> = {
  M: "Masculino",
  F: "Femenino",
  O: "Otro",
};

export default function PerfilPage() {
  const [perfil, setPerfil] = useState<Perfil>(initialPerfil);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/perfil")
      .then((res) => res.json())
      .then((data) => {
        if (data.ok && data.perfil) {
          const p = data.perfil;
          setPerfil({
            tipo_identificacion: p.tipo_identificacion ?? "",
            identificacion: p.identificacion ?? "",
            primer_nombre: p.primer_nombre ?? "",
            segundo_nombre: p.segundo_nombre ?? "",
            primer_apellido: p.primer_apellido ?? "",
            segundo_apellido: p.segundo_apellido ?? "",
            genero: p.genero ?? "",
            edad: p.edad != null ? String(p.edad) : "",
            fecha_nacimiento: p.fecha_nacimiento ?? "",
            direccion: p.direccion ?? "",
            telefono: p.telefono ?? "",
            email: p.email ?? "",
            foto: p.foto,
          });
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const displayName =
    [perfil.primer_nombre, perfil.segundo_nombre, perfil.primer_apellido, perfil.segundo_apellido]
      .filter(Boolean)
      .join(" ") || "Usuario";

  if (loading) {
    return <p className="p-6 text-muted-foreground">Cargando...</p>;
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-6">
        <div className="relative">
          <div className="size-24 rounded-full bg-gradient-to-br from-red-500/20 to-red-500/10 border flex items-center justify-center overflow-hidden">
            <img
              src={perfil.foto || "/perfil.webp"}
              alt="Foto de perfil"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-bold">{displayName}</h1>
          <p className="text-sm text-muted-foreground">
            Consulta tu información personal y de contacto
          </p>
          <p className="text-sm text-red-600 font-medium mt-1">
            Miembro desde Octubre 2023
          </p>
        </div>
      </div>

      {/* Información del Perfil */}
      <Card>
        <CardContent className="p-8 space-y-8">
          {/* Identificación y Fecha de Nacimiento */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <Label className="text-muted-foreground text-xs uppercase tracking-wider">Identificación</Label>
              <p className="font-medium text-lg">{perfil.identificacion || "No registrada"}</p>
            </div>

            <div className="space-y-1">
              <Label className="text-muted-foreground text-xs uppercase tracking-wider">Fecha de Nacimiento</Label>
              <p className="font-medium text-lg flex items-center gap-2">
                <span className="material-symbols-outlined text-gray-400 text-xl">calendar_today</span>
                {perfil.fecha_nacimiento ? (
                  format(new Date(perfil.fecha_nacimiento + "T00:00:00"), "PPP", {
                    locale: es,
                  })
                ) : (
                  "No registrada"
                )}
              </p>
            </div>
          </div>

          <div className="h-px bg-gray-100 dark:bg-gray-800" />

          {/* Nombres Completos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div className="space-y-1">
              <Label className="text-muted-foreground text-xs uppercase tracking-wider">Primer Nombre</Label>
              <p className="font-medium">{perfil.primer_nombre}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-muted-foreground text-xs uppercase tracking-wider">Segundo Nombre</Label>
              <p className="font-medium">{perfil.segundo_nombre || "-"}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-muted-foreground text-xs uppercase tracking-wider">Primer Apellido</Label>
              <p className="font-medium">{perfil.primer_apellido}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-muted-foreground text-xs uppercase tracking-wider">Segundo Apellido</Label>
              <p className="font-medium">{perfil.segundo_apellido || "-"}</p>
            </div>
          </div>

          <div className="h-px bg-gray-100 dark:bg-gray-800" />

          {/* Datos demográficos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1">
              <Label className="text-muted-foreground text-xs uppercase tracking-wider">Género</Label>
              <p className="font-medium">{generoLabels[perfil.genero] || perfil.genero || "No especificado"}</p>
            </div>

            <div className="space-y-1">
              <Label className="text-muted-foreground text-xs uppercase tracking-wider">Edad</Label>
              <p className="font-medium">{perfil.edad ? `${perfil.edad} años` : "No especificada"}</p>
            </div>

            <div className="space-y-1">
              <Label className="text-muted-foreground text-xs uppercase tracking-wider">Teléfono</Label>
              <p className="font-medium">{perfil.telefono || "No registrado"}</p>
            </div>
          </div>

          <div className="h-px bg-gray-100 dark:bg-gray-800" />

          {/* Datos de contacto */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <Label className="text-muted-foreground text-xs uppercase tracking-wider">Correo Electrónico</Label>
              <p className="font-medium">{perfil.email || "No registrado"}</p>
            </div>

            <div className="space-y-1">
              <Label className="text-muted-foreground text-xs uppercase tracking-wider">Dirección</Label>
              <p className="font-medium">{perfil.direccion || "No registrada"}</p>
            </div>
          </div>

        </CardContent>
      </Card>

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
                  Gestiona tu contraseña y seguridad
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

