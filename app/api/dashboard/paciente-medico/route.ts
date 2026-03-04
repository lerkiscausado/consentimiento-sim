import { getSessionFromCookie } from "@/lib/jwt";
import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(request: Request) {
    const session = await getSessionFromCookie();
    if (!session) {
        return NextResponse.json({ ok: false, message: "No autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
        return NextResponse.json({ ok: false, message: "ID de orden es requerido" }, { status: 400 });
    }

    try {
        const [rows]: any = await pool.query(
            `SELECT 
        o.id AS id_orden,
        CONCAT(u.id_tipo_identificacion, u.identificacion) AS identificacion,                       
        u.primer_nombre,
        NULLIF(u.segundo_nombre, '') AS segundo_nombre,
        u.primer_apellido,
        NULLIF(u.segundo_apellido, '') AS segundo_apellido,                        
        e.nombre AS especialista,
        e.especialidad,
        e.registro_medico,
        e.firma AS firmaMedico
      FROM ordenes o
      JOIN usuarios u ON o.id_usuario = u.id
      JOIN especialistas e ON o.id_empleado = e.id_especialista
      WHERE o.id = ?
      LIMIT 1`,
            [id]
        );

        if (rows.length === 0) {
            return NextResponse.json({ ok: false, message: "Orden o información de especialista no encontrada" }, { status: 404 });
        }

        const data = rows[0];
        // Convert firmaMedico Buffer to base64 if it exists
        if (data.firmaMedico && Buffer.isBuffer(data.firmaMedico)) {
            data.firmaMedico = `data:image/png;base64,${data.firmaMedico.toString('base64')}`;
        } else if (data.firmaMedico && typeof data.firmaMedico === 'object' && data.firmaMedico.type === 'Buffer') {
            // Handle JSON-serialized buffer
            data.firmaMedico = `data:image/png;base64,${Buffer.from(data.firmaMedico.data).toString('base64')}`;
        }

        return NextResponse.json({
            ok: true,
            datos: data
        });
    } catch (err: any) {
        return NextResponse.json({ ok: false, message: err.message }, { status: 500 });
    }
}
