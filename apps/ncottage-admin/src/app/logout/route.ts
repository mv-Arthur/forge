import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { clearToken } from "@/lib/session";

// Чистит cookie и уводит на логин. Используется при 401 (протухший/невалидный
// токен), чтобы не зациклить middleware на присутствии cookie.
export async function GET(req: NextRequest) {
    await clearToken();
    return NextResponse.redirect(new URL("/login?expired=1", req.url));
}
