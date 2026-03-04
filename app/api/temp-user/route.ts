import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

const dbConfig = {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "sim_database",
};

export async function GET() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows]: any = await connection.execute("SELECT usuario, pass FROM users LIMIT 1");
        await connection.end();
        return NextResponse.json(rows[0]);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
