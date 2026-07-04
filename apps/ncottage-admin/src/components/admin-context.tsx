"use client";

import { createContext, useContext } from "react";
import type { CurrentAdmin } from "@/lib/session";

const AdminContext = createContext<CurrentAdmin | null>(null);

export function AdminProvider({
    admin,
    children,
}: {
    admin: CurrentAdmin;
    children: React.ReactNode;
}) {
    return (
        <AdminContext.Provider value={admin}>{children}</AdminContext.Provider>
    );
}

export function useIsAdmin(): boolean {
    return useContext(AdminContext)?.role === "admin";
}
