"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useIsAdmin } from "@/components/admin-context";
import { NAV_SECTIONS } from "@/lib/nav";
import { cn } from "@/lib/utils";

function isActive(pathname: string, href: string): boolean {
    return pathname === href || pathname.startsWith(`${href}/`);
}

export function SidebarNav() {
    const pathname = usePathname();
    const isAdmin = useIsAdmin();

    const sections = NAV_SECTIONS.map((section) => ({
        ...section,
        items: section.items.filter((item) => !item.adminOnly || isAdmin),
    })).filter((section) => section.items.length > 0);

    return (
        <nav className="flex flex-1 flex-col gap-6 overflow-y-auto px-3 py-4">
            {sections.map((section) => (
                <div key={section.label} className="flex flex-col gap-1">
                    <p className="px-3 pb-1 text-xs font-medium text-sidebar-foreground/50 uppercase tracking-wider">
                        {section.label}
                    </p>
                    {section.items.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(pathname, item.href);

                        if (item.disabled) {
                            return (
                                <span
                                    key={item.href}
                                    aria-disabled
                                    className="flex cursor-not-allowed items-center gap-3 rounded-md px-3 py-2 text-sm text-sidebar-foreground/40"
                                >
                                    <Icon className="size-4" />
                                    <span>{item.label}</span>
                                    {item.badge && (
                                        <span className="ml-auto rounded-full bg-sidebar-accent px-2 py-0.5 text-[10px] font-medium text-sidebar-foreground/50">
                                            {item.badge}
                                        </span>
                                    )}
                                </span>
                            );
                        }

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                    active
                                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                        : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
                                )}
                            >
                                <Icon className="size-4" />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </div>
            ))}
        </nav>
    );
}
