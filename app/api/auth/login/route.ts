import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { signJwt } from "@/lib/jwt";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { usuario, password } = body;

    if (!usuario || !password) {
      return NextResponse.json(
        { ok: false, message: "Usuario y contraseña son obligatorios" },
        { status: 400 }
      );
    }

    const query = `
      SELECT 
              u.id,
              e.nombre_empleado AS empleado,
              c.nombre_cargo AS cargo
      FROM users u
      	JOIN empleados e ON u.id_empleado = e.id
      	JOIN cargos c ON e.id_cargo=c.id
      WHERE 
      	u.usuario = ? AND u.pass = ?
      LIMIT 1
    `;

    const [rows]: any = await pool.query(query, [usuario, password]);

    if (rows.length === 0) {
      return NextResponse.json(
        { ok: false, message: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    const userData = rows[0];

    const token = await signJwt({
      id: userData.id,
      nombre: userData.empleado,
      tipo: "empresa",
      cargo: userData.cargo,
    });

    const response = NextResponse.json({
      ok: true,
      usuario: {
        id: userData.id,
        nombre: userData.empleado,
        tipo: "empresa",
        cargo: userData.cargo,
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
