import { NextResponse } from "next/server";
import { getSessionFromCookie } from "@/lib/jwt";
import pool from "@/lib/db";

export type EstudiosResumen = {
  total: number;
  ultimo_estudio: string | null;
  pendientes: number;
};

export async function GET(request: Request) {
  try {
    const session = await getSessionFromCookie();

    if (!session) {
      return NextResponse.json(
        { ok: false, message: "No autenticado" },
        { status: 401 }
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

    const row = rows[0];
    const data: EstudiosResumen = {
      total: Number(row?.total ?? 0),
      ultimo_estudio: row?.ultimo_estudio ?? null,
      pendientes: Number(row?.pendientes ?? 0),
    };

    return NextResponse.json({
      ok: true,
      data,
    });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, message: err?.message ?? "Error obteniendo resumen de estudios" },
      { status: 500 }
    );
  }
}
