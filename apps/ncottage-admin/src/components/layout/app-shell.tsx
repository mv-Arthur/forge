import { AppSidebar } from "@/components/layout/app-sidebar";
import { Topbar } from "@/components/layout/topbar";
import type { CurrentAdmin } from "@/lib/session";

export function AppShell({
    admin,
    children,
}: {
    admin: CurrentAdmin;
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-background text-foreground">
            <AppSidebar />
            <div className="flex min-w-0 flex-1 flex-col">
                <Topbar admin={admin} />
                <main className="flex-1 p-6 lg:p-8">{children}</main>
            </div>
        </div>
    );
}
