import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { signJwt } from "@/lib/jwt";

export async function POST(request: Request) {
    try {
        const { usuario, password } = await request.json();

        if (!usuario || !password) {
            return NextResponse.json(
                { ok: false, message: "Usuario y contraseña son obligatorios" },
                { status: 400 }
            );
        }

        const [rows]: any = await pool.query(
            `SELECT 
        contratos.id,
        contratos.nombre
      FROM contratos      
      WHERE usuario = ?
        AND contrasena = ?
      LIMIT 1`,
            [usuario, password]
        );

        if (rows.length === 0) {
            return NextResponse.json(
                { ok: false, message: "Credenciales inválidas" },
                { status: 401 }
            );
        }

        const empresa = rows[0];

        const token = await signJwt({
            id: empresa.id,
            nombre: empresa.nombre,
            tipo: "empresa",
        });

        const response = NextResponse.json({
            ok: true,
            empresa: {
                id: empresa.id,
                nombre: empresa.nombre,
            },
        });

        response.cookies.set("session", token, {
            httpOnly: true,
            path: "/",
            maxAge: 60 * 60 * 8, // 8 horas
        });

        return response;
    } catch (error) {
        console.error("Error login-empresa:", error);
        return NextResponse.json(
            { ok: false, message: "Error en el proceso de autenticación" },
            { status: 500 }
        );
    }
}
