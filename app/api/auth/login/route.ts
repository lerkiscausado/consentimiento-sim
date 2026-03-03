import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { signJwt } from "@/lib/jwt";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { tipoIdentificacion, identificacion, password } = body;

    if (!tipoIdentificacion || !identificacion || !password) {
      return NextResponse.json(
        { ok: false, message: "Datos incompletos" },
        { status: 400 }
      );
    }

    const user = `${tipoIdentificacion}${identificacion}`;

    const query = `
      SELECT 
        usuarios.id,
        CONCAT(
          usuarios.primer_nombre, ' ',
          usuarios.PRIMER_APELLIDO, ' ',
          usuarios.SEGUNDO_APELLIDO
        ) AS paciente,
         usuarios.correo_electronico AS email
      FROM ordenes
      INNER JOIN usuarios ON ordenes.ID_USUARIO = usuarios.ID
      INNER JOIN sesiones ON usuarios.id = sesiones.ID_USUARIO
      WHERE CONCAT(usuarios.ID_TIPO_IDENTIFICACION, usuarios.IDENTIFICACION) = ?
        AND sesiones.CONTRASENA = ?
      LIMIT 1
    `;

    const [rows]: any = await pool.query(query, [user, password]);

    if (rows.length === 0) {
      return NextResponse.json(
        { ok: false, message: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    const paciente = rows[0];

    const token = await signJwt({
      id: paciente.id,
      nombre: paciente.paciente,
      email: paciente.email,
    });

    const response = NextResponse.json({
      ok: true,
      paciente: {
        id: paciente.id,
        nombre: paciente.paciente,
        email: paciente.email,
      },
    });

    response.cookies.set("session", token, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 8, // 8 horas
    });

    return response;

  } catch (error: any) {
    return NextResponse.json(
      { ok: false, message: error.message },
      { status: 500 }
    );
  }
}
