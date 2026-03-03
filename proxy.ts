import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rutas públicas — siempre accesibles
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/api/auth/login") ||
    pathname.startsWith("/api/datos-empresa") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico")
  ) {
    return NextResponse.next();
  }

  // Verificar JWT de la cookie de sesión
  const sessionCookie = request.cookies.get("session");
  let valid = false;

  if (sessionCookie?.value) {
    try {
      await jwtVerify(sessionCookie.value, SECRET);
      valid = true;
    } catch {
      valid = false;
    }
  }

  if (!valid) {
    // Rutas API → 401
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { ok: false, message: "No autenticado" },
        { status: 401 }
      );
    }
    // Páginas → redirigir a login
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api/test-db|_next/static|_next/image).*)"],
};
