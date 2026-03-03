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

    const { id } = session;

    const [rows]: any = await pool.query(
      `
     SELECT 
    o.id,
    o.consecutivo,
    o.fecha_ingreso,
    e.nombre AS estudio,
    s.nombre AS entidad,
    o.estado
FROM ordenes o
JOIN subentidades s ON o.id_subentidad = s.id
JOIN especimenes e ON o.id_especimen = e.id
WHERE o.id_usuario = ? 
  AND (o.estado IS NULL OR o.estado <> 'CANCELADO')
ORDER BY o.id DESC;
      `,
      [id]
    );

    return NextResponse.json({
      ok: true,
      data: rows,
    });

  } catch (error: any) {
    return NextResponse.json(
      { ok: false, message: error.message },
      { status: 500 }
    );
  }
}
