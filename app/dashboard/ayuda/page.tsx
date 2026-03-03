"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AyudaPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
      {/* Encabezado */}
      <div>
        <h1 className="text-2xl font-bold">Centro de Ayuda</h1>
        <p className="text-sm text-muted-foreground">
          Encuentra respuestas a tus preguntas y soporte técnico
        </p>
      </div>

      {/* Tarjeta de Soporte Principal */}
      <Card className="bg-gradient-to-r from-portal-primary to-red-700 text-white border-none">
        <CardContent className="p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 rounded-full">
                <span className="material-symbols-outlined text-3xl">headset_mic</span>
              </div>
              <div>
                <h2 className="text-xl font-bold">¿Necesitas asistencia inmediata?</h2>
                <p className="text-red-100">Nuestro equipo de soporte está disponible 24/7</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3 min-w-[200px]">
            <Button variant="secondary" className="w-full gap-2 text-portal-primary font-semibold" asChild>
              <a href="tel:018000123456">
                <span className="material-symbols-outlined text-lg">call</span>
                01 8000 123 456
              </a>
            </Button>
            <Button variant="outline" className="w-full gap-2 border-red-300 text-red-100 hover:bg-red-700 hover:text-white bg-transparent" asChild>
              <a href="mailto:soporte@resultados-sim.com">
                <span className="material-symbols-outlined text-lg">mail</span>
                Enviar Correo
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Secciones de Ayuda con Tabs */}
      <Tabs defaultValue="faq" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="faq">Preguntas Frecuentes</TabsTrigger>
          <TabsTrigger value="perfil">Mi Perfil</TabsTrigger>
          <TabsTrigger value="resultados">Resultados</TabsTrigger>
        </TabsList>

        <TabsContent value="faq" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="material-symbols-outlined text-portal-primary">lock</span>
                  ¿Por qué no puedo editar mi nombre?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Por razones de seguridad y consistencia en su historia clínica, los datos de identificación (nombre, documento, fecha de nacimiento) no son editables directamente. Si detecta un error, por favor contacte a soporte.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="material-symbols-outlined text-portal-primary">visibility_off</span>
                  No veo mis resultados recientes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Los resultados pueden tardar hasta 24 horas en aparecer después de la validación del laboratorio. Asegúrese de actualizar la página o revisar los filtros de fecha.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="material-symbols-outlined text-portal-primary">key</span>
                  Olvidé mi contraseña
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Puede restablecer su contraseña desde la pantalla de inicio de sesión utilizando la opción "¿Olvidó su contraseña?" o contactando a nuestra línea de atención.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="material-symbols-outlined text-portal-primary">image</span>
                  ¿Cómo cambio mi foto de perfil?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Actualmente puede visualizar su foto de perfil la cual es gestionada administrativamente. Si desea actualizarla, acérquese a una de nuestras sedes.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="perfil" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Gestión de Perfil</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>En la sección de <Link href="/dashboard/perfil" className="text-portal-primary hover:underline">Perfil</Link>, usted puede consultar:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Su información personal básica.</li>
                <li>Sus datos de contacto (dirección, teléfono, email).</li>
                <li>Su foto de perfil actualizada.</li>
              </ul>
              <div className="p-4 bg-yellow-50 text-yellow-800 rounded-md border border-yellow-200 mt-4">
                <p className="text-sm font-medium flex items-center gap-2">
                  <span className="material-symbols-outlined">info</span>
                  Nota Importante
                </p>
                <p className="text-sm mt-1">
                  Mantenga sus datos de contacto actualizados para recibir notificaciones importantes sobre sus resultados y citas.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resultados" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Consulta de Resultados</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Para ver sus resultados de laboratorio:</p>
              <ol className="list-decimal pl-6 space-y-2 text-muted-foreground">
                <li>Diríjase a la sección "Resultados" en el menú lateral.</li>
                <li>Utilice los filtros de fecha para encontrar exámenes antiguos.</li>
                <li>Pude descargar el PDF haciendo clic en el icono correspondiente.</li>
              </ol>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
