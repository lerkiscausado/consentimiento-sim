import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const [rows]: any = await pool.query(
      `SELECT 
        identificacion,
        nombre AS empresa,
        direccion,
        telefono,
        logo
      FROM empresa LIMIT 1`
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { ok: false, message: "Empresa no encontrada" },
        { status: 404 }
      );
    }

    const empresa = rows[0];

    // Convertir BLOB a Base64 si existe el logo
    if (empresa.logo) {
      const base64Logo = Buffer.from(empresa.logo).toString("base64");
      // Asumimos formato JPEG por defecto, pero esto permite renderizarlo directamente
      empresa.logo = `data:image/jpeg;base64,${base64Logo}`;
    }

    return NextResponse.json({
      ok: true,
      data: empresa,
    });
  } catch (error) {
    console.error("Error datos-empresa:", error);

    return NextResponse.json(
      {
        ok: false,
        message: "Error obteniendo datos de la empresa",
      },
      { status: 500 }
    );
  }
}
