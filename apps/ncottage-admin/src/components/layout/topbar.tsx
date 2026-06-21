"use client";

import { ChevronDown, LogOut } from "lucide-react";
import { logoutAction } from "@/app/actions";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { CurrentAdmin } from "@/lib/session";

function initials(email: string): string {
    return email.slice(0, 2).toUpperCase();
}

export function Topbar({ admin }: { admin: CurrentAdmin }) {
    return (
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/80">
            <Breadcrumbs />
            <div className="ml-auto">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button
                            type="button"
                            className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent"
                        >
                            <Avatar className="size-7">
                                <AvatarFallback className="text-xs">
                                    {initials(admin.email)}
                                </AvatarFallback>
                            </Avatar>
                            <span className="hidden max-w-[180px] truncate text-muted-foreground sm:block">
                                {admin.email}
                            </span>
                            <ChevronDown className="size-4 text-muted-foreground" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel className="flex flex-col gap-0.5">
                            <span className="text-sm font-medium">Аккаунт</span>
                            <span className="truncate text-xs font-normal text-muted-foreground">
                                {admin.email}
                            </span>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <form action={logoutAction}>
                            <DropdownMenuItem asChild>
                                <button
                                    type="submit"
                                    className="w-full cursor-pointer"
                                >
                                    <LogOut className="size-4" />
                                    Выйти
                                </button>
                            </DropdownMenuItem>
                        </form>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
