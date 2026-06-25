import type { LucideIcon } from "lucide-react";
import {
    Building2,
    FileText,
    ImageIcon,
    Inbox,
    Newspaper,
    Users,
} from "lucide-react";

export interface NavItem {
    label: string;
    href: string;
    icon: LucideIcon;
    disabled?: boolean;
    badge?: string;
    adminOnly?: boolean;
}

export interface NavSection {
    label: string;
    items: NavItem[];
}

// Sidebar information architecture. Disabled items are wired up in later epics,
// shown now so the structure is visible.
export const NAV_SECTIONS: NavSection[] = [
    {
        label: "Управление",
        items: [
            { label: "Проекты", href: "/projects", icon: Building2 },
            { label: "Лиды", href: "/leads", icon: Inbox },
            {
                label: "Пользователи",
                href: "/users",
                icon: Users,
                adminOnly: true,
            },
        ],
    },
    {
        label: "Контент сайта",
        items: [
            { label: "Медиа", href: "/media", icon: ImageIcon },
            { label: "Блог", href: "/blog", icon: Newspaper },
            { label: "Контент", href: "/content", icon: FileText },
        ],
    },
];
