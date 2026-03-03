import { redirect } from "next/navigation";
import Link from "next/link";
import { getSessionFromCookie } from "@/lib/jwt";
import { DashboardContent } from "./_components/dashboard-content";

export default async function DashboardPage() {
  const user = await getSessionFromCookie();

  if (!user) {
    redirect("/login");
  }

  return (
    <>
      <DashboardContent userName={user.nombre} tipo={user.tipo} />

      {/* Footer */}
      <div className="max-w-6xl w-full mx-auto px-6 flex flex-col items-center justify-center py-6 gap-2">
        <p className="text-sm text-portal-muted dark:text-gray-500 text-center">
          ¿Tienes problemas para ver tus resultados? Contacta a soporte técnico
          al{" "}
          <span className="font-bold text-portal-primary">0800-MED-AYUDA</span>
        </p>
        <div className="flex gap-4">
          <Link
            href="/terminos"
            className="text-xs text-portal-muted hover:underline"
          >
            Términos y Condiciones
          </Link>
          <Link
            href="/privacidad"
            className="text-xs text-portal-muted hover:underline"
          >
            Privacidad
          </Link>
          <Link
            href="/seguridad"
            className="text-xs text-portal-muted hover:underline"
          >
            Seguridad
          </Link>
        </div>
      </div>
    </>
  );
}
