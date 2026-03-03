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

    // 1️⃣ Citologías (id_tipo_estudio = 1 o 2)
    const [citologias]: any = await pool.query(
      `
      SELECT COUNT(*) AS total
      FROM ordenes
      WHERE (id_tipo_estudio = '1' OR id_tipo_estudio = '2')
        AND estado <> 'CANCELADO'
        AND id_usuario = ?
      `,
      [id]
    );

    // 2️⃣ Patologías (distinto de 1 y 2)
    const [patologias]: any = await pool.query(
      `
      SELECT COUNT(*) AS total
      FROM ordenes
      WHERE id_tipo_estudio <> '1'
        AND id_tipo_estudio <> '2'
        AND estado <> 'CANCELADO'
        AND id_usuario = ?
      `,
      [id]
    );

    // 3️⃣ Estudios totales
    const [estudios]: any = await pool.query(
      `
      SELECT COUNT(*) AS total
      FROM ordenes
      WHERE estado <> 'CANCELADO'
        AND id_usuario = ?
      `,
      [id]
    );

    // 4️⃣ Último estudio (fecha más reciente)
    let ultimoEstudio: string | null = null;
    try {
      const [ultimo]: any = await pool.query(
        `
        SELECT DATE(MAX(fecha)) AS fecha
        FROM ordenes
        WHERE estado <> 'CANCELADO' AND id_usuario = ?
        `,
        [id]
      );
      if (ultimo[0]?.fecha) {
        ultimoEstudio = new Date(ultimo[0].fecha).toLocaleDateString("es-ES", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
      }
    } catch {
      // columna fecha puede no existir
    }

    // 5️⃣ Pendientes
    let pendientes = 0;
    try {
      const [pend]: any = await pool.query(
        `
        SELECT COUNT(*) AS total
        FROM ordenes
        WHERE id_usuario = ? AND (estado = 'PENDIENTE' OR estado = 'EN_PROCESO' OR estado IS NULL)
        `,
        [id]
      );
      pendientes = Number(pend[0]?.total ?? 0);
    } catch {
      // ignorar
    }

    return NextResponse.json({
      ok: true,
      data: {
        citologias: citologias[0].total,
        patologias: patologias[0].total,
        estudios: estudios[0].total,
        ultimoEstudio: ultimoEstudio ?? undefined,
        pendientes,
      },
    });

  } catch (error: any) {
    return NextResponse.json(
      { ok: false, message: error.message },
      { status: 500 }
    );
  }
}
