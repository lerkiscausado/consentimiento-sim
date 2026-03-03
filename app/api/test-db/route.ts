import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const [rows2] = await pool.query("SELECT 1 + 1 AS result");
    const [rows] = await pool.query("SELECT nombre AS empresa FROM empresa LIMIT 1");
    return NextResponse.json({
      ok: true,
      data: rows,
    });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}
