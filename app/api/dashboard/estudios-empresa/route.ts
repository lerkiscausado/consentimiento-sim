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
        COUNT(*) AS total,
        MAX(fecha_ingreso) AS ultimo_estudio,
        COUNT(CASE WHEN estado = 'PENDIENTE' THEN 1 END) AS pendientes
      FROM ordenes 
      WHERE (estado IS NULL OR estado <> 'CANCELADO')`
        );

        const data = rows[0];

        return NextResponse.json({
            ok: true,
            data: {
                total: Number(data.total),
                ultimo_estudio: data.ultimo_estudio,
                pendientes: Number(data.pendientes),
            },
        });
    } catch (error: any) {
        console.error("Error estudios-empresa:", error);
        return NextResponse.json(
            { ok: false, message: error.message },
            { status: 500 }
        );
    }
}
