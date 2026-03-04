import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import { getSessionFromCookie } from "@/lib/jwt";

// Database configuration
const dbConfig = {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "sim_database",
};

export async function POST(request: Request) {
    try {
        // 1. Authorization check
        const session = await getSessionFromCookie();
        if (!session) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 });
        }

        // 2. Parse request body
        const body = await request.json();
        const { id_orden, fecha, firma, acudiente, relacion, documento } = body;

        // 3. Validation
        if (!id_orden || !fecha || !documento) {
            return NextResponse.json(
                { error: "Faltan campos obligatorios (id_orden, fecha, documento)" },
                { status: 400 }
            );
        }

        // 4. Handle signature (Base64 to Buffer/Blob)
        let firmaBuffer = null;
        if (firma && typeof firma === 'string' && firma.startsWith('data:image')) {
            // Extract base64 data
            const base64Data = firma.split(',')[1];
            firmaBuffer = Buffer.from(base64Data, 'base64');
        }

        // 5. Database insertion
        const connection = await mysql.createConnection(dbConfig);

        const query = `
      INSERT INTO consentimiento_informado (
        id_orden, 
        fecha, 
        firma, 
        acudiente, 
        relacion, 
        documento
      ) VALUES (?, ?, ?, ?, ?, ?)
    `;

        const [result] = await connection.execute(query, [
            id_orden,
            fecha,
            firmaBuffer,
            acudiente || null,
            relacion || null,
            documento
        ]);

        await connection.end();

        return NextResponse.json({
            success: true,
            message: "Registro guardado correctamente",
            id: (result as any).insertId
        });

    } catch (error: any) {
        console.error("Error saving consentimiento:", error);
        return NextResponse.json(
            { error: "Error interno del servidor", details: error.message },
            { status: 500 }
        );
    }
}
