import { NextResponse } from "next/server";
import { getSessionFromCookie } from "@/lib/jwt";
import pool from "@/lib/db";

export async function GET() {
    try {
        const session = await getSessionFromCookie();

        if (!session) {
            return NextResponse.json(
                { ok: false, message: "No autenticado" },
                { status: 401 }
            );
        }

        const { id, tipo } = session;

        if (tipo !== "empresa") {
            return NextResponse.json(
                { ok: false, message: "Acceso denegado" },
                { status: 403 }
            );
        }

        const [rows]: any = await pool.query(
            `SELECT 
          o.id,
          o.consecutivo,
          o.fecha_ingreso,
          CONCAT(u.id_tipo_identificacion, u.identificacion) AS identificacion,
          CONCAT(u.primer_nombre,' ', u.primer_apellido,' ', u.segundo_apellido) AS paciente,
          e.nombre AS estudio,
          s.nombre AS entidad,
          o.estado
      FROM ordenes o
      JOIN subentidades s ON o.id_subentidad = s.id
      JOIN especimenes e ON o.id_especimen = e.id
      JOIN usuarios u ON o.id_usuario = u.id
      WHERE o.id_contrato = ?
        AND (o.estado IS NULL OR o.estado <> 'CANCELADO')
      ORDER BY o.id DESC
      LIMIT 150`,
            [id]
        );

        return NextResponse.json({
            ok: true,
            data: rows,
        });
    } catch (error: any) {
        console.error("Error resultados-empresa:", error);
        return NextResponse.json(
            { ok: false, message: error.message },
            { status: 500 }
        );
    }
}
