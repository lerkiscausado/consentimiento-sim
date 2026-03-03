import { NextResponse } from "next/server";
import { getSessionFromCookie } from "@/lib/jwt";
import pool from "@/lib/db";

export async function GET(request: Request) {
  try {
    const session = await getSessionFromCookie();

    if (!session) {
      return NextResponse.json(
        { ok: false, message: "No autenticado" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const consecutivoParam = searchParams.get("consecutivo");

    if (!consecutivoParam) {
      return NextResponse.json(
        { ok: false, message: "El parámetro 'consecutivo' es requerido" },
        { status: 400 }
      );
    }

    const consecutivo = Number(consecutivoParam);
    if (Number.isNaN(consecutivo)) {
      return NextResponse.json(
        { ok: false, message: "El parámetro 'consecutivo' debe ser un número válido" },
        { status: 400 }
      );
    }

    // Obtener el PDF desde documentospdf
    const [rows]: any = await pool.query(
      `SELECT pdf FROM documentospdf WHERE consecutivo = ?`,
      [consecutivo]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { ok: false, message: "Reporte no encontrado" },
        { status: 404 }
      );
    }

    const reporte = rows[0];

    return NextResponse.json({
      ok: true,
      data: {
        pdf: reporte.pdf,
      },
    });

  } catch (error: any) {
    return NextResponse.json(
      { ok: false, message: error.message },
      { status: 500 }
    );
  }
}
