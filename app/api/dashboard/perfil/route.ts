import { getSessionFromCookie } from "@/lib/jwt";
import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  const session = await getSessionFromCookie();
  if (!session) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const { id } = session;

  try {
    const [rows]: any = await pool.query(
      `SELECT 
        CONCAT(id_tipo_identificacion, identificacion) AS identificacion,
        fecha_nacimiento,
        TIMESTAMPDIFF(YEAR, fecha_nacimiento, CURDATE()) AS edad,
        CASE 
            WHEN sexo = 'M' THEN 'Masculino'
            WHEN sexo = 'F' THEN 'Femenino'
            ELSE 'Otro/No especifica'
        END AS genero,
        primer_nombre,
        NULLIF(segundo_nombre, '') AS segundo_nombre,
        primer_apellido,
        NULLIF(segundo_apellido, '') AS segundo_apellido,
        telefono,
        correo_electronico,
        direccion,
        foto
      FROM usuarios
      WHERE id = ?
      LIMIT 1`,
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json({ ok: false, message: "Usuario no encontrado" }, { status: 404 });
    }

    const u = rows[0];



    return NextResponse.json({
      ok: true,
      perfil: {
        // Set type to empty string so the concatenated identification is displayed correctly
        // without double prefix in the frontend's existing logic
        tipo_identificacion: "",
        identificacion: u.identificacion ?? "",
        primer_nombre: u.primer_nombre ?? "",
        segundo_nombre: u.segundo_nombre ?? "",
        primer_apellido: u.primer_apellido ?? "",
        segundo_apellido: u.segundo_apellido ?? "",
        genero: u.genero,
        edad: u.edad != null ? String(u.edad) : "",
        fecha_nacimiento: u.fecha_nacimiento ? new Date(u.fecha_nacimiento).toISOString().split('T')[0] : "",
        direccion: u.direccion ?? "",
        telefono: u.telefono ?? "",
        email: u.correo_electronico ?? "",
        foto: (u.foto && u.foto.length > 0) ? `data:image/jpeg;base64,${u.foto.toString('base64')}` : null,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const session = await getSessionFromCookie();
  if (!session) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const { id } = session;

  try {
    const body = await request.json();
    const {
      identificacion,
      primer_nombre,
      segundo_nombre,
      primer_apellido,
      segundo_apellido,
      genero,
      edad,
      fecha_nacimiento,
      direccion,
      telefono,
      email,
    } = body;

    await pool.query(
      `UPDATE usuarios SET
        IDENTIFICACION = COALESCE(?, IDENTIFICACION),
        PRIMER_NOMBRE = COALESCE(?, PRIMER_NOMBRE),
        SEGUNDO_NOMBRE = COALESCE(?, SEGUNDO_NOMBRE),
        PRIMER_APELLIDO = COALESCE(?, PRIMER_APELLIDO),
        SEGUNDO_APELLIDO = COALESCE(?, SEGUNDO_APELLIDO),
        CORREO_ELECTRONICO = COALESCE(?, CORREO_ELECTRONICO),
        GENERO = COALESCE(?, GENERO),
        EDAD = COALESCE(?, EDAD),
        FECHA_NACIMIENTO = COALESCE(?, FECHA_NACIMIENTO),
        DIRECCION = COALESCE(?, DIRECCION),
        TELEFONO = COALESCE(?, TELEFONO)
      WHERE ID = ?`,
      [
        identificacion ?? null,
        primer_nombre ?? null,
        segundo_nombre ?? null,
        primer_apellido ?? null,
        segundo_apellido ?? null,
        email ?? null,
        genero ?? null,
        edad !== "" && edad != null ? Number(edad) : null,
        fecha_nacimiento ?? null,
        direccion ?? null,
        telefono ?? null,
        id,
      ]
    );

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err.message }, { status: 500 });
  }
}

