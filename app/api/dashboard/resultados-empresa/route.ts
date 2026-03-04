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
          o.fecha_ingreso,
          CONCAT(u.id_tipo_identificacion, u.identificacion) AS identificacion,
          CONCAT(u.primer_nombre,' ', u.primer_apellido,' ', u.segundo_apellido) AS paciente,
          te.nombre_tipo_estudio AS estudio,
          c.nombre AS entidad,
          o.id as consecutivo,
          o.estado
      FROM ordenes o
      JOIN contratos c ON o.id_contrato = c.id
      JOIN tipo_estudio te ON o.id_tipo_estudio = te.id
      JOIN usuarios u ON o.id_usuario = u.id
      LEFT JOIN consentimiento_informado ci ON o.id=ci.id_orden
      WHERE ci.id_orden IS NULL AND (o.estado IS NULL OR o.estado <> 'CANCELADO')
      ORDER BY o.id DESC
      LIMIT 50`
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
