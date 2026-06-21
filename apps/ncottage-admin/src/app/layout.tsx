import type { Metadata } from "next";
import Link from "next/link";
import { getToken } from "@/lib/session";
import { logoutAction } from "./actions";
import "./globals.css";

export const metadata: Metadata = {
    title: "ncottage admin",
};

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const token = await getToken();

    return (
        <html lang="ru">
            <body>
                {token && (
                    <header className="topbar">
                        <strong>ncottage admin</strong>
                        <nav>
                            <Link href="/projects">Проекты</Link>
                            <Link href="/leads">Заявки</Link>
                        </nav>
                        <form action={logoutAction}>
                            <button type="submit" className="secondary">
                                Выйти
                            </button>
                        </form>
                    </header>
                )}
                <main className="container">{children}</main>
            </body>
        </html>
    );
}
