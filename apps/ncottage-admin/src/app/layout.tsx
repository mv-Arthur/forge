import type { Metadata } from "next";
import { AppShell } from "@/components/layout/app-shell";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";
import { getCurrentAdmin } from "@/lib/session";
import "./globals.css";

export const metadata: Metadata = {
    title: "ncottage admin",
    description: "ncottage CMS",
};

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const admin = await getCurrentAdmin();

    return (
        <html lang="ru" suppressHydrationWarning>
            <body className="antialiased">
                <Providers>
                    {admin ? (
                        <AppShell admin={admin}>{children}</AppShell>
                    ) : (
                        children
                    )}
                    <Toaster richColors position="top-right" />
                </Providers>
            </body>
        </html>
    );
}
