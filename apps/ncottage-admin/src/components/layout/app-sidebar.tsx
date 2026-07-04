import { Building2 } from "lucide-react";
import { SidebarNav } from "./sidebar-nav";

export function AppSidebar() {
    return (
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground md:flex">
            <div className="flex h-14 items-center gap-2 border-b border-sidebar-border px-5">
                <span className="flex size-7 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                    <Building2 className="size-4" />
                </span>
                <span className="font-semibold tracking-tight">ncottage</span>
                <span className="rounded bg-sidebar-accent px-1.5 py-0.5 text-[10px] font-medium text-sidebar-foreground/60 uppercase">
                    CMS
                </span>
            </div>
            <SidebarNav />
        </aside>
    );
}
