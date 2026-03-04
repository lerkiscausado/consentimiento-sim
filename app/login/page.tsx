"use client";
import { useState, useEffect } from "react";

import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export default function LoginPage() {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [logoUrl, setLogoUrl] = useState("");
  const [empresaNombre, setEmpresaNombre] = useState("");
  const [loadingEmpresa, setLoadingEmpresa] = useState(true);

  useEffect(() => {
    const fetchEmpresaData = async () => {
      setLoadingEmpresa(true);
      try {
        const res = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/datos-empresa");
        const result = await res.json();
        console.log("Datos empresa:", result);

        if (result.ok && result.data) {
          setEmpresaNombre(result.data.empresa);
          if (result.data.logo) {
            setLogoUrl(result.data.logo);
          }
        }
      } catch (error) {
        console.error("Error fetching company data:", error);
      } finally {
        setLoadingEmpresa(false);
      }
    };

    fetchEmpresaData();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!usuario || !password) {
      setError("Usuario y contraseña son obligatorios");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ usuario, password }),
      });

      const data = await response.json();

      if (!data.ok) {
        throw new Error(data.message || "Credenciales inválidas");
      }

      if (data.usuario) {
        sessionStorage.setItem("usuario", JSON.stringify(data.usuario));
      }

      window.location.href = "/dashboard";
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa]">
      {/* Loading Overlay */}
      {loadingEmpresa && (
        <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="relative w-16 h-16 mx-auto">
              <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
            </div>
            <p className="text-sm text-muted-foreground">Cargando información...</p>
          </div>
        </div>
      )}

      {/* HEADER */}
      <header className="flex items-center justify-between px-4 sm:px-6 py-4 border-b bg-white">
        <span className="font-bold text-sm truncate max-w-[80vw]">SIM - {empresaNombre || ""}</span>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-[440px] space-y-6">
          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="text-center space-y-2">
                <div className="flex justify-center mb-4">
                  <img
                    src={logoUrl}
                    alt="Logo Resultados"
                    width={200}
                    height={80}
                    className="object-contain"
                  />
                </div>
                <h1 className="text-2xl font-semibold">Iniciar sesión</h1>
                <p className="text-sm text-muted-foreground">Ingresa tus credenciales</p>
              </div>

              <form className="space-y-4" onSubmit={handleLogin}>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Usuario</label>
                  <Input
                    placeholder="Usuario Consultorio o Ips"
                    value={usuario}
                    onChange={(e) => setUsuario(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Contraseña</label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Contraseña"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {error && (
                  <p className="text-sm text-red-500">{error}</p>
                )}

                <Button className="w-full" disabled={loading}>
                  {loading ? "Validando..." : "Iniciar sesión"}
                </Button>

              </form>
            </CardContent>

            <CardFooter className="flex justify-center">
              <button className="text-xs text-muted-foreground hover:text-black">
                ¿Necesitas ayuda para ingresar?
              </button>
            </CardFooter>
          </Card>
          {/* FOOTER INFO */}
          <div className="text-center text-xs text-muted-foreground space-y-4">
            <p>
              Al continuar, aceptas nuestros{" "}
              <a className="underline hover:text-primary" href="#">
                Términos y Condiciones
              </a>
              .
            </p>
            <div className="flex justify-center gap-1 opacity-60">
              <span>🔒</span>
              <span>Conexión cifrada de alta seguridad</span>
            </div>
          </div>
        </div>
      </main>
      {/* FOOTER */}
      <footer className="py-5 border-t bg-white mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © 2026 SIM Sistema Integrado Médico.
          </p>
          <div className="flex gap-6">
            <a className="text-xs text-muted-foreground hover:text-black" href="#">
              Soporte
            </a>
            <a className="text-xs text-muted-foreground hover:text-black" href="#">
              Manual
            </a>
            <a className="text-xs text-muted-foreground hover:text-black" href="#">
              Contacto
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
