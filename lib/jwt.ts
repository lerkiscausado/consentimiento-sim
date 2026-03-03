import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);
const ALG = "HS256";
const EXPIRY = "8h";

export type SessionPayload = {
    id: number;
    nombre: string;
    email?: string;
    tipo?: string; // "empresa" | undefined (paciente)
};

/** Firma y devuelve un JWT con el payload dado */
export async function signJwt(payload: SessionPayload): Promise<string> {
    return new SignJWT({ ...payload })
        .setProtectedHeader({ alg: ALG })
        .setIssuedAt()
        .setExpirationTime(EXPIRY)
        .sign(SECRET);
}

/** Verifica un JWT y devuelve el payload, o null si es inválido/expirado */
export async function verifyJwt(token: string): Promise<SessionPayload | null> {
    try {
        const { payload } = await jwtVerify(token, SECRET);
        return payload as unknown as SessionPayload;
    } catch {
        return null;
    }
}

/** Lee y verifica el JWT de la cookie de sesión del request actual.
 *  Retorna el payload o null si no hay sesión válida. */
export async function getSessionFromCookie(): Promise<SessionPayload | null> {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session");
    if (!sessionCookie) return null;
    return verifyJwt(sessionCookie.value);
}
