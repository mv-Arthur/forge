import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { TOKEN_COOKIE } from "@/lib/session";

export function middleware(req: NextRequest) {
    const token = req.cookies.get(TOKEN_COOKIE)?.value;
    const isLogin = req.nextUrl.pathname === "/login";

    if (!token && !isLogin) {
        return NextResponse.redirect(new URL("/login", req.url));
    }
    if (token && isLogin) {
        return NextResponse.redirect(new URL("/projects", req.url));
    }
    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
